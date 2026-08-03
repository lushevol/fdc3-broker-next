import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  assertSecretFreeTree,
  buildRuntimeRegistry,
  cachePolicyForPath,
  digestDirectory,
  validateRuntimeRegistry,
} from '../scripts/production-deployment-lib.mjs';

async function fixtureTree() {
  const root = await mkdtemp(path.join(tmpdir(), 'realworld-release-'));
  await mkdir(path.join(root, 'static', 'js'), { recursive: true });
  await writeFile(path.join(root, 'index.html'), '<main>release</main>');
  await writeFile(path.join(root, 'static', 'js', 'app.abc123.js'), 'export const release = 1;');
  return root;
}

test('artifact digest is deterministic and changes with published bytes', async () => {
  const root = await fixtureTree();
  const first = await digestDirectory(root);
  const second = await digestDirectory(root);
  assert.equal(first, second);

  await writeFile(path.join(root, 'index.html'), '<main>changed</main>');
  assert.notEqual(await digestDirectory(root), first);
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
