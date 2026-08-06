import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildBaseline, buildGeneratedTextArtifacts } from './generate-baseline.mjs';

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(absolutePath)));
    if (entry.isFile()) files.push(absolutePath);
  }
  return files.sort();
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

async function verifyInventory(inventory, targetRoot) {
  const expectedPaths = inventory.map(({ path: relativePath }) => relativePath).sort();
  const actualPaths = (await listFiles(targetRoot))
    .map((file) => path.relative(targetRoot, file).split(path.sep).join('/'))
    .sort();
  assert.deepEqual(actualPaths, expectedPaths, `Asset inventory drift in ${targetRoot}`);
  for (const asset of inventory) {
    const content = await readFile(path.join(targetRoot, asset.path));
    assert.equal(sha256(content), asset.sha256, `Asset content drift: ${asset.path}`);
  }
}

export async function checkBaselineDrift({ repositoryRoot }) {
  const baseline = await buildBaseline({ repositoryRoot });
  const artifacts = buildGeneratedTextArtifacts(baseline);
  for (const [relativePath, expected] of artifacts) {
    const actual = await readFile(path.join(repositoryRoot, relativePath), 'utf8');
    assert.equal(actual, expected, `Generated baseline drift: ${relativePath}`);
  }

  const expectedFixturePaths = [...artifacts.keys()]
    .filter((relativePath) =>
      relativePath.startsWith('ratan-design/apps/parity-lab/fixtures/'),
    )
    .map((relativePath) =>
      relativePath.replace('ratan-design/apps/parity-lab/fixtures/', ''),
    )
    .sort();
  const fixturesRoot = path.join(repositoryRoot, 'ratan-design/apps/parity-lab/fixtures');
  const actualFixturePaths = (await listFiles(fixturesRoot))
    .map((file) => path.relative(fixturesRoot, file).split(path.sep).join('/'))
    .sort();
  assert.deepEqual(actualFixturePaths, expectedFixturePaths, 'Generated fixture file drift');

  await verifyInventory(
    baseline.assets.styles,
    path.join(repositoryRoot, 'ratan-design/packages/react/src/styles/frozen'),
  );
  await verifyInventory(
    baseline.assets.fonts,
    path.join(repositoryRoot, 'ratan-design/packages/react/src/assets/fonts'),
  );
  await verifyInventory(
    baseline.assets.icons,
    path.join(repositoryRoot, 'ratan-design/packages/react/src/icons/svg'),
  );
  return baseline;
}

const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (invokedFile === fileURLToPath(import.meta.url)) {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
  const baseline = await checkBaselineDrift({ repositoryRoot });
  process.stdout.write(`No baseline drift across ${baseline.summary.components} components.\n`);
}
