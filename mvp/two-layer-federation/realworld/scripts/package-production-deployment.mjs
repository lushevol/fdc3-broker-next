import { execFileSync } from 'node:child_process';
import { cp, lstat, mkdir, readFile, rename, symlink, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  assertSecretFreeTree,
  buildRuntimeRegistry,
  createReleaseMetadata,
  createReleaseId,
  digestDirectory,
} from './production-deployment-lib.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const realworldRoot = path.resolve(scriptDirectory, '..');
const repositoryRoot = path.resolve(realworldRoot, '../../..');
const runtimeRoot = path.join(realworldRoot, 'devops', 'runtime');
const environments = ['dev', 'test'];
const deployables = [
  {
    id: 'portal-host',
    workspace: 'portal-host',
    host: true,
    sharedRuntimePackages: ['react', 'react-dom'],
  },
  { id: 'cashflow', workspace: 'mfe-cashflow' },
];

function gitValue(args, fallback) {
  try {
    return execFileSync('git', args, { cwd: repositoryRoot, encoding: 'utf8' }).trim() || fallback;
  } catch {
    return fallback;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function pathExists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function writeJsonAtomic(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporaryPath, filePath);
}

async function activateHost(environment, releaseId) {
  const environmentRoot = path.join(runtimeRoot, 'environments', environment);
  await mkdir(environmentRoot, { recursive: true });
  const linkPath = path.join(environmentRoot, 'host');
  const temporaryPath = path.join(environmentRoot, '.host.next');
  if (await pathExists(temporaryPath)) {
    const entry = await lstat(temporaryPath);
    if (!entry.isSymbolicLink())
      throw new Error(`Refusing to replace non-symlink ${temporaryPath}`);
    await unlink(temporaryPath);
  }
  await symlink(path.join('..', '..', 'artifacts', 'portal-host', releaseId), temporaryPath);
  await rename(temporaryPath, linkPath);
}

async function publishDeployable(deployable, releaseContext, releaseDefinition) {
  const workspaceRoot = path.join(realworldRoot, 'apps', deployable.workspace);
  const source = path.join(workspaceRoot, 'dist');
  if (!(await pathExists(source))) throw new Error(`Missing production build: ${source}`);
  await assertSecretFreeTree(source);

  const packageJson = await readJson(path.join(workspaceRoot, 'package.json'));
  const digest = await digestDirectory(source);
  const releaseId = createReleaseId(packageJson.version, digest);
  const destination = path.join(runtimeRoot, 'artifacts', deployable.id, releaseId);
  if (await pathExists(destination)) {
    const publishedDigest = await digestDirectory(destination);
    if (publishedDigest !== digest)
      throw new Error(`Immutable artifact overwrite rejected: ${destination}`);
  } else {
    const staging = path.join(runtimeRoot, '.staging', `${deployable.id}-${releaseId}`);
    await mkdir(path.dirname(staging), { recursive: true });
    await cp(source, staging, { recursive: true, errorOnExist: true });
    await mkdir(path.dirname(destination), { recursive: true });
    await rename(staging, destination);
  }

  const sharedRuntimeRanges = Object.fromEntries(
    (deployable.sharedRuntimePackages ?? []).map((packageName) => {
      const requiredVersion = packageJson.dependencies?.[packageName];
      if (!requiredVersion) {
        throw new Error(`${deployable.id} is missing shared runtime dependency ${packageName}`);
      }
      return [packageName, requiredVersion];
    }),
  );
  const metadata = createReleaseMetadata({
    applicationId: deployable.id,
    packageName: packageJson.name,
    version: packageJson.version,
    releaseId,
    digestAlgorithm: 'sha256',
    digest,
    sourceRevision: releaseContext.sourceRevision,
    buildId: releaseContext.buildId,
    artifactPath: `artifacts/${deployable.id}/${releaseId}`,
    createdAt: releaseContext.createdAt,
    contract: releaseDefinition.contract,
    capabilities: releaseDefinition.capabilities,
    sharedRuntimeRanges,
  });
  await writeJsonAtomic(
    path.join(runtimeRoot, 'catalog', deployable.id, `${releaseId}.json`),
    metadata,
  );
  return metadata;
}

const sourceRevision = process.env.BUILD_SOURCEVERSION ?? gitValue(['rev-parse', 'HEAD'], 'local');
const buildId = process.env.BUILD_BUILDID ?? `local-${sourceRevision.slice(0, 12)}`;
const createdAt = process.env.BUILD_TIMESTAMP ?? new Date().toISOString();
const releaseContext = { sourceRevision, buildId, createdAt };
const sourceRegistry = await readJson(
  path.join(realworldRoot, 'devops', 'registry', 'applications.json'),
);
const releasePolicy = await readJson(
  path.join(realworldRoot, 'devops', 'policy', 'release-policy.json'),
);
const cashflowRegistryEntry = sourceRegistry.applications.find(({ id }) => id === 'cashflow');
if (!cashflowRegistryEntry) throw new Error('Missing Cashflow production registry entry');
const hostCapabilities = [
  ...new Set(sourceRegistry.applications.flatMap(({ capabilities }) => capabilities)),
];
const releaseDefinitions = {
  'portal-host': {
    contract: {
      supportedApplicationProtocolMajors: releasePolicy.supportedProtocolMajors,
    },
    capabilities: hostCapabilities,
  },
  cashflow: {
    contract: {
      application: cashflowRegistryEntry.contractVersion,
      appearance: cashflowRegistryEntry.appearanceContractVersion,
      identity: cashflowRegistryEntry.identityContractVersion,
    },
    capabilities: cashflowRegistryEntry.capabilities,
  },
};
const published = {};

for (const deployable of deployables) {
  published[deployable.id] = await publishDeployable(
    deployable,
    releaseContext,
    releaseDefinitions[deployable.id],
  );
}

const environmentConfiguration = await readJson(
  path.join(realworldRoot, 'devops', 'registry', 'environments.json'),
);
const releases = Object.fromEntries(
  Object.entries(published).map(([id, metadata]) => [
    id,
    { releaseId: metadata.releaseId, digest: metadata.digest },
  ]),
);
for (const environment of environments) {
  const publicOrigin = environmentConfiguration[environment]?.publicOrigin;
  if (!publicOrigin) throw new Error(`Missing public origin for ${environment}`);
  const registry = buildRuntimeRegistry({
    entries: sourceRegistry.applications,
    releases,
    origin: publicOrigin,
  });
  const revisionId = `${environment}-${String(buildId).replace(/[^0-9A-Za-z.-]/g, '-')}`;
  const revision = {
    schemaVersion: 1,
    revisionId,
    environment,
    createdAt,
    sourceRevision,
    releases: Object.fromEntries(Object.entries(releases).filter(([id]) => id !== 'portal-host')),
    registry,
  };
  await writeJsonAtomic(
    path.join(runtimeRoot, 'registries', 'revisions', `${revisionId}.json`),
    revision,
  );
  await writeJsonAtomic(
    path.join(runtimeRoot, 'registries', 'active', `${environment}.json`),
    registry,
  );
  await writeJsonAtomic(
    path.join(runtimeRoot, 'registries', 'active', `${environment}.pointer.json`),
    {
      schemaVersion: 1,
      environment,
      revisionId,
      revisionUrl: `/registries/revisions/${revisionId}.json`,
    },
  );
  await activateHost(environment, published['portal-host'].releaseId);
}

await writeJsonAtomic(path.join(runtimeRoot, 'catalog', 'build.json'), {
  schemaVersion: 1,
  ...releaseContext,
  environments,
  releases: published,
});

console.log(
  `Packaged ${deployables.length} immutable deployables for ${environments.join(' and ')}.`,
);
for (const [id, metadata] of Object.entries(published)) console.log(`${id}: ${metadata.releaseId}`);
