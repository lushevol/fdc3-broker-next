/**
 * knowledgeBaseResolver.js
 *
 * Downloads, extracts, and caches the knowledge-base npm package from Artifactory.
 * Returns the local paths to the agents/ and skills/ directories
 * that the ai-agent-skill generator can use directly.
 *
 * Requires Node.js 18+ (uses built-in fetch and stream APIs).
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import semver from 'semver';

// ── Cache layout ──────────────────────────────────────────────────────────────
//
//  ~/.scdevkit/
//  ├── cache/
//  │   ├── version-cache.json          ← resolved version, TTL=1h
//  │   └── kb-{version}/
//  │       ├── .cache-meta.json        ← { version, downloadedAt, sourceUrl }
//  │       ├── agents/
//  │       │   ├── sb-plugin-ui/figma-to-scwebkit/   ← agent packages
//  │       │   └── sb-plugin-api/compile-to-native/
//  │       └── skills/
//  │           └── sb/                               ← category/skill structure

const SCDEVKIT_DIR = path.join(os.homedir(), '.scdevkit');
const CACHE_DIR = path.join(SCDEVKIT_DIR, 'cache');
const VERSION_CACHE_PATH = path.join(CACHE_DIR, 'version-cache.json');

/** TTL for the resolved-version cache (milliseconds) */
const VERSION_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Main entry point.
 * Resolves, downloads (if needed), and returns local paths to cli-assets.
 *
 * @param {{
 *   artifactoryBaseUrl:   string,
 *   knowledgeBasePackage: string,
 *   knowledgeBaseVersion: string,
 *   cacheMaxAgeSeconds:   number,
 * }} config
 * @returns {Promise<{ agentsDir: string, skillsDir: string }>}
 * @throws {Error} when the remote package cannot be obtained
 */
export async function resolveKnowledgeBase(config) {
  const version = await resolveLatestVersion(config);
  const cacheDir = path.join(CACHE_DIR, `kb-${version}`);

  if (isCacheValid(cacheDir, config.cacheMaxAgeSeconds)) {
    return buildResult(cacheDir);
  }

  // Cache miss or expired → download fresh copy
  await downloadAndExtract(config, version, cacheDir);
  writeCacheMeta(cacheDir, {
    version,
    downloadedAt: new Date().toISOString(),
    sourceUrl: buildTgzUrl(config, version),
  });

  return buildResult(cacheDir);
}

// ── Version resolution ────────────────────────────────────────────────────────

/**
 * Returns the concrete version number to use.
 * Checks a short-lived local cache first to avoid querying Artifactory on every run.
 *
 * @param {object} config
 * @returns {Promise<string>}
 */
async function resolveLatestVersion(config) {
  // If a pinned version is given (not a range and not "latest"), use it directly.
  const range = config.knowledgeBaseVersion;
  if (range !== 'latest' && semver.valid(range)) {
    return semver.clean(range);
  }

  // Check version cache
  const cached = readVersionCache(config.knowledgeBasePackage, range);
  if (cached) return cached;

  // Fetch from Artifactory npm registry API
  const version = await fetchLatestVersionFromArtifactory(config);
  writeVersionCache(config.knowledgeBasePackage, range, version);
  return version;
}

/**
 * Queries the Artifactory npm registry endpoint for all versions of the package
 * and returns the highest version satisfying the configured semver range.
 *
 * Artifactory npm registry: GET {base}/api/npm/{repo}/{package}
 *
 * @param {object} config
 * @returns {Promise<string>}
 */
async function fetchLatestVersionFromArtifactory(config) {
  const repoName = 'npm-release';
  const url = `${config.artifactoryBaseUrl}/api/npm/${repoName}/${config.knowledgeBasePackage}`;

  const response = await fetchWithTimeout(url, { timeout: 10_000 });
  if (!response.ok) {
    throw new Error(
      `Artifactory npm API returned HTTP ${response.status} for ${config.knowledgeBasePackage}`,
    );
  }

  const meta = await response.json();
  const versions = Object.keys(meta.versions ?? {});
  if (versions.length === 0) {
    throw new Error(`No versions found for ${config.knowledgeBasePackage} on Artifactory`);
  }

  const range = config.knowledgeBaseVersion === 'latest' ? '*' : config.knowledgeBaseVersion;
  const resolved = semver.maxSatisfying(versions, range, { includePrerelease: true });
  if (!resolved) {
    throw new Error(
      `No version of ${config.knowledgeBasePackage} satisfies range "${config.knowledgeBaseVersion}". ` +
        `Available: ${versions.slice(-5).join(', ')}`,
    );
  }

  return resolved;
}

// ── Download & extract ────────────────────────────────────────────────────────

/**
 * Downloads the tgz for the given version and extracts cli-assets/ into cacheDir.
 *
 * @param {object} config
 * @param {string} version
 * @param {string} cacheDir  destination root, e.g. ~/.scdevkit/cache/kb-1.3.0/
 */
async function downloadAndExtract(config, version, cacheDir) {
  const url = buildTgzUrl(config, version);
  const tmpTgz = path.join(os.tmpdir(), `scdevkit-kb-${version}-${Date.now()}.tgz`);

  try {
    // 1. Download
    await downloadFile(url, tmpTgz);

    // 2. Extract only cli-assets/ from the tgz
    //    npm tgz top-level is always "package/", so we strip that prefix.
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
    fs.mkdirSync(cacheDir, { recursive: true });

    await extractTarGz(tmpTgz, cacheDir);
  } finally {
    // Clean up temp file regardless of success/failure
    try {
      if (fs.existsSync(tmpTgz)) fs.rmSync(tmpTgz);
    } catch {
      // ignore cleanup errors
    }
  }
}

/**
 * Builds the Artifactory tgz download URL.
 *
 * @param {object} config
 * @param {string} version
 * @returns {string}
 */
function buildTgzUrl(config, version) {
  const pkg = config.knowledgeBasePackage;
  return `${config.artifactoryBaseUrl}/npm-release/${pkg}/-/${pkg}-${version}.tgz`;
}

/**
 * Streams a remote URL to a local file.
 *
 * @param {string} url
 * @param {string} destPath
 */
async function downloadFile(url, destPath) {
  const response = await fetchWithTimeout(url, { timeout: 30_000 });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }

  const writeStream = fs.createWriteStream(destPath);
  // response.body is a Web ReadableStream; convert to Node.js Readable
  await pipeline(Readable.fromWeb(response.body), writeStream);
}

/**
 * Extracts a .tar.gz archive, stripping the top-level "package/" prefix that
 * npm tarballs include, into destDir.
 *
 * Uses only Node.js built-ins (zlib + manual tar parsing).
 *
 * @param {string} tgzPath   source .tgz file
 * @param {string} destDir   extraction destination
 */
async function extractTarGz(tgzPath, destDir) {
  const fileStream = fs.createReadStream(tgzPath);
  const gunzip = createGunzip();

  // Collect decompressed bytes
  const chunks = [];
  await pipeline(fileStream, gunzip, async function* (source) {
    for await (const chunk of source) {
      chunks.push(chunk);
    }
  });

  const tarBuffer = Buffer.concat(chunks);
  parseTar(tarBuffer, destDir);
}

/**
 * Minimal tar parser that extracts files from a tar buffer into destDir,
 * stripping the first path component (npm's "package/" prefix).
 *
 * Supports only regular files and directories (sufficient for npm tarballs).
 *
 * @param {Buffer} buffer
 * @param {string} destDir
 */
function parseTar(buffer, destDir) {
  let offset = 0;

  while (offset + 512 <= buffer.length) {
    const header = buffer.slice(offset, offset + 512);

    // End-of-archive: two consecutive 512-byte zero blocks
    if (header.every((b) => b === 0)) break;

    const name = readString(header, 0, 100);
    const typeFlag = String.fromCharCode(header[156]);
    const size = parseInt(readString(header, 124, 12).trim(), 8) || 0;

    offset += 512; // advance past header

    if (!name) {
      offset += Math.ceil(size / 512) * 512;
      continue;
    }

    // Strip first path component ("package/foo" → "foo")
    const parts = name.replace(/^\.\//, '').split('/');
    parts.shift(); // remove "package"
    const relativePath = parts.join('/');

    if (relativePath) {
      const destPath = path.join(destDir, relativePath);

      if (typeFlag === '5' || name.endsWith('/')) {
        // Directory
        fs.mkdirSync(destPath, { recursive: true });
      } else if (typeFlag === '0' || typeFlag === '\0') {
        // Regular file
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        const fileData = buffer.slice(offset, offset + size);
        fs.writeFileSync(destPath, fileData);
      }
    }

    offset += Math.ceil(size / 512) * 512;
  }
}

/**
 * Reads a null-terminated string from a Buffer.
 * @param {Buffer} buf
 * @param {number} start
 * @param {number} length
 * @returns {string}
 */
function readString(buf, start, length) {
  const slice = buf.slice(start, start + length);
  const end = slice.indexOf(0);
  return slice.slice(0, end === -1 ? length : end).toString('utf8');
}

// ── Cache helpers ─────────────────────────────────────────────────────────────

/**
 * Returns true if cacheDir exists and its .cache-meta.json indicates the
 * content is still within the allowed age.
 *
 * @param {string} cacheDir
 * @param {number} maxAgeSeconds
 * @returns {boolean}
 */
function isCacheValid(cacheDir, maxAgeSeconds) {
  if (!fs.existsSync(cacheDir)) return false;
  if (maxAgeSeconds === 0) return false; // force refresh

  const metaPath = path.join(cacheDir, '.cache-meta.json');
  if (!fs.existsSync(metaPath)) return false;

  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const downloadedAt = new Date(meta.downloadedAt).getTime();
    const ageMs = Date.now() - downloadedAt;
    return ageMs < maxAgeSeconds * 1000;
  } catch {
    return false;
  }
}

/**
 * Writes .cache-meta.json into cacheDir.
 *
 * @param {string} cacheDir
 * @param {{ version: string, downloadedAt: string, sourceUrl: string }} meta
 */
function writeCacheMeta(cacheDir, meta) {
  const metaPath = path.join(cacheDir, '.cache-meta.json');
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
}

// ── Version cache helpers ─────────────────────────────────────────────────────

/**
 * Reads the version cache and returns a previously resolved version if still valid.
 *
 * @param {string} packageName
 * @param {string} range
 * @returns {string|null}
 */
function readVersionCache(packageName, range) {
  try {
    const cache = JSON.parse(fs.readFileSync(VERSION_CACHE_PATH, 'utf8'));
    const entry = cache?.[packageName]?.[range];
    if (!entry) return null;

    const age = Date.now() - new Date(entry.cachedAt).getTime();
    if (age > VERSION_CACHE_TTL_MS) return null;

    return entry.resolvedVersion ?? null;
  } catch {
    return null;
  }
}

/**
 * Writes a resolved version into the version cache.
 *
 * @param {string} packageName
 * @param {string} range
 * @param {string} resolvedVersion
 */
function writeVersionCache(packageName, range, resolvedVersion) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  let cache = {};
  try {
    cache = JSON.parse(fs.readFileSync(VERSION_CACHE_PATH, 'utf8'));
  } catch {
    // start fresh
  }

  if (!cache[packageName]) cache[packageName] = {};
  cache[packageName][range] = { resolvedVersion, cachedAt: new Date().toISOString() };

  fs.writeFileSync(VERSION_CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
}

// ── Utility ───────────────────────────────────────────────────────────────────

/**
 * fetch() with an AbortController-based timeout.
 *
 * @param {string} url
 * @param {{ timeout?: number }} options
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, { timeout = 15_000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Builds the { agentsDir, skillsDir } result object from the cache root.
 * The knowledge-base package exposes agents/ and skills/ directly at the top level.
 *
 * @param {string} cacheDir  e.g. ~/.scdevkit/cache/kb-1.3.0/
 * @returns {{ agentsDir: string, skillsDir: string }}
 */
function buildResult(cacheDir) {
  return {
    agentsDir: path.join(cacheDir, 'agents'),
    skillsDir: path.join(cacheDir, 'skills'),
  };
}
