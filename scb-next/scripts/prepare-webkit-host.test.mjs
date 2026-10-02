import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { prepareWebkitHost } from './prepare-webkit-host.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'webkit-host-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const canonical = join(root, 'sc-dev-web/sc-dev-web');
  const rte = join(root, 'sc-dev-web/sc-dev-web-rte');
  await mkdir(join(canonical, 'src/styles'), { recursive: true });
  await mkdir(join(canonical, 'public/assets/fonts'), { recursive: true });
  await mkdir(rte, { recursive: true });
  await writeFile(join(canonical, 'src/styles/ScStyleguide.ts'), 'original tracked source');
  for (const name of ['SCProsperSans-Regular', 'SCProsperSans-Medium', 'SCProsperSans-Bold']) {
    await writeFile(join(canonical, `public/assets/fonts/${name}.woff2`), `${name} font source`);
  }
  const calls = [];
  const run = async (command, args, { cwd }) => {
    calls.push({ command, args, cwd });
    await mkdir(join(cwd, 'dist/elements'), { recursive: true });
    if (cwd.endsWith('/sc-dev-web-rte')) {
      await mkdir(join(cwd, 'dist/src'), { recursive: true });
      await writeFile(join(cwd, 'dist/src/index.js'), 'export {};');
      return;
    }
    await writeFile(join(cwd, 'src/styles/ScStyleguide.ts'), 'generated source in temporary copy');
    await mkdir(join(cwd, 'dist/styles'), { recursive: true });
    for (const name of ['ScDarkMode', 'ScLightMode', 'ScStyleguide', 'ScGDSStyleGuide']) {
      await writeFile(join(cwd, `dist/styles/${name}.css`), `${name} canonical CSS`);
    }
    for (const name of ['sc-icon-card', 'sc-button']) {
      await writeFile(join(cwd, `dist/elements/${name}.js`), 'export {};');
      await writeFile(join(cwd, `dist/elements/${name}.d.ts`), 'export {};');
    }
  };
  return { root, canonical, calls, run };
}

test('builds canonical packages without modifying tracked source and supplies actual font assets', async (t) => {
  const { root, canonical, calls, run } = await fixture(t);
  await prepareWebkitHost({ repositoryRoot: root, run, verifyDependencies: () => {}, log: () => {} });
  assert.equal(calls.length, 2);
  assert.ok(calls[0].cwd.endsWith('/sc-dev-web-rte'));
  assert.ok(calls[1].cwd.endsWith('/sc-dev-web'));
  assert.ok(calls.every(({ cwd }) => !cwd.startsWith(root)));
  assert.deepEqual(calls[0].args, ['run', 'build:mvp']);
  assert.equal(await readFile(join(canonical, 'src/styles/ScStyleguide.ts'), 'utf8'), 'original tracked source');
  assert.equal(await readFile(join(canonical, 'dist/assets/fonts/SCProsperSans-Regular.woff2'), 'utf8'), 'SCProsperSans-Regular font source');
  assert.equal(await readFile(join(canonical, 'dist/styles/ScDarkMode.css'), 'utf8'), 'ScDarkMode canonical CSS');
});

test('fails before publishing incomplete canonical output', async (t) => {
  const { root, canonical, run } = await fixture(t);
  await assert.rejects(prepareWebkitHost({
    repositoryRoot: root,
    verifyDependencies: () => {},
    run: async (command, args, context) => {
      await run(command, args, context);
      if (context.cwd.endsWith('/sc-dev-web')) {
        await rm(join(context.cwd, 'dist/elements/sc-button.d.ts'));
      }
    },
    log: () => {},
  }), /sc-button\.d\.ts/);
  await assert.rejects(readFile(join(canonical, 'dist/styles/ScDarkMode.css')), { code: 'ENOENT' });
});

test('reports the explicit locked dependency install before copying or building', async (t) => {
  const { root, calls, run } = await fixture(t);
  await assert.rejects(prepareWebkitHost({ repositoryRoot: root, run, log: () => {} }), /npm ci --workspace @scdevkit\/webkit --workspace @scdevkit\/webkit-rte --ignore-scripts/);
  assert.equal(calls.length, 0);
});
