import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ratanRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const publicPackageName = '@fm/ratan-design';
const internalPrefix = '@fm/ratan-design-';

const allowedInternalDependencies = Object.freeze({
  '@fm/ratan-design': new Set([
    '@fm/ratan-design-components',
    '@fm/ratan-design-data-grid',
    '@fm/ratan-design-foundation',
    '@fm/ratan-design-icons',
    '@fm/ratan-design-patterns',
    '@fm/ratan-design-styles',
    '@fm/ratan-design-testing',
    '@fm/ratan-design-tokens',
    '@fm/ratan-design-vitest',
  ]),
  '@fm/ratan-design-components': new Set([
    '@fm/ratan-design-foundation',
    '@fm/ratan-design-icons',
    '@fm/ratan-design-styles',
    '@fm/ratan-design-tokens',
  ]),
  '@fm/ratan-design-data-grid': new Set([
    '@fm/ratan-design-components',
    '@fm/ratan-design-foundation',
    '@fm/ratan-design-icons',
    '@fm/ratan-design-styles',
    '@fm/ratan-design-tokens',
  ]),
  '@fm/ratan-design-foundation': new Set([
    '@fm/ratan-design-styles',
    '@fm/ratan-design-tokens',
  ]),
  '@fm/ratan-design-icons': new Set([
    '@fm/ratan-design-styles',
    '@fm/ratan-design-tokens',
  ]),
  '@fm/ratan-design-patterns': new Set([
    '@fm/ratan-design-components',
    '@fm/ratan-design-foundation',
    '@fm/ratan-design-icons',
    '@fm/ratan-design-styles',
    '@fm/ratan-design-tokens',
  ]),
  '@fm/ratan-design-standard': new Set(),
  '@fm/ratan-design-storybook': new Set(['@fm/ratan-design']),
  '@fm/ratan-design-styles': new Set(['@fm/ratan-design-tokens']),
  '@fm/ratan-design-testing': new Set([
    '@fm/ratan-design-components',
    '@fm/ratan-design-foundation',
    '@fm/ratan-design-icons',
    '@fm/ratan-design-styles',
    '@fm/ratan-design-tokens',
  ]),
  '@fm/ratan-design-tokens': new Set(),
  '@fm/ratan-design-vitest': new Set([
    '@fm/ratan-design-standard',
    '@fm/ratan-design-testing',
  ]),
});

async function workspacePackages() {
  const workspaces = [];
  for (const kind of ['apps', 'packages']) {
    const root = path.join(ratanRoot, kind);
    for (const entry of await readdir(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const workspaceRoot = path.join(root, entry.name);
      try {
        const manifest = JSON.parse(
          await readFile(path.join(workspaceRoot, 'package.json'), 'utf8'),
        );
        workspaces.push({ kind, root: workspaceRoot, manifest });
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }
  return workspaces;
}

function internalDependencies(manifest) {
  const names = new Set();
  for (const field of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ]) {
    for (const name of Object.keys(manifest[field] ?? {})) {
      if (name === publicPackageName || name.startsWith(internalPrefix)) names.add(name);
    }
  }
  return names;
}

function assertAcyclic(graph) {
  const visiting = new Set();
  const visited = new Set();
  const visit = (name, ancestry = []) => {
    if (visiting.has(name)) throw new Error(`Ratan workspace dependency cycle: ${[...ancestry, name].join(' -> ')}`);
    if (visited.has(name)) return;
    visiting.add(name);
    for (const dependency of graph.get(name) ?? []) visit(dependency, [...ancestry, name]);
    visiting.delete(name);
    visited.add(name);
  };
  for (const name of graph.keys()) visit(name);
}

export async function verifyWorkspaceBoundaries() {
  const workspaces = await workspacePackages();
  const publicWorkspaces = workspaces.filter(({ manifest }) => manifest.private !== true);
  assert.deepEqual(
    publicWorkspaces.map(({ manifest }) => manifest.name),
    [publicPackageName],
    'packages/react must be the only publishable Ratan workspace',
  );

  const graph = new Map();
  for (const { kind, manifest } of workspaces) {
    if (manifest.name !== publicPackageName) {
      assert.equal(manifest.private, true, `${manifest.name} must be private`);
    }
    const dependencies = internalDependencies(manifest);
    graph.set(manifest.name, dependencies);
    if (kind === 'packages') {
      const allowed = allowedInternalDependencies[manifest.name];
      assert.ok(allowed, `No dependency policy declared for ${manifest.name}`);
      for (const dependency of dependencies) {
        assert.ok(
          allowed.has(dependency),
          `${manifest.name} may not depend on ${dependency}`,
        );
      }
    }
  }
  assertAcyclic(graph);

  const react = workspaces.find(({ manifest }) => manifest.name === publicPackageName)?.manifest;
  assert.ok(react);
  assert.equal(react.peerDependencies?.react, '>=18.2.0 <20');
  assert.equal(react.peerDependencies?.['react-dom'], '>=18.2.0 <20');
  for (const prohibited of [
    '@scdevkit/webkit',
    'lit',
    '@lit/react',
    '@shoelace-style/shoelace',
    '@emotion/react',
    '@emotion/styled',
    '@mui/material',
    'antd',
  ]) {
    assert.equal(
      react.dependencies?.[prohibited],
      undefined,
      `Public runtime dependency is prohibited: ${prohibited}`,
    );
  }
  for (const singleton of [
    '@fm/ratan-design-runtime',
    '@portal-ui/runtime',
    '@fm/platform-design-runtime',
  ]) {
    assert.equal(
      react.dependencies?.[singleton],
      undefined,
      `Provider/singleton runtime is prohibited: ${singleton}`,
    );
  }

  process.stdout.write(
    `Verified ${workspaces.length} Ratan workspaces; ${publicPackageName} is the only publishable package.\n`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verifyWorkspaceBoundaries();
}
