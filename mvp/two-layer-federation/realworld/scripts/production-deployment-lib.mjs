import { createHash } from 'node:crypto';
import { appendFile, mkdir, readdir, readFile } from 'node:fs/promises';
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

export function createReleaseMetadata({
  applicationId,
  packageName,
  version,
  releaseId,
  digest,
  sourceRevision,
  buildId,
  artifactPath,
  createdAt,
  contract,
  capabilities,
  sharedRuntimeRanges,
}) {
  return {
    schemaVersion: 2,
    applicationId,
    packageName,
    version,
    releaseId,
    digestAlgorithm: 'sha256',
    digest,
    sourceRevision,
    buildId,
    artifactPath,
    createdAt,
    contract,
    capabilities: [...capabilities].sort(),
    sharedRuntimeRanges: Object.fromEntries(
      Object.entries(sharedRuntimeRanges).sort(([left], [right]) => left.localeCompare(right)),
    ),
  };
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

export function buildProductionRegistryRevision({
  revisionId,
  environment,
  createdAt,
  sourceRevision,
  runtimeRegistry,
  releases,
  ownershipRecords,
}) {
  const applications = runtimeRegistry.applications.map((entry) => {
    const release = releases[entry.id];
    if (!release) throw new Error(`Missing release metadata for ${entry.id}`);
    const ownership = ownershipRecords[entry.id];
    if (!ownership) throw new Error(`Missing ownership record for ${entry.id}`);
    const protocolMajor = Number(entry.contractVersion.split('.')[0]);
    if (!Number.isInteger(protocolMajor) || protocolMajor < 1) {
      throw new Error(`Invalid application contract version for ${entry.id}`);
    }
    const immutableUrl = new URL(entry.manifestUrl);
    return {
      id: entry.id,
      artifact: {
        version: release.version,
        releaseId: release.releaseId,
        digestAlgorithm: release.digestAlgorithm,
        digest: release.digest,
        immutableUrl: immutableUrl.href,
      },
      protocolRange: { minimumMajor: protocolMajor, maximumMajor: protocolMajor },
      capabilities: [...entry.capabilities].sort(),
      ownership,
      releaseEvidence: {
        catalogUrl: `${immutableUrl.origin}/catalog/${entry.id}/${release.releaseId}.json`,
      },
    };
  });
  const revision = {
    schemaVersion: 1,
    revisionId,
    environment,
    createdAt,
    sourceRevision,
    releases: Object.fromEntries(
      applications.map(({ id, artifact }) => [
        id,
        { releaseId: artifact.releaseId, digest: artifact.digest },
      ]),
    ),
    applications,
    registry: runtimeRegistry,
  };
  assertProductionCandidateShape(revision);
  return revision;
}

function assertExactKeys(value, expectedKeys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Production registry schema requires ${label} to be an object`);
  }
  const actualKeys = Object.keys(value).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  if (
    actualKeys.length !== sortedExpectedKeys.length ||
    actualKeys.some((key, index) => key !== sortedExpectedKeys[index])
  ) {
    throw new Error(`Production registry schema rejects unexpected or missing ${label} fields`);
  }
}

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Production registry schema requires ${label}`);
  }
}

function assertHttpsUrl(value, label) {
  try {
    if (new URL(value).protocol !== 'https:') throw new Error();
  } catch {
    throw new Error(`Production registry schema requires an HTTPS ${label}`);
  }
}

function assertProductionCandidateShape(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new Error('Production registry schema requires an object');
  }
  assertExactKeys(
    candidate,
    [
      'schemaVersion',
      'revisionId',
      'environment',
      'createdAt',
      'sourceRevision',
      'releases',
      'applications',
      'registry',
    ],
    'revision',
  );
  if (candidate.schemaVersion !== 1) {
    throw new Error('Production registry schema requires schemaVersion 1');
  }
  assertNonEmptyString(candidate.revisionId, 'a revision id');
  if (!/^[a-z][a-z0-9-]*$/.test(candidate.environment ?? '')) {
    throw new Error('Production registry schema requires a valid environment');
  }
  if (
    typeof candidate.createdAt !== 'string' ||
    !Number.isFinite(Date.parse(candidate.createdAt))
  ) {
    throw new Error('Production registry schema requires a creation timestamp');
  }
  assertNonEmptyString(candidate.sourceRevision, 'a source revision');
  if (
    !candidate.releases ||
    typeof candidate.releases !== 'object' ||
    Array.isArray(candidate.releases) ||
    Object.keys(candidate.releases).length === 0
  ) {
    throw new Error('Production registry schema requires release selections');
  }
  for (const [applicationId, release] of Object.entries(candidate.releases)) {
    assertExactKeys(release, ['releaseId', 'digest'], `release selection for ${applicationId}`);
    assertNonEmptyString(release.releaseId, `a release id for ${applicationId}`);
    if (!/^[a-f0-9]{64}$/.test(release.digest ?? '')) {
      throw new Error(`Production registry schema requires a SHA-256 digest for ${applicationId}`);
    }
  }
  if (!Array.isArray(candidate.applications) || candidate.applications.length === 0) {
    throw new Error('Production registry schema requires at least one application');
  }
  if (
    !candidate.registry ||
    typeof candidate.registry !== 'object' ||
    Array.isArray(candidate.registry)
  ) {
    throw new Error('Production registry schema requires a runtime registry');
  }
  assertExactKeys(candidate.registry, ['applications'], 'runtime registry');
  if (
    !Array.isArray(candidate.registry.applications) ||
    candidate.registry.applications.length === 0
  ) {
    throw new Error('Production registry schema requires a runtime registry');
  }
  for (const application of candidate.applications) {
    assertExactKeys(
      application,
      ['id', 'artifact', 'protocolRange', 'capabilities', 'ownership', 'releaseEvidence'],
      'application',
    );
    if (!/^[a-z][a-z0-9-]*$/.test(application.id ?? '')) {
      throw new Error('Production registry schema requires an application id');
    }
    assertExactKeys(
      application.artifact,
      ['version', 'releaseId', 'digestAlgorithm', 'digest', 'immutableUrl'],
      `artifact for ${application.id}`,
    );
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(application.artifact.version ?? '')) {
      throw new Error('Production registry schema requires an artifact version');
    }
    assertNonEmptyString(application.artifact.releaseId, `a release id for ${application.id}`);
    if (
      application.artifact.digestAlgorithm !== 'sha256' ||
      !/^[a-f0-9]{64}$/.test(application.artifact.digest ?? '')
    ) {
      throw new Error(`Production registry schema requires a SHA-256 digest for ${application.id}`);
    }
    assertHttpsUrl(application.artifact.immutableUrl, `immutable URL for ${application.id}`);
    assertExactKeys(
      application.protocolRange,
      ['minimumMajor', 'maximumMajor'],
      `protocol range for ${application.id}`,
    );
    if (
      !Number.isInteger(application.protocolRange?.minimumMajor) ||
      !Number.isInteger(application.protocolRange?.maximumMajor) ||
      application.protocolRange.minimumMajor < 1 ||
      application.protocolRange.maximumMajor < 1 ||
      application.protocolRange.minimumMajor > application.protocolRange.maximumMajor
    ) {
      throw new Error(
        `Production registry schema requires a valid protocol range for ${application.id}`,
      );
    }
    if (
      !Array.isArray(application.capabilities) ||
      application.capabilities.some(
        (capability) => typeof capability !== 'string' || !capability,
      ) ||
      new Set(application.capabilities).size !== application.capabilities.length
    ) {
      throw new Error(`Production registry schema requires capabilities for ${application.id}`);
    }
    if (!application.ownership || application.ownership.applicationId !== application.id) {
      throw new Error(
        `Production registry schema requires matching ownership for ${application.id}`,
      );
    }
    assertExactKeys(
      application.ownership,
      [
        'applicationId',
        'accountableTeam',
        'supportRota',
        'criticality',
        'dataClassification',
        'slo',
        'releaseApprover',
        'rollbackContact',
      ],
      `ownership for ${application.id}`,
    );
    for (const field of [
      'applicationId',
      'accountableTeam',
      'supportRota',
      'releaseApprover',
      'rollbackContact',
    ]) {
      assertNonEmptyString(
        application.ownership[field],
        `${field} ownership for ${application.id}`,
      );
    }
    if (!['tier-1', 'tier-2', 'tier-3'].includes(application.ownership.criticality)) {
      throw new Error(`Production registry schema requires criticality for ${application.id}`);
    }
    if (
      !['public', 'internal', 'confidential', 'restricted'].includes(
        application.ownership.dataClassification,
      )
    ) {
      throw new Error(
        `Production registry schema requires data classification for ${application.id}`,
      );
    }
    assertExactKeys(
      application.ownership.slo,
      ['availabilityPercent', 'activationP95Ms'],
      `SLO for ${application.id}`,
    );
    if (
      typeof application.ownership.slo.availabilityPercent !== 'number' ||
      application.ownership.slo.availabilityPercent < 0 ||
      application.ownership.slo.availabilityPercent > 100 ||
      !Number.isInteger(application.ownership.slo.activationP95Ms) ||
      application.ownership.slo.activationP95Ms < 1
    ) {
      throw new Error(`Production registry schema requires a valid SLO for ${application.id}`);
    }
    const evidenceKeys = [
      'catalogUrl',
      'sbomUrl',
      'provenanceUrl',
      'signatureUrl',
      'policyResultsUrl',
    ];
    if (!application.releaseEvidence || typeof application.releaseEvidence !== 'object') {
      throw new Error(`Production registry schema requires release evidence for ${application.id}`);
    }
    if (Object.keys(application.releaseEvidence).some((key) => !evidenceKeys.includes(key))) {
      throw new Error(
        `Production registry schema rejects unexpected release evidence for ${application.id}`,
      );
    }
    assertHttpsUrl(application.releaseEvidence.catalogUrl, `catalog URL for ${application.id}`);
    for (const key of evidenceKeys.slice(1)) {
      if (application.releaseEvidence[key] !== undefined) {
        assertHttpsUrl(application.releaseEvidence[key], `${key} for ${application.id}`);
      }
    }
  }
}

export async function validateProductionRegistryCandidate(
  candidate,
  {
    trustedOrigins = [],
    supportedProtocolMajors = [],
    availableCapabilities = [],
    resolveArtifactDigest,
    verifySignature,
  } = {},
) {
  assertProductionCandidateShape(candidate);
  const runtimeRegistry = validateRuntimeRegistry(candidate.registry, { trustedOrigins });
  const runtimeEntries = new Map(runtimeRegistry.applications.map((entry) => [entry.id, entry]));
  const candidateIds = new Set();
  const capabilitySet = new Set(availableCapabilities);

  for (const application of candidate.applications) {
    if (candidateIds.has(application.id)) {
      throw new Error(`Duplicate production application id: ${application.id}`);
    }
    candidateIds.add(application.id);
    const runtimeEntry = runtimeEntries.get(application.id);
    if (!runtimeEntry) throw new Error(`Missing runtime registry entry for ${application.id}`);
    if (runtimeEntry.manifestUrl !== application.artifact.immutableUrl) {
      throw new Error(`Artifact URL mismatch for ${application.id}`);
    }
    const selectedRelease = candidate.releases?.[application.id];
    if (
      selectedRelease?.releaseId !== application.artifact.releaseId ||
      selectedRelease?.digest !== application.artifact.digest
    ) {
      throw new Error(`Release selection mismatch for ${application.id}`);
    }
    const protocolSupported = supportedProtocolMajors.some(
      (major) =>
        major >= application.protocolRange.minimumMajor &&
        major <= application.protocolRange.maximumMajor,
    );
    if (!protocolSupported) throw new Error(`Unsupported protocol range for ${application.id}`);
    for (const capability of application.capabilities) {
      if (!capabilitySet.has(capability)) {
        throw new Error(`Unavailable capability: ${capability}`);
      }
    }
    const signatureUrl = application.releaseEvidence.signatureUrl;
    if (!signatureUrl) throw new Error(`Missing signature evidence for ${application.id}`);
    const signatureOrigin = new URL(signatureUrl).origin;
    if (trustedOrigins.length > 0 && !trustedOrigins.includes(signatureOrigin)) {
      throw new Error(`${application.id} signature uses an untrusted origin`);
    }
    if (typeof resolveArtifactDigest !== 'function') {
      throw new Error('Artifact digest resolver is not configured');
    }
    const resolvedDigest = await resolveArtifactDigest(application.artifact.immutableUrl);
    if (resolvedDigest !== application.artifact.digest) {
      throw new Error(`Artifact digest mismatch for ${application.id}`);
    }
    if (typeof verifySignature !== 'function') {
      throw new Error('Signature verifier is not configured');
    }
    if (!(await verifySignature(application))) {
      throw new Error(`Invalid signature for ${application.id}`);
    }
  }

  if (candidateIds.size !== runtimeEntries.size) {
    throw new Error('Production and runtime registry application sets differ');
  }
  return candidate;
}

export function authorizeReleaseOperation(
  { operation, principal, actors = {} },
  authorizationPolicy,
) {
  const operationPolicy = authorizationPolicy.operations?.[operation];
  if (!operationPolicy) throw new Error(`Unknown release operation: ${operation}`);
  if (!principal?.id || !Array.isArray(principal.roles)) {
    throw new Error(`Release operation ${operation} requires an authenticated principal`);
  }
  if (!principal.roles.includes(operationPolicy.requiredRole)) {
    throw new Error(`Release operation ${operation} requires role ${operationPolicy.requiredRole}`);
  }
  for (const rule of authorizationPolicy.separationOfDuties ?? []) {
    if (!rule.operations.includes(operation)) continue;
    const conflictingOperation = rule.operations.find(
      (candidateOperation) => candidateOperation !== operation,
    );
    if (conflictingOperation && actors[conflictingOperation] === principal.id) {
      throw new Error(
        `Separation of duties prohibits ${principal.id} from performing both ${conflictingOperation} and ${operation}`,
      );
    }
  }
  return principal;
}

export function createPromotionAuditEvent(input) {
  if (!input.eventId || !input.environment) {
    throw new Error('Promotion audit requires event and environment identifiers');
  }
  if (!input.requester?.id || !input.approver?.id) {
    throw new Error('Promotion audit requires requester and approver identities');
  }
  if (input.requester.id === input.approver.id) {
    throw new Error('Promotion audit requester and approver must be different identities');
  }
  if (!input.sourceRevision || !input.targetRevision) {
    throw new Error('Promotion audit requires source and target revisions');
  }
  if (!Array.isArray(input.selectedArtifacts) || input.selectedArtifacts.length === 0) {
    throw new Error('Promotion audit requires selected artifacts');
  }
  for (const artifact of input.selectedArtifacts) {
    if (
      !artifact.applicationId ||
      !artifact.version ||
      !/^[a-f0-9]{64}$/.test(artifact.digest ?? '') ||
      !artifact.evidence?.catalogUrl
    ) {
      throw new Error('Promotion audit selected artifact evidence is incomplete');
    }
  }
  if (
    !input.timestamps?.requestedAt ||
    !input.timestamps?.approvedAt ||
    !input.timestamps?.completedAt
  ) {
    throw new Error('Promotion audit requires request, approval, and completion timestamps');
  }
  if (!['succeeded', 'failed', 'rejected', 'rolled-back'].includes(input.outcome?.status)) {
    throw new Error('Promotion audit requires a recognized outcome');
  }
  return { schemaVersion: 1, operation: 'promotion', ...input };
}

export async function recordPromotionAuditEvent(filePath, event) {
  const validatedEvent = createPromotionAuditEvent(event);
  await mkdir(path.dirname(filePath), { recursive: true });
  await appendFile(filePath, `${JSON.stringify(validatedEvent)}\n`, { flag: 'a' });
}

export function createReleaseId(version, digest) {
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version))
    throw new Error(`Invalid semantic version: ${version}`);
  if (!/^[a-f0-9]{64}$/.test(digest)) throw new Error('Release digest must be a SHA-256 hex value');
  return `${version}-sha256-${digest.slice(0, 16)}`;
}
