import { realpath, readFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const REQUIRED_PEERS = [
  'react',
  'react-dom',
  '@mui/material',
  '@mui/icons-material',
  '@emotion/react',
  '@emotion/styled',
];

export const OPTIONAL_PEERS = [
  '@mui/x-date-pickers',
  '@mui/x-date-pickers-pro',
  '@mui/x-data-grid',
  '@mui/base',
  'dayjs',
];

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const DESIGN_MANIFEST = join(root, 'packages/ratan-design-origin/package.json');
const DESIGN_IMPORTER = join(root, 'packages/ratan-design-origin/dist/index.js');
const HOSTS = [
  { name: 'Base', workspace: 'web/mfe-base-origin' },
  { name: 'Ratan', workspace: 'web/mfe-ratan-container-origin' },
  { name: 'Cashflow', workspace: 'web/mfe-cashflow-blotter-origin' },
];

function parseVersion(value) {
  const match = String(value)
    .trim()
    .match(/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/);
  if (!match) return undefined;

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4]?.split('.') ?? [],
  };
}

function compareVersions(left, right) {
  for (const key of ['major', 'minor', 'patch']) {
    if (left[key] !== right[key]) return left[key] < right[key] ? -1 : 1;
  }
  if (left.prerelease.length === 0 || right.prerelease.length === 0) {
    return left.prerelease.length === right.prerelease.length
      ? 0
      : left.prerelease.length === 0
        ? 1
        : -1;
  }

  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = left.prerelease[index];
    const rightPart = right.prerelease[index];
    if (leftPart === undefined || rightPart === undefined) {
      return leftPart === rightPart ? 0 : leftPart === undefined ? -1 : 1;
    }
    if (leftPart === rightPart) continue;
    const leftNumber = /^\d+$/.test(leftPart) ? Number(leftPart) : undefined;
    const rightNumber = /^\d+$/.test(rightPart) ? Number(rightPart) : undefined;
    if (leftNumber !== undefined && rightNumber !== undefined) {
      return leftNumber < rightNumber ? -1 : 1;
    }
    if (leftNumber !== undefined || rightNumber !== undefined) {
      return leftNumber !== undefined ? -1 : 1;
    }
    return leftPart < rightPart ? -1 : 1;
  }
  return 0;
}

function upperBound(operator, version) {
  if (operator === '~') {
    return { major: version.major, minor: version.minor + 1, patch: 0, prerelease: [] };
  }
  if (version.major > 0) {
    return { major: version.major + 1, minor: 0, patch: 0, prerelease: [] };
  }
  if (version.minor > 0) {
    return { major: 0, minor: version.minor + 1, patch: 0, prerelease: [] };
  }
  return { major: 0, minor: 0, patch: version.patch + 1, prerelease: [] };
}

function satisfiesComparator(version, comparator) {
  const match = comparator.match(/^(>=|<=|>|<|=)?\s*(v?.+)$/);
  if (!match) return false;
  const expected = parseVersion(match[2]);
  if (!expected) return false;
  const comparison = compareVersions(version, expected);
  switch (match[1] ?? '=') {
    case '>=':
      return comparison >= 0;
    case '<=':
      return comparison <= 0;
    case '>':
      return comparison > 0;
    case '<':
      return comparison < 0;
    default:
      return comparison === 0;
  }
}

export function satisfiesVersion(versionValue, rangeValue) {
  const version = parseVersion(versionValue);
  if (!version) return false;

  return String(rangeValue)
    .split('||')
    .some((alternative) => {
      const range = alternative.trim();
      if (range === '' || range === '*') return true;
      if (range.startsWith('^') || range.startsWith('~')) {
        const minimum = parseVersion(range.slice(1));
        if (!minimum) return false;
        const maximum = upperBound(range[0], minimum);
        const includesPrerelease = minimum.prerelease.length > 0;
        if (version.prerelease.length > 0 && !includesPrerelease) return false;
        return compareVersions(version, minimum) >= 0 && compareVersions(version, maximum) < 0;
      }
      const comparators = range.split(/\s+/).filter(Boolean);
      return (
        comparators.length > 0 && comparators.every((item) => satisfiesComparator(version, item))
      );
    });
}

export function verifyHostDependencies(host, designManifest) {
  const failures = [];
  const checked = { required: 0, optional: 0 };
  const peers = designManifest.peerDependencies ?? {};
  const optionalMeta = designManifest.peerDependenciesMeta ?? {};

  for (const packageName of REQUIRED_PEERS) {
    if (!peers[packageName]) {
      failures.push(`ratan-design-origin must declare required peer ${packageName}`);
      continue;
    }
    if (!Object.hasOwn(host.dependencies, packageName)) {
      failures.push(`${host.name} must declare required dependency ${packageName}`);
      continue;
    }
    checked.required += 1;
    verifyResolution({
      failures,
      host,
      packageName,
      peerRange: peers[packageName],
      requireIdentity: true,
    });
  }

  for (const packageName of OPTIONAL_PEERS) {
    if (!peers[packageName] || optionalMeta[packageName]?.optional !== true) {
      failures.push(`ratan-design-origin must declare optional peer ${packageName}`);
      continue;
    }
    if (!Object.hasOwn(host.dependencies, packageName)) continue;
    checked.optional += 1;
    verifyResolution({
      failures,
      host,
      packageName,
      peerRange: peers[packageName],
      requireIdentity: false,
    });
  }

  return { failures, checked };
}

function verifyResolution({ failures, host, packageName, peerRange, requireIdentity }) {
  const resolution = host.resolutions[packageName];
  if (!resolution) {
    failures.push(`${host.name} cannot resolve declared dependency ${packageName}`);
    return;
  }
  if (resolution.error) {
    failures.push(`${host.name} cannot resolve ${packageName}: ${resolution.error}`);
    return;
  }

  const hostRange = host.dependencies[packageName];
  if (!satisfiesVersion(resolution.version, hostRange)) {
    failures.push(
      `${host.name} resolves ${packageName}@${resolution.version}, which does not satisfy host declaration ${hostRange}`,
    );
  }
  if (!satisfiesVersion(resolution.version, peerRange)) {
    failures.push(
      `${host.name} resolves ${packageName}@${resolution.version}, which does not satisfy ratan-design-origin ${peerRange}`,
    );
  }
  if (resolution.packageVersion && resolution.packageVersion !== resolution.version) {
    failures.push(
      `${host.name} resolves ${packageName} as ${resolution.version} for host imports and ` +
        `${resolution.packageVersion} for ratan-design-origin imports`,
    );
  }
  if (requireIdentity && resolution.hostPath !== resolution.packagePath) {
    failures.push(
      `${host.name} resolves ${packageName} to duplicate instances: ` +
        `${resolution.hostPath} (host) and ${resolution.packagePath} (ratan-design-origin)`,
    );
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function findPackageManifest(resolvedId, packageName) {
  const withoutQuery = resolvedId.split('?')[0];
  let current = dirname(
    withoutQuery.startsWith('file:') ? fileURLToPath(withoutQuery) : withoutQuery,
  );

  while (isAbsolute(current)) {
    const manifestPath = join(current, 'package.json');
    try {
      const manifest = await readJson(manifestPath);
      if (manifest.name === packageName) {
        return { manifest, path: await realpath(current) };
      }
    } catch {
      // Continue through package subdirectories until the matching manifest is found.
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  throw new Error(`cannot locate ${packageName} manifest from ${resolvedId}`);
}

async function resolvePackage(resolver, packageName, importer) {
  const resolvedId = await resolver(packageName, importer);
  if (!resolvedId) throw new Error(`Vite returned no resolution from ${importer}`);
  return findPackageManifest(resolvedId, packageName);
}

export async function collectHostEvidence({ name, workspace }) {
  const workspaceRoot = join(root, workspace);
  const hostManifest = await readJson(join(workspaceRoot, 'package.json'));
  const { resolveConfig } = await import('vite');
  const viteConfig = await resolveConfig(
    { configFile: join(workspaceRoot, 'vite.config.ts'), root: workspaceRoot },
    'build',
    'production',
  );
  const resolver = viteConfig.createResolver();
  const dependencies = hostManifest.dependencies ?? {};
  const resolutions = {};

  for (const packageName of [...REQUIRED_PEERS, ...OPTIONAL_PEERS]) {
    if (!Object.hasOwn(dependencies, packageName)) continue;
    try {
      const [hostResolution, packageResolution] = await Promise.all([
        resolvePackage(resolver, packageName, join(workspaceRoot, 'src/index.tsx')),
        resolvePackage(resolver, packageName, DESIGN_IMPORTER),
      ]);
      resolutions[packageName] = {
        version: hostResolution.manifest.version,
        packageVersion: packageResolution.manifest.version,
        hostPath: hostResolution.path,
        packagePath: packageResolution.path,
      };
    } catch (error) {
      resolutions[packageName] = { error: error.message };
    }
  }

  return { name, dependencies, resolutions };
}

export async function runDependencyIsolationCheck() {
  const designManifest = await readJson(DESIGN_MANIFEST);
  const failures = [];

  for (const hostConfig of HOSTS) {
    const host = await collectHostEvidence(hostConfig);
    const result = verifyHostDependencies(host, designManifest);
    failures.push(...result.failures);
    const versions = [...REQUIRED_PEERS, ...OPTIONAL_PEERS]
      .filter((packageName) => host.resolutions[packageName]?.version)
      .map((packageName) => `${packageName}@${host.resolutions[packageName].version}`)
      .join(', ');
    console.log(
      `${host.name}: ${result.checked.required} required, ${result.checked.optional} optional; ${versions}`,
    );
  }

  if (failures.length > 0) {
    throw new Error(
      'Dependency isolation check failed:\n' + failures.map((line) => `- ${line}`).join('\n'),
    );
  }
  console.log('Dependency isolation check passed for Base, Ratan, and Cashflow.');
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  try {
    await runDependencyIsolationCheck();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
