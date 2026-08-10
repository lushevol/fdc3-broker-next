import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function readJson(filePath, missingMessage) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT' && missingMessage) throw new Error(missingMessage);
    throw error;
  }
}

async function readJsonIfPresent(filePath) {
  try {
    return await readJson(filePath);
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined;
    throw error;
  }
}

async function writeJsonAtomic(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}-${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  await rename(temporaryPath, filePath);
}

export async function activateRegistryRevision({ runtimeRoot, environment, revisionId }) {
  const revisionPath = path.join(runtimeRoot, 'registries', 'revisions', `${revisionId}.json`);
  const revision = await readJson(revisionPath, `Missing registry revision: ${revisionId}`);
  if (revision.revisionId !== revisionId || revision.environment !== environment) {
    throw new Error(`Registry revision ${revisionId} does not belong to ${environment}`);
  }
  if (!revision.registry || !Array.isArray(revision.registry.applications)) {
    throw new Error(`Registry revision ${revisionId} has no complete runtime registry`);
  }
  const activeRoot = path.join(runtimeRoot, 'registries', 'active');
  const pointerPath = path.join(activeRoot, `${environment}.pointer.json`);
  const previousPointer = await readJsonIfPresent(pointerPath);
  await writeJsonAtomic(path.join(activeRoot, `${environment}.json`), revision.registry);
  await writeJsonAtomic(pointerPath, {
    schemaVersion: 1,
    environment,
    revisionId,
    revisionUrl: `/registries/revisions/${revisionId}.json`,
    ...(previousPointer?.revisionId ? { previousRevisionId: previousPointer.revisionId } : {}),
  });
  return { revisionId, previousRevisionId: previousPointer?.revisionId };
}

export async function rollbackRegistryRevision({ runtimeRoot, environment }) {
  const pointerPath = path.join(runtimeRoot, 'registries', 'active', `${environment}.pointer.json`);
  const activePointer = await readJson(pointerPath, `Missing active registry for ${environment}`);
  if (!activePointer.previousRevisionId) {
    throw new Error(`No previous known-good registry revision for ${environment}`);
  }
  return activateRegistryRevision({
    runtimeRoot,
    environment,
    revisionId: activePointer.previousRevisionId,
  });
}
