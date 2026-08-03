/**
 * knowledgeBaseConfig.js
 *
 * Loads and merges configuration for the remote knowledge-base resolver.
 * Priority (highest → lowest):
 *   1. Environment variables
 *   2. ~/.scdevkit/config.json  (user-level persistent config)
 *   3. Built-in defaults
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULTS = {
  /** Artifactory base URL (without trailing slash) */
  artifactoryBaseUrl: 'https://artifactory.global.standardchartered.com/artifactory',

  /** npm package name published to Artifactory */
  knowledgeBasePackage: '55313-knowledge-base',

  /**
   * Semver range or "latest".
   * Examples: "latest", "^1.0.0", "1.3.2"
   */
  knowledgeBaseVersion: 'latest',

  /**
   * How long (in seconds) a downloaded & extracted package is considered fresh.
   * Default: 24 hours.  Set to 0 to always re-download.
   */
  cacheMaxAgeSeconds: 86400,

  /**
   * When true (default), fall back to the CLI's bundled agents/skills if the
   * remote package cannot be fetched or extracted.
   */
  fallbackToLocal: true,
};

// ── User config file path ─────────────────────────────────────────────────────

const USER_CONFIG_PATH = path.join(os.homedir(), '.scdevkit', 'config.json');

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Reads a JSON file and returns its contents as a plain object.
 * Returns {} if the file does not exist or cannot be parsed.
 *
 * @param {string} filePath
 * @returns {object}
 */
function readConfigFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Coerces a string value to boolean.
 * "false" / "0" / "no" → false; anything else truthy → true.
 *
 * @param {string|undefined} value
 * @param {boolean} fallback
 * @returns {boolean}
 */
function parseBool(value, fallback) {
  if (value === undefined || value === null) return fallback;
  return !['false', '0', 'no'].includes(String(value).toLowerCase());
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Loads and merges all configuration sources.
 *
 * @returns {{
 *   artifactoryBaseUrl:   string,
 *   knowledgeBasePackage: string,
 *   knowledgeBaseVersion: string,
 *   cacheMaxAgeSeconds:   number,
 *   fallbackToLocal:      boolean,
 * }}
 */
export function loadConfig() {
  const userConfig = readConfigFile(USER_CONFIG_PATH);

  // Merge: defaults ← user file ← environment variables
  const artifactoryBaseUrl =
    process.env.SCDEVKIT_ARTIFACTORY_BASE_URL ??
    userConfig.artifactoryBaseUrl ??
    DEFAULTS.artifactoryBaseUrl;

  const knowledgeBasePackage =
    process.env.SCDEVKIT_KB_PACKAGE ??
    userConfig.knowledgeBasePackage ??
    DEFAULTS.knowledgeBasePackage;

  const knowledgeBaseVersion =
    process.env.SCDEVKIT_KB_VERSION ??
    userConfig.knowledgeBaseVersion ??
    DEFAULTS.knowledgeBaseVersion;

  const cacheMaxAgeSeconds =
    process.env.SCDEVKIT_CACHE_MAX_AGE !== undefined
      ? Number(process.env.SCDEVKIT_CACHE_MAX_AGE)
      : userConfig.cacheMaxAgeSeconds ?? DEFAULTS.cacheMaxAgeSeconds;

  const fallbackToLocal = parseBool(
    process.env.SCDEVKIT_FALLBACK,
    userConfig.fallbackToLocal ?? DEFAULTS.fallbackToLocal,
  );

  return {
    artifactoryBaseUrl: artifactoryBaseUrl.replace(/\/$/, ''), // strip trailing slash
    knowledgeBasePackage,
    knowledgeBaseVersion,
    cacheMaxAgeSeconds: Number.isFinite(cacheMaxAgeSeconds) ? cacheMaxAgeSeconds : DEFAULTS.cacheMaxAgeSeconds,
    fallbackToLocal,
  };
}
