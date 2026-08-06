import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { BASELINE_COMMIT, BASELINE_PACKAGE_VERSION } from './generate-baseline.mjs';
import { validateAgainstSchema } from './schema-validator.mjs';

const ARTIFACTS = Object.freeze({
  parity: ['ratan-design/manifests/parity-manifest.json', 'parity-manifest.schema.json'],
  migration: ['ratan-design/manifests/migration-map.json', 'migration-map.schema.json'],
  deviation: ['ratan-design/manifests/deviations.json', 'deviation-manifest.schema.json'],
  evidence: ['ratan-design/apps/parity-lab/evidence-resolutions.json', 'evidence-resolutions.schema.json'],
  fixtures: ['ratan-design/apps/parity-lab/fixtures/fixture-matrix.json', 'fixture-matrix.schema.json'],
  runtime: [
    'ratan-design/apps/parity-lab/runtime-observations.json',
    'runtime-observations.schema.json',
  ],
});

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function validateBaselineArtifacts({ repositoryRoot }) {
  const documents = {};
  for (const [name, [artifactPath, schemaName]] of Object.entries(ARTIFACTS)) {
    const document = await readJson(path.join(repositoryRoot, artifactPath));
    const schema = await readJson(
      path.join(repositoryRoot, 'ratan-design/apps/parity-lab/schemas', schemaName),
    );
    const errors = validateAgainstSchema(document, schema);
    assert.deepEqual(errors, [], `${name} schema errors:\n${errors.join('\n')}`);
    documents[name] = document;
  }

  const { parity, migration, deviation, evidence, fixtures, runtime } = documents;
  assert.equal(parity.baseline.repositoryCommit, BASELINE_COMMIT);
  assert.equal(parity.baseline.packageVersion, BASELINE_PACKAGE_VERSION);
  assert.equal(parity.summary.unresolved, 0);
  assert.equal(migration.mappings.length, parity.components.length);
  assert.equal(fixtures.fixtures.length, parity.components.length);
  assert.equal(runtime.observations.length, parity.components.length);
  assert.deepEqual(evidence.precedence, parity.precedence);
  assert.deepEqual(
    await readJson(
      path.join(repositoryRoot, 'ratan-design/packages/react/parity-manifest.json'),
    ),
    parity,
  );
  assert.deepEqual(
    await readJson(
      path.join(repositoryRoot, 'ratan-design/packages/react/migration-map.json'),
    ),
    migration,
  );
  assert.deepEqual(
    await readJson(
      path.join(repositoryRoot, 'ratan-design/packages/react/deviation-manifest.json'),
    ),
    deviation,
  );

  const mappingTags = new Set(migration.mappings.map((mapping) => mapping.legacyTag));
  const runtimeByTag = new Map(runtime.observations.map((observation) => [observation.tag, observation]));
  const deviationIds = new Set(deviation.deviations.map((entry) => entry.id));
  for (const component of parity.components) {
    assert.ok(mappingTags.has(component.legacy.tag), `Missing mapping for ${component.legacy.tag}`);
    const observation = runtimeByTag.get(component.legacy.tag);
    assert.ok(observation, `Missing runtime observation for ${component.legacy.tag}`);
    assert.equal(observation.defined, true, `${component.legacy.tag} was not registered at runtime`);
    assert.equal(observation.captureError, undefined, `${component.legacy.tag} runtime capture failed`);
    assert.deepEqual(observation.errors ?? [], [], `${component.legacy.tag} emitted runtime errors`);
    assert.deepEqual(
      observation.eventProbeErrors ?? [],
      [],
      `${component.legacy.tag} event probes failed`,
    );
    const observedEventNames = new Set(
      (observation.observedEvents ?? []).map((event) => event.name),
    );
    for (const { legacyEvent } of component.contract.events) {
      assert.ok(
        observedEventNames.has(legacyEvent),
        `${component.legacy.tag} did not emit declared event ${legacyEvent}`,
      );
    }
    for (const [method, exists] of Object.entries(observation.methods ?? {})) {
      assert.equal(exists, true, `${component.legacy.tag} is missing method ${method}`);
    }
    for (const deviationId of component.deviations) {
      assert.ok(deviationIds.has(deviationId), `Unapproved deviation ${deviationId}`);
    }
    await access(
      path.join(
        repositoryRoot,
        'ratan-design/apps/parity-lab',
        component.evidence.runtimeFixture,
      ),
    );
    await access(
      path.join(
        repositoryRoot,
        'ratan-design/apps/parity-lab',
        component.evidence.reactFixture,
      ),
    );
  }

  for (const resolution of evidence.resolutions) {
    assert.ok(parity.precedence.includes(resolution.selectedEvidence));
    assert.ok(resolution.rationale.trim().length > 0);
  }
  for (const entry of deviation.deviations) {
    assert.ok(entry.approvedBy.trim().length > 0);
    assert.ok(entry.rationale.trim().length > 0);
    assert.ok(entry.tests.length > 0);
  }

  return documents;
}

const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (invokedFile === fileURLToPath(import.meta.url)) {
  const repositoryRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../..',
  );
  const { parity } = await validateBaselineArtifacts({ repositoryRoot });
  process.stdout.write(
    `Validated ${parity.components.length} component contracts with zero unresolved entries.\n`,
  );
}
