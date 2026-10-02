import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { extractBaselineTree, playwrightArguments } from './run-base-ui-parity.mjs';

const exec = promisify(execFile);

test('only baseline captures write snapshots and current comparisons never create missing expectations', () => {
  const suites = ['tests/e2e/base-ui-state-parity.spec.ts'];
  assert.equal(playwrightArguments(suites, true).at(-1), '--update-snapshots=all');
  assert.equal(
    playwrightArguments(suites, false, ['--grep', 'pickers']).at(-1),
    '--update-snapshots=none',
  );
});

test('only an explicit pinned baseline run can update snapshots', async () => {
  const runner = fileURLToPath(new URL('./run-base-ui-parity.mjs', import.meta.url));
  await assert.rejects(
    exec(process.execPath, [runner, '--states-only', '--update-snapshots']),
    (error) => error.code === 1 && error.stderr.includes('Snapshot updates require --baseline'),
  );
});

test('extracts a baseline subtree when the workspace is inside the git repository', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'base-ui-parity-test-'));
  try {
    const repo = join(fixture, 'repo');
    const workspace = join(repo, 'scb-next');
    const source = join(workspace, 'web/mfe-base-origin');
    await mkdir(join(source, 'src'), { recursive: true });
    await writeFile(join(source, 'tsconfig.json'), '{"compilerOptions":{}}\n');
    await writeFile(join(source, 'src/index.tsx'), 'export const baseline = true;\n');
    await exec('git', ['init', '--quiet', repo]);
    await exec('git', ['add', '.'], { cwd: repo });
    await exec(
      'git',
      [
        '-c',
        'user.name=Parity Test',
        '-c',
        'user.email=parity@example.test',
        'commit',
        '--quiet',
        '-m',
        'baseline',
      ],
      { cwd: repo },
    );

    const destination = join(fixture, 'extracted');
    await extractBaselineTree(workspace, destination, 'HEAD:scb-next/web/mfe-base-origin');
    assert.equal(
      await readFile(join(destination, 'tsconfig.json'), 'utf8'),
      '{"compilerOptions":{}}\n',
    );
    assert.equal(
      await readFile(join(destination, 'src/index.tsx'), 'utf8'),
      'export const baseline = true;\n',
    );
    await assert.rejects(
      extractBaselineTree(workspace, join(fixture, 'invalid'), 'missing:tree'),
      /Baseline extraction failed/,
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
