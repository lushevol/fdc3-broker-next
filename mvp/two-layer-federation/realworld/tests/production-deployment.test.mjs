import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  activateRegistryRevision,
  rollbackRegistryRevision,
} from '../scripts/registry-activation.mjs';
import {
  assertSecretFreeTree,
  authorizeReleaseOperation,
  buildProductionRegistryRevision,
  buildRuntimeRegistry,
  cacheControlForPath,
  cachePolicyForPath,
  createPromotionAuditEvent,
  createReleaseMetadata,
  createReleaseId,
  digestDirectory,
  recordPromotionAuditEvent,
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

test('runtime registry validation rejects malformed entries and missing releases', () => {
  const entry = {
    id: 'cashflow',
    basePath: '/cashflow',
    manifestUrl: 'https://portal.example/artifacts/cashflow/1.0.0/mf-manifest.json',
  };
  assert.throws(() => validateRuntimeRegistry(), /at least one application/i);
  assert.throws(
    () => validateRuntimeRegistry({ applications: [entry, { ...entry }] }),
    /duplicate application id/i,
  );
  assert.throws(
    () => validateRuntimeRegistry({ applications: [{ ...entry, manifestUrl: 'relative.json' }] }),
    /absolute same-origin/i,
  );
  assert.throws(
    () =>
      validateRuntimeRegistry({
        applications: [
          {
            ...entry,
            manifestUrl: 'http://portal.example/artifacts/cashflow/1.0.0/mf-manifest.json',
          },
        ],
      }),
    /absolute same-origin/i,
  );
  assert.throws(
    () =>
      validateRuntimeRegistry({
        applications: [
          {
            ...entry,
            manifestUrl: 'https://portal.example/artifacts/cashflow/1.0.0/remoteEntry.js',
          },
        ],
      }),
    /select mf-manifest/i,
  );
  assert.throws(
    () =>
      buildRuntimeRegistry({ entries: [entry], releases: {}, origin: 'https://portal.example' }),
    /missing release identity/i,
  );
});

test('production registry revision binds artifacts, compatibility, ownership, and evidence', () => {
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
        releaseId,
        digestAlgorithm: 'sha256',
        digest,
      },
    },
    ownershipRecords: { cashflow: ownership },
  });

  assert.deepEqual(revision.applications, [
    {
      id: 'cashflow',
      artifact: {
        version: '1.2.3',
        releaseId,
        digestAlgorithm: 'sha256',
        digest,
        immutableUrl: `https://portal.example/artifacts/cashflow/${releaseId}/mf-manifest.json`,
      },
      protocolRange: { minimumMajor: 1, maximumMajor: 1 },
      capabilities: ['navigation', 'workspace'],
      ownership,
      releaseEvidence: {
        catalogUrl: `https://portal.example/catalog/cashflow/${releaseId}.json`,
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
      /schema.*artifact/i,
    );
  });

  await context.test('rejects all schema-invalid production fields', async () => {
    const cases = [
      ['top-level fields', (candidate) => (candidate.unexpected = true)],
      ['schema version', (candidate) => (candidate.schemaVersion = 2)],
      ['revision id', (candidate) => (candidate.revisionId = '')],
      ['environment', (candidate) => (candidate.environment = 'DEV')],
      ['timestamp', (candidate) => (candidate.createdAt = 'not-a-date')],
      ['source revision', (candidate) => (candidate.sourceRevision = '')],
      ['release selections', (candidate) => (candidate.releases = {})],
      ['release selection fields', (candidate) => (candidate.releases.cashflow.extra = true)],
      ['release id', (candidate) => (candidate.releases.cashflow.releaseId = '')],
      ['release digest', (candidate) => (candidate.releases.cashflow.digest = 'bad')],
      ['applications', (candidate) => (candidate.applications = [])],
      ['runtime registry object', (candidate) => (candidate.registry = null)],
      ['runtime registry fields', (candidate) => (candidate.registry.extra = true)],
      ['runtime registry applications', (candidate) => (candidate.registry.applications = [])],
      ['application fields', (candidate) => (candidate.applications[0].extra = true)],
      ['application id', (candidate) => (candidate.applications[0].id = 'Cashflow')],
      ['artifact fields', (candidate) => (candidate.applications[0].artifact.extra = true)],
      ['artifact version', (candidate) => (candidate.applications[0].artifact.version = 'v1')],
      ['artifact release id', (candidate) => (candidate.applications[0].artifact.releaseId = '')],
      [
        'artifact digest',
        (candidate) => (candidate.applications[0].artifact.digestAlgorithm = 'sha1'),
      ],
      [
        'artifact URL',
        (candidate) =>
          (candidate.applications[0].artifact.immutableUrl = 'http://portal.example/file'),
      ],
      ['protocol fields', (candidate) => (candidate.applications[0].protocolRange.extra = true)],
      ['protocol range', (candidate) => (candidate.applications[0].protocolRange.minimumMajor = 0)],
      ['capabilities type', (candidate) => (candidate.applications[0].capabilities = null)],
      [
        'capabilities values',
        (candidate) => (candidate.applications[0].capabilities = ['navigation', 'navigation']),
      ],
      ['ownership presence', (candidate) => (candidate.applications[0].ownership = null)],
      ['ownership fields', (candidate) => (candidate.applications[0].ownership.extra = true)],
      [
        'ownership values',
        (candidate) => (candidate.applications[0].ownership.accountableTeam = ''),
      ],
      ['criticality', (candidate) => (candidate.applications[0].ownership.criticality = 'tier-0')],
      [
        'classification',
        (candidate) => (candidate.applications[0].ownership.dataClassification = 'secret'),
      ],
      ['SLO fields', (candidate) => (candidate.applications[0].ownership.slo.extra = true)],
      [
        'SLO values',
        (candidate) => (candidate.applications[0].ownership.slo.availabilityPercent = 101),
      ],
      ['evidence presence', (candidate) => (candidate.applications[0].releaseEvidence = null)],
      ['evidence fields', (candidate) => (candidate.applications[0].releaseEvidence.extra = true)],
      [
        'catalog URL',
        (candidate) =>
          (candidate.applications[0].releaseEvidence.catalogUrl = 'http://portal.example/catalog'),
      ],
      [
        'signature URL',
        (candidate) =>
          (candidate.applications[0].releaseEvidence.signatureUrl =
            'http://portal.example/signature'),
      ],
    ];

    for (const [label, mutate] of cases) {
      const { candidate, digest } = candidateFixture();
      mutate(candidate);
      await assert.rejects(
        () => validateProductionRegistryCandidate(candidate, options(digest)),
        /production registry schema/i,
        label,
      );
    }
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

  await context.test('rejects inconsistent candidate and runtime selections', async () => {
    {
      const { candidate, digest } = candidateFixture();
      candidate.applications.push(structuredClone(candidate.applications[0]));
      await assert.rejects(
        () => validateProductionRegistryCandidate(candidate, options(digest)),
        /duplicate production application id/i,
      );
    }
    {
      const { candidate, digest } = candidateFixture();
      candidate.applications[0].id = 'other';
      candidate.applications[0].ownership.applicationId = 'other';
      candidate.releases.other = candidate.releases.cashflow;
      delete candidate.releases.cashflow;
      await assert.rejects(
        () => validateProductionRegistryCandidate(candidate, options(digest)),
        /missing runtime registry entry/i,
      );
    }
    {
      const { candidate, digest } = candidateFixture();
      candidate.applications[0].artifact.immutableUrl =
        'https://portal.example/artifacts/cashflow/other/mf-manifest.json';
      await assert.rejects(
        () => validateProductionRegistryCandidate(candidate, options(digest)),
        /artifact URL mismatch/i,
      );
    }
    {
      const { candidate, digest } = candidateFixture();
      candidate.releases.cashflow.digest = 'e'.repeat(64);
      await assert.rejects(
        () => validateProductionRegistryCandidate(candidate, options(digest)),
        /release selection mismatch/i,
      );
    }
    {
      const { candidate, digest } = candidateFixture();
      candidate.registry.applications.push({
        ...candidate.registry.applications[0],
        id: 'other',
        basePath: '/other',
        manifestUrl: 'https://portal.example/artifacts/other/1.0.0/mf-manifest.json',
      });
      await assert.rejects(
        () => validateProductionRegistryCandidate(candidate, options(digest)),
        /application sets differ/i,
      );
    }
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
    candidate.applications[0].releaseEvidence.signatureUrl =
      'https://untrusted.example/signature.sigstore.json';
    await assert.rejects(
      () => validateProductionRegistryCandidate(candidate, options(digest)),
      /signature uses an untrusted origin/i,
    );
  });

  await context.test(
    'fails closed when digest and signature services are unavailable',
    async () => {
      const { candidate, digest } = candidateFixture();
      await assert.rejects(
        () =>
          validateProductionRegistryCandidate(candidate, {
            ...options(digest),
            resolveArtifactDigest: undefined,
          }),
        /digest resolver is not configured/i,
      );
      await assert.rejects(
        () =>
          validateProductionRegistryCandidate(candidate, {
            ...options(digest),
            verifySignature: undefined,
          }),
        /signature verifier is not configured/i,
      );
    },
  );
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
  assert.throws(
    () =>
      authorizeReleaseOperation({ operation: 'unknown', principal: principals.activation }, policy),
    /unknown release operation/i,
  );
  assert.throws(
    () => authorizeReleaseOperation({ operation: 'activation', principal: null }, policy),
    /authenticated principal/i,
  );
});

test('promotion audit records complete append-only release evidence', async () => {
  const auditRoot = await mkdtemp(path.join(tmpdir(), 'realworld-audit-'));
  const auditPath = path.join(auditRoot, 'promotions.jsonl');
  const input = {
    eventId: 'promotion-dev-42',
    environment: 'dev',
    requester: { id: 'release-requester' },
    approver: { id: 'release-approver' },
    sourceRevision: 'dev-41',
    targetRevision: 'dev-42',
    selectedArtifacts: [
      {
        applicationId: 'cashflow',
        version: '1.2.3',
        digest: 'd'.repeat(64),
        evidence: {
          catalogUrl: 'https://portal.example/catalog/cashflow/1.2.3.json',
          signatureUrl: 'https://portal.example/evidence/cashflow/1.2.3.sigstore.json',
        },
      },
    ],
    timestamps: {
      requestedAt: '2026-08-11T00:00:00.000Z',
      approvedAt: '2026-08-11T00:01:00.000Z',
      completedAt: '2026-08-11T00:02:00.000Z',
    },
    outcome: { status: 'succeeded' },
  };
  const event = createPromotionAuditEvent(input);

  await recordPromotionAuditEvent(auditPath, event);
  await recordPromotionAuditEvent(auditPath, {
    ...event,
    eventId: 'promotion-dev-43',
    outcome: { status: 'failed', reason: 'synthetic verification failed' },
  });

  const records = (await readFile(auditPath, 'utf8'))
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.deepEqual(records[0], { schemaVersion: 1, operation: 'promotion', ...input });
  assert.equal(records[1].eventId, 'promotion-dev-43');
  assert.deepEqual(records[1].outcome, {
    status: 'failed',
    reason: 'synthetic verification failed',
  });
});

test('promotion audit validation fails closed before persistence', async () => {
  const valid = {
    eventId: 'promotion-dev-42',
    environment: 'dev',
    requester: { id: 'requester' },
    approver: { id: 'approver' },
    sourceRevision: 'dev-41',
    targetRevision: 'dev-42',
    selectedArtifacts: [
      {
        applicationId: 'cashflow',
        version: '1.2.3',
        digest: 'd'.repeat(64),
        evidence: { catalogUrl: 'https://portal.example/catalog/cashflow/1.2.3.json' },
      },
    ],
    timestamps: {
      requestedAt: '2026-08-11T00:00:00.000Z',
      approvedAt: '2026-08-11T00:01:00.000Z',
      completedAt: '2026-08-11T00:02:00.000Z',
    },
    outcome: { status: 'succeeded' },
  };
  const cases = [
    ['identifiers', (event) => delete event.eventId],
    ['identities', (event) => delete event.requester],
    ['different identities', (event) => (event.approver.id = event.requester.id)],
    ['revisions', (event) => delete event.targetRevision],
    ['selected artifacts', (event) => (event.selectedArtifacts = [])],
    ['artifact evidence', (event) => (event.selectedArtifacts[0].digest = 'bad')],
    ['timestamps', (event) => delete event.timestamps.completedAt],
    ['outcome', (event) => (event.outcome.status = 'unknown')],
  ];
  for (const [label, mutate] of cases) {
    const event = structuredClone(valid);
    mutate(event);
    assert.throws(() => createPromotionAuditEvent(event), undefined, label);
  }
  const auditPath = path.join(await mkdtemp(path.join(tmpdir(), 'invalid-audit-')), 'audit.jsonl');
  await assert.rejects(() => recordPromotionAuditEvent(auditPath, { eventId: 'incomplete' }));
});

test('registry activation is atomic and rollback restores the previous revision', async () => {
  const runtimeRoot = await mkdtemp(path.join(tmpdir(), 'realworld-registry-'));
  const revisionRoot = path.join(runtimeRoot, 'registries', 'revisions');
  await mkdir(revisionRoot, { recursive: true });
  const revision = (revisionId, applicationId) => ({
    schemaVersion: 1,
    revisionId,
    environment: 'dev',
    registry: {
      applications: [
        {
          id: applicationId,
          manifestUrl: `https://portal.example/artifacts/${applicationId}/1.0.0/mf-manifest.json`,
        },
      ],
    },
  });
  await writeFile(
    path.join(revisionRoot, 'dev-1.json'),
    JSON.stringify(revision('dev-1', 'cashflow-v1')),
  );
  await writeFile(
    path.join(revisionRoot, 'dev-2.json'),
    JSON.stringify(revision('dev-2', 'cashflow-v2')),
  );

  await activateRegistryRevision({ runtimeRoot, environment: 'dev', revisionId: 'dev-1' });
  await activateRegistryRevision({ runtimeRoot, environment: 'dev', revisionId: 'dev-2' });

  const pointerPath = path.join(runtimeRoot, 'registries', 'active', 'dev.pointer.json');
  assert.deepEqual(JSON.parse(await readFile(pointerPath, 'utf8')), {
    schemaVersion: 1,
    environment: 'dev',
    revisionId: 'dev-2',
    revisionUrl: '/registries/revisions/dev-2.json',
    previousRevisionId: 'dev-1',
  });

  await assert.rejects(
    () =>
      activateRegistryRevision({
        runtimeRoot,
        environment: 'dev',
        revisionId: 'missing',
      }),
    /missing registry revision/i,
  );
  assert.equal(JSON.parse(await readFile(pointerPath, 'utf8')).revisionId, 'dev-2');

  await rollbackRegistryRevision({ runtimeRoot, environment: 'dev' });
  assert.deepEqual(JSON.parse(await readFile(pointerPath, 'utf8')), {
    schemaVersion: 1,
    environment: 'dev',
    revisionId: 'dev-1',
    revisionUrl: '/registries/revisions/dev-1.json',
    previousRevisionId: 'dev-2',
  });
});

test('registry activation rejects invalid targets and missing rollback state', async () => {
  const runtimeRoot = await mkdtemp(path.join(tmpdir(), 'realworld-registry-invalid-'));
  const revisionRoot = path.join(runtimeRoot, 'registries', 'revisions');
  await mkdir(revisionRoot, { recursive: true });
  await writeFile(
    path.join(revisionRoot, 'test-1.json'),
    JSON.stringify({ revisionId: 'test-1', environment: 'test', registry: { applications: [] } }),
  );
  await writeFile(
    path.join(revisionRoot, 'dev-broken.json'),
    JSON.stringify({ revisionId: 'dev-broken', environment: 'dev' }),
  );
  await assert.rejects(
    () => activateRegistryRevision({ runtimeRoot, environment: 'dev', revisionId: 'test-1' }),
    /does not belong/i,
  );
  await assert.rejects(
    () => activateRegistryRevision({ runtimeRoot, environment: 'dev', revisionId: 'dev-broken' }),
    /no complete runtime registry/i,
  );
  await assert.rejects(
    () => rollbackRegistryRevision({ runtimeRoot, environment: 'dev' }),
    /missing active registry/i,
  );
  await mkdir(path.join(runtimeRoot, 'registries', 'active'), { recursive: true });
  await writeFile(
    path.join(runtimeRoot, 'registries', 'active', 'dev.pointer.json'),
    JSON.stringify({ revisionId: 'dev-1' }),
  );
  await assert.rejects(
    () => rollbackRegistryRevision({ runtimeRoot, environment: 'dev' }),
    /no previous known-good/i,
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
  assert.equal(
    cacheControlForPath('/artifacts/cashflow/1.0.0/app.js'),
    'public, max-age=31536000, immutable',
  );
  assert.equal(cacheControlForPath('/registry.json'), 'no-store, max-age=0');
});

test('release identity rejects invalid versions and digests', () => {
  const digest = 'd'.repeat(64);
  assert.equal(createReleaseId('1.2.3', digest), '1.2.3-sha256-dddddddddddddddd');
  assert.throws(() => createReleaseId('v1', digest), /invalid semantic version/i);
  assert.throws(() => createReleaseId('1.2.3', 'bad'), /SHA-256/i);
});

test('secret scan rejects credential-shaped browser output', async () => {
  const root = await fixtureTree();
  await assertSecretFreeTree(root);
  await writeFile(path.join(root, 'config.js'), 'const API_KEY = "sk_live_not_allowed";');
  await assert.rejects(() => assertSecretFreeTree(root), /possible secret/i);
});
