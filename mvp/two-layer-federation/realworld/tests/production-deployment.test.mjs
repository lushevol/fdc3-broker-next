import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  assertSecretFreeTree,
  authorizeReleaseOperation,
  buildProductionRegistryRevision,
  buildRuntimeRegistry,
  cachePolicyForPath,
  createReleaseMetadata,
  digestDirectory,
  validateProductionRegistryCandidate,
  validateRuntimeRegistry,
} from '../scripts/production-deployment-lib.mjs';

async function fixtureTree() {
  const root = await mkdtemp(path.join(tmpdir(), 'realworld-release-'));
  await mkdir(path.join(root, 'static', 'js'), { recursive: true });
  await writeFile(path.join(root, 'index.html'), '<main>release</main>');
  await writeFile(path.join(root, 'static', 'js', 'app.abc123.js'), 'export const release = 1;');
  return root;
}

function candidateFixture() {
  const digest = 'd'.repeat(64);
  const releaseId = '1.2.3-sha256-dddddddddddddddd';
  const runtimeRegistry = buildRuntimeRegistry({
    entries: [
      {
        id: 'cashflow',
        displayName: 'Cashflow',
        remoteName: 'mfe_cashflow',
        exposedModule: './application',
        basePath: '/cashflow',
        contractVersion: '1.0.0',
        appearanceContractVersion: '1.0.0',
        identityContractVersion: '1.0.0',
        capabilities: ['workspace', 'navigation'],
      },
    ],
    releases: { cashflow: { releaseId, digest } },
    origin: 'https://portal.example',
  });
  const candidate = buildProductionRegistryRevision({
    revisionId: 'dev-42',
    environment: 'dev',
    createdAt: '2026-08-11T00:00:00.000Z',
    sourceRevision: 'abc123',
    runtimeRegistry,
    releases: {
      cashflow: {
        version: '1.2.3',
        releaseId,
        digestAlgorithm: 'sha256',
        digest,
      },
    },
    ownershipRecords: {
      cashflow: {
        applicationId: 'cashflow',
        accountableTeam: 'Cashflow team',
        supportRota: 'Cashflow on-call',
        criticality: 'tier-2',
        dataClassification: 'internal',
        slo: { availabilityPercent: 99.9, activationP95Ms: 3000 },
        releaseApprover: 'Cashflow release owner',
        rollbackContact: 'Platform on-call',
      },
    },
  });
  candidate.applications[0].releaseEvidence.signatureUrl = `https://portal.example/evidence/cashflow/${releaseId}.sigstore.json`;
  return { candidate, digest };
}

test('artifact digest is deterministic and changes with published bytes', async () => {
  const root = await fixtureTree();
  const first = await digestDirectory(root);
  const second = await digestDirectory(root);
  assert.equal(first, second);

  await writeFile(path.join(root, 'index.html'), '<main>changed</main>');
  assert.notEqual(await digestDirectory(root), first);
});

test('release metadata records artifact identity and compatibility requirements', () => {
  const metadata = createReleaseMetadata({
    applicationId: 'cashflow',
    packageName: '@fm/mfe-cashflow',
    version: '1.2.3',
    releaseId: '1.2.3-sha256-deadbeef',
    digest: 'deadbeef',
    sourceRevision: 'abc123',
    buildId: 'build-42',
    artifactPath: 'artifacts/cashflow/1.2.3-sha256-deadbeef',
    createdAt: '2026-08-10T00:00:00.000Z',
    contract: {
      application: '1.0.0',
      appearance: '1.0.0',
      identity: '1.0.0',
    },
    capabilities: ['workspace', 'navigation'],
    sharedRuntimeRanges: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
    },
  });

  assert.deepEqual(metadata, {
    schemaVersion: 2,
    applicationId: 'cashflow',
    packageName: '@fm/mfe-cashflow',
    version: '1.2.3',
    releaseId: '1.2.3-sha256-deadbeef',
    digestAlgorithm: 'sha256',
    digest: 'deadbeef',
    sourceRevision: 'abc123',
    buildId: 'build-42',
    artifactPath: 'artifacts/cashflow/1.2.3-sha256-deadbeef',
    createdAt: '2026-08-10T00:00:00.000Z',
    contract: {
      application: '1.0.0',
      appearance: '1.0.0',
      identity: '1.0.0',
    },
    capabilities: ['navigation', 'workspace'],
    sharedRuntimeRanges: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
    },
  });
});

test('runtime registry uses same-origin immutable release paths', () => {
  const registry = buildRuntimeRegistry({
    entries: [
      {
        id: 'cashflow',
        displayName: 'Cashflow',
        remoteName: 'mfe_cashflow',
        exposedModule: './application',
        basePath: '/cashflow',
        contractVersion: '1.0.0',
        appearanceContractVersion: '1.0.0',
        identityContractVersion: '1.0.0',
        capabilities: ['navigation'],
      },
    ],
    releases: { cashflow: { releaseId: '1.0.0-sha256-deadbeef', digest: 'deadbeef' } },
    origin: 'https://portal.example',
  });

  assert.equal(
    registry.applications[0].manifestUrl,
    'https://portal.example/artifacts/cashflow/1.0.0-sha256-deadbeef/mf-manifest.json',
  );
  assert.doesNotThrow(() =>
    validateRuntimeRegistry(registry, { trustedOrigins: ['https://portal.example'] }),
  );
});

test('production registry revision binds artifacts, compatibility, ownership, and evidence', () => {
  const runtimeRegistry = buildRuntimeRegistry({
    entries: [
      {
        id: 'cashflow',
        displayName: 'Cashflow',
        remoteName: 'mfe_cashflow',
        exposedModule: './application',
        basePath: '/cashflow',
        contractVersion: '1.0.0',
        appearanceContractVersion: '1.0.0',
        identityContractVersion: '1.0.0',
        capabilities: ['workspace', 'navigation'],
      },
    ],
    releases: { cashflow: { releaseId: '1.2.3-sha256-deadbeef', digest: 'deadbeef' } },
    origin: 'https://portal.example',
  });
  const ownership = {
    applicationId: 'cashflow',
    accountableTeam: 'Cashflow team',
    supportRota: 'Cashflow on-call',
    criticality: 'tier-2',
    dataClassification: 'internal',
    slo: { availabilityPercent: 99.9, activationP95Ms: 3000 },
    releaseApprover: 'Cashflow release owner',
    rollbackContact: 'Platform on-call',
  };

  const revision = buildProductionRegistryRevision({
    revisionId: 'dev-42',
    environment: 'dev',
    createdAt: '2026-08-11T00:00:00.000Z',
    sourceRevision: 'abc123',
    runtimeRegistry,
    releases: {
      cashflow: {
        version: '1.2.3',
        releaseId: '1.2.3-sha256-deadbeef',
        digestAlgorithm: 'sha256',
        digest: 'deadbeef',
      },
    },
    ownershipRecords: { cashflow: ownership },
  });

  assert.deepEqual(revision.applications, [
    {
      id: 'cashflow',
      artifact: {
        version: '1.2.3',
        releaseId: '1.2.3-sha256-deadbeef',
        digestAlgorithm: 'sha256',
        digest: 'deadbeef',
        immutableUrl:
          'https://portal.example/artifacts/cashflow/1.2.3-sha256-deadbeef/mf-manifest.json',
      },
      protocolRange: { minimumMajor: 1, maximumMajor: 1 },
      capabilities: ['navigation', 'workspace'],
      ownership,
      releaseEvidence: {
        catalogUrl: 'https://portal.example/catalog/cashflow/1.2.3-sha256-deadbeef.json',
      },
    },
  ]);
  assert.equal(revision.registry, runtimeRegistry);
});

test('production registry revision rejects an application without ownership', () => {
  const runtimeRegistry = buildRuntimeRegistry({
    entries: [
      {
        id: 'cashflow',
        displayName: 'Cashflow',
        remoteName: 'mfe_cashflow',
        exposedModule: './application',
        basePath: '/cashflow',
        contractVersion: '1.0.0',
        appearanceContractVersion: '1.0.0',
        capabilities: [],
      },
    ],
    releases: { cashflow: { releaseId: '1.2.3-sha256-deadbeef', digest: 'deadbeef' } },
    origin: 'https://portal.example',
  });

  assert.throws(
    () =>
      buildProductionRegistryRevision({
        revisionId: 'dev-42',
        environment: 'dev',
        createdAt: '2026-08-11T00:00:00.000Z',
        sourceRevision: 'abc123',
        runtimeRegistry,
        releases: {
          cashflow: {
            version: '1.2.3',
            releaseId: '1.2.3-sha256-deadbeef',
            digestAlgorithm: 'sha256',
            digest: 'deadbeef',
          },
        },
        ownershipRecords: {},
      }),
    /missing ownership record/i,
  );
});

test('production candidate validation enforces every promotion gate', async (context) => {
  const options = (digest) => ({
    trustedOrigins: ['https://portal.example'],
    supportedProtocolMajors: [1],
    availableCapabilities: ['navigation', 'workspace'],
    resolveArtifactDigest: async () => digest,
    verifySignature: async () => true,
  });

  await context.test('accepts a complete reachable and signed candidate', async () => {
    const { candidate, digest } = candidateFixture();
    assert.equal(await validateProductionRegistryCandidate(candidate, options(digest)), candidate);
  });

  await context.test('rejects an invalid schema shape', async () => {
    const { candidate, digest } = candidateFixture();
    delete candidate.applications[0].artifact.version;
    await assert.rejects(
      () => validateProductionRegistryCandidate(candidate, options(digest)),
      /schema.*artifact version/i,
    );
  });

  await context.test('rejects duplicate routes or identities', async () => {
    const { candidate, digest } = candidateFixture();
    candidate.registry.applications.push({
      ...candidate.registry.applications[0],
      id: 'other',
    });
    await assert.rejects(
      () => validateProductionRegistryCandidate(candidate, options(digest)),
      /duplicate basePath/i,
    );
  });

  await context.test('rejects an untrusted artifact origin', async () => {
    const { candidate, digest } = candidateFixture();
    candidate.applications[0].artifact.immutableUrl =
      candidate.registry.applications[0].manifestUrl =
        candidate.applications[0].artifact.immutableUrl.replace(
          'portal.example',
          'untrusted.example',
        );
    await assert.rejects(
      () => validateProductionRegistryCandidate(candidate, options(digest)),
      /untrusted origin/i,
    );
  });

  await context.test('rejects unreachable or digest-mismatched artifacts', async () => {
    const { candidate, digest } = candidateFixture();
    await assert.rejects(
      () =>
        validateProductionRegistryCandidate(candidate, {
          ...options(digest),
          resolveArtifactDigest: async () => '0'.repeat(64),
        }),
      /digest mismatch/i,
    );
    await assert.rejects(
      () =>
        validateProductionRegistryCandidate(candidate, {
          ...options(digest),
          resolveArtifactDigest: async () => {
            throw new Error('artifact unreachable');
          },
        }),
      /artifact unreachable/i,
    );
  });

  await context.test('rejects unsupported contracts or capabilities', async () => {
    const { candidate, digest } = candidateFixture();
    await assert.rejects(
      () =>
        validateProductionRegistryCandidate(candidate, {
          ...options(digest),
          supportedProtocolMajors: [2],
        }),
      /unsupported protocol range/i,
    );
    await assert.rejects(
      () =>
        validateProductionRegistryCandidate(candidate, {
          ...options(digest),
          availableCapabilities: ['navigation'],
        }),
      /unavailable capability: workspace/i,
    );
  });

  await context.test('rejects missing or invalid signatures', async () => {
    const { candidate, digest } = candidateFixture();
    delete candidate.applications[0].releaseEvidence.signatureUrl;
    await assert.rejects(
      () => validateProductionRegistryCandidate(candidate, options(digest)),
      /missing signature evidence/i,
    );
    candidate.applications[0].releaseEvidence.signatureUrl =
      'https://portal.example/evidence/cashflow/signature.sigstore.json';
    await assert.rejects(
      () =>
        validateProductionRegistryCandidate(candidate, {
          ...options(digest),
          verifySignature: async () => false,
        }),
      /invalid signature/i,
    );
  });
});

test('release authorization separates publication, promotion, activation, and rollback', async () => {
  const policy = JSON.parse(
    await readFile(new URL('../devops/policy/release-authorization.json', import.meta.url), 'utf8'),
  );
  const principals = {
    'artifact-publication': { id: 'application-pipeline', roles: ['application-publisher'] },
    'promotion-request': { id: 'release-requester', roles: ['release-requester'] },
    'promotion-approval': { id: 'release-approver', roles: ['release-approver'] },
    activation: { id: 'registry-activation', roles: ['registry-activator'] },
    rollback: { id: 'release-operator', roles: ['release-operator'] },
  };

  for (const [operation, principal] of Object.entries(principals)) {
    assert.equal(authorizeReleaseOperation({ operation, principal }, policy), principal);
  }
  assert.throws(
    () =>
      authorizeReleaseOperation(
        {
          operation: 'activation',
          principal: { id: 'requester', roles: ['release-requester'] },
        },
        policy,
      ),
    /requires role registry-activator/i,
  );
  assert.throws(
    () =>
      authorizeReleaseOperation(
        {
          operation: 'promotion-approval',
          principal: { id: 'same-person', roles: ['release-approver'] },
          actors: { 'promotion-request': 'same-person' },
        },
        policy,
      ),
    /separation of duties/i,
  );
  assert.throws(
    () =>
      authorizeReleaseOperation(
        {
          operation: 'activation',
          principal: { id: 'same-pipeline', roles: ['registry-activator'] },
          actors: { 'artifact-publication': 'same-pipeline' },
        },
        policy,
      ),
    /separation of duties/i,
  );
});

test('registry validation rejects duplicate routes and mutable or external URLs', () => {
  const entry = {
    id: 'cashflow',
    displayName: 'Cashflow',
    remoteName: 'mfe_cashflow',
    manifestUrl: 'https://portal.example/artifacts/cashflow/1.0.0-sha256-deadbeef/mf-manifest.json',
    exposedModule: './application',
    basePath: '/cashflow',
    contractVersion: '1.0.0',
    appearanceContractVersion: '1.0.0',
    identityContractVersion: '1.0.0',
    capabilities: [],
  };
  assert.throws(
    () => validateRuntimeRegistry({ applications: [entry, { ...entry, id: 'other' }] }),
    /duplicate basePath/i,
  );
  assert.throws(
    () =>
      validateRuntimeRegistry(
        {
          applications: [
            {
              ...entry,
              manifestUrl: 'https://untrusted.example/artifacts/cashflow/1.0.0/mf-manifest.json',
            },
          ],
        },
        { trustedOrigins: ['https://portal.example'] },
      ),
    /untrusted origin/i,
  );
  assert.throws(
    () =>
      validateRuntimeRegistry({
        applications: [
          {
            ...entry,
            manifestUrl: 'https://portal.example/artifacts/cashflow/latest/mf-manifest.json',
          },
        ],
      }),
    /mutable release alias/i,
  );
});

test('cache policy separates immutable bytes from active control-plane pointers', () => {
  assert.equal(cachePolicyForPath('/artifacts/cashflow/1.0.0-a/static/js/app.abc.js'), 'immutable');
  assert.equal(cachePolicyForPath('/registries/revisions/dev-001.json'), 'immutable');
  assert.equal(cachePolicyForPath('/registry.json'), 'revalidate');
  assert.equal(cachePolicyForPath('/index.html'), 'revalidate');
});

test('secret scan rejects credential-shaped browser output', async () => {
  const root = await fixtureTree();
  await assertSecretFreeTree(root);
  await writeFile(path.join(root, 'config.js'), 'const API_KEY = "sk_live_not_allowed";');
  await assert.rejects(() => assertSecretFreeTree(root), /possible secret/i);
});
