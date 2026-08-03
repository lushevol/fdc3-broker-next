import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const REVALIDATE_CACHE_CONTROL = 'no-store, max-age=0';

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:API_KEY|SECRET|PASSWORD|ACCESS_TOKEN)\s*[:=]\s*["'][^"']{8,}["']/i,
  /\bsk_(?:live|prod)_[A-Za-z0-9_-]{8,}/,
];

async function listFiles(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(root, absolutePath)));
    if (entry.isFile())
      files.push({
        absolutePath,
        relativePath: path.relative(root, absolutePath).split(path.sep).join('/'),
      });
  }
  return files;
}

export async function digestDirectory(root) {
  const digest = createHash('sha256');
  for (const file of await listFiles(root)) {
    digest.update(`${file.relativePath}\0`);
    digest.update(await readFile(file.absolutePath));
    digest.update('\0');
  }
  return digest.digest('hex');
}

export async function assertSecretFreeTree(root) {
  for (const file of await listFiles(root)) {
    const bytes = await readFile(file.absolutePath);
    if (bytes.includes(0)) continue;
    const content = bytes.toString('utf8');
    if (secretPatterns.some((pattern) => pattern.test(content))) {
      throw new Error(`Possible secret detected in browser artifact ${file.relativePath}`);
    }
  }
}

export function cachePolicyForPath(requestPath) {
  if (requestPath.startsWith('/artifacts/') || requestPath.startsWith('/registries/revisions/'))
    return 'immutable';
  return 'revalidate';
}

export function cacheControlForPath(requestPath) {
  return cachePolicyForPath(requestPath) === 'immutable'
    ? IMMUTABLE_CACHE_CONTROL
    : REVALIDATE_CACHE_CONTROL;
}

export function validateRuntimeRegistry(registry, { trustedOrigins = [] } = {}) {
  if (!registry || !Array.isArray(registry.applications) || registry.applications.length === 0) {
    throw new Error('Runtime registry must contain at least one application');
  }
  const ids = new Set();
  const basePaths = new Set();
  for (const entry of registry.applications) {
    if (ids.has(entry.id)) throw new Error(`Duplicate application id: ${entry.id}`);
    if (basePaths.has(entry.basePath)) throw new Error(`Duplicate basePath: ${entry.basePath}`);
    ids.add(entry.id);
    basePaths.add(entry.basePath);

    let manifestUrl;
    try {
      manifestUrl = new URL(entry.manifestUrl);
    } catch {
      throw new Error(
        `${entry.id} manifestUrl must be an absolute same-origin immutable artifact URL`,
      );
    }
    if (
      manifestUrl.protocol !== 'https:' ||
      !manifestUrl.pathname.startsWith(`/artifacts/${entry.id}/`)
    ) {
      throw new Error(
        `${entry.id} manifestUrl must be an absolute same-origin immutable artifact URL`,
      );
    }
    if (trustedOrigins.length > 0 && !trustedOrigins.includes(manifestUrl.origin)) {
      throw new Error(`${entry.id} manifestUrl uses an untrusted origin`);
    }
    if (/(?:^|\/)latest(?:\/|$)/i.test(manifestUrl.pathname)) {
      throw new Error(`${entry.id} manifestUrl contains a mutable release alias`);
    }
    if (!/\/mf-manifest\.json$/.test(manifestUrl.pathname)) {
      throw new Error(`${entry.id} manifestUrl must select mf-manifest.json`);
    }
  }
  return registry;
}

export function buildRuntimeRegistry({ entries, releases, origin }) {
  const publicOrigin = new URL(origin).origin;
  const applications = entries.map((entry) => {
    const release = releases[entry.id];
    if (!release?.releaseId || !release?.digest)
      throw new Error(`Missing release identity for ${entry.id}`);
    return {
      ...entry,
      manifestUrl: `${publicOrigin}/artifacts/${entry.id}/${release.releaseId}/mf-manifest.json`,
    };
  });
  return validateRuntimeRegistry({ applications }, { trustedOrigins: [publicOrigin] });
}

export function createReleaseId(version, digest) {
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version))
    throw new Error(`Invalid semantic version: ${version}`);
  if (!/^[a-f0-9]{64}$/.test(digest)) throw new Error('Release digest must be a SHA-256 hex value');
  return `${version}-sha256-${digest.slice(0, 16)}`;
}
