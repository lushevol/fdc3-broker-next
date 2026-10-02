import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  parseReleaseOptions,
  prepareDesignOriginRelease,
  runLoggedCommand,
} from './prepare-design-origin-release.mjs';

const sourceCommit = 'a'.repeat(40);
const checksum = (value) => createHash('sha256').update(value).digest('hex');

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'design-release-runner-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const workspaceRoot = join(directory, 'scb-next');
  const packageRoot = join(workspaceRoot, 'packages/ratan-design-origin');
  await mkdir(packageRoot, { recursive: true });
  await writeFile(join(packageRoot, 'package.json'), JSON.stringify({ name: 'ratan-design-origin', version: '0.1.0' }));
  await writeFile(join(workspaceRoot, 'package-lock.json'), '{}');
  const calls = [];
  const verifiedTarball = Buffer.from('the exact verified tarball');
  const run = async (command, args, { env, logPath }) => {
    calls.push(args);
    await writeFile(logPath, `${command} ${args.join(' ')}\n`);
    if (args.includes('verify:package')) {
      const consumer = join(directory, 'independent-consumer');
      await mkdir(consumer);
      await writeFile(join(consumer, 'ratan-design-origin-0.1.0.tgz'), verifiedTarball);
      await writeFile(env.RATAN_DESIGN_CONSUMER_PATH_FILE, consumer);
    }
  };
  return {
    directory,
    calls,
    verifiedTarball,
    options: {
      workspaceRoot,
      outputDirectory: join(directory, 'candidates'),
      readSource: async () => ({ commit: sourceCommit, dirty: '' }),
      run,
      log: () => {},
    },
  };
}

test('retains the exact independently verified artifact with source and checksums', async (t) => {
  const { options, calls, verifiedTarball } = await fixture(t);
  const result = await prepareDesignOriginRelease(options);
  const manifest = JSON.parse(await readFile(join(result.directory, 'manifest.json'), 'utf8'));
  assert.equal(manifest.status, 'prepared');
  assert.equal(manifest.source.commit, sourceCommit);
  assert.equal(manifest.artifact.sha256, checksum(verifiedTarball));
  assert.deepEqual(await readFile(join(result.directory, manifest.artifact.file)), verifiedTarball);
  assert.equal(calls.length, 5);
  assert.ok(manifest.validation.every(({ status, sha256 }) => status === 'passed' && /^[a-f0-9]{64}$/.test(sha256)));
  assert.equal(manifest.releaseGates.browserQuality, 'not-run');
  assert.equal(manifest.releaseGates.externalApprovals, 'unrecorded');
});

test('rejects dirty package inputs before building or packing', async (t) => {
  const { options, calls } = await fixture(t);
  await assert.rejects(
    prepareDesignOriginRelease({ ...options, readSource: async () => ({ commit: sourceCommit, dirty: ' M packages/ratan-design-origin/src/Button.tsx' }) }),
    /Commit package inputs/,
  );
  assert.deepEqual(calls, []);
});

test('the real source guard permits unrelated work while recording the committed package tree', async (t) => {
  const { options, directory } = await fixture(t);
  const git = (args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8' }).trim();
  git(['init', '--quiet']);
  git(['add', 'scb-next/packages/ratan-design-origin', 'scb-next/package-lock.json']);
  git(['-c', 'user.name=Release Runner Test', '-c', 'user.email=release-runner@example.invalid',
    '-c', 'core.hooksPath=/dev/null', 'commit', '-qm', 'Package fixture']);
  await writeFile(join(directory, 'unrelated-user-work.txt'), 'Retain this user change');
  const { readSource: _sourceReader, ...actualSourceOptions } = options;
  const result = await prepareDesignOriginRelease(actualSourceOptions);
  assert.equal(result.manifest.source.commit, git(['rev-parse', 'HEAD']));
  assert.equal(result.manifest.source.packageTree, git(['rev-parse', 'HEAD:scb-next/packages/ratan-design-origin']));
});

test('rejects package inputs changed by another commit during validation', async (t) => {
  const { options } = await fixture(t);
  let reads = 0;
  await assert.rejects(prepareDesignOriginRelease({
    ...options,
    readSource: async () => ({ commit: sourceCommit, dirty: '', packageTree: String(reads++) }),
  }), /Package inputs changed/);
});

test('rejects lockfile changes during validation without retaining a candidate artifact', async (t) => {
  const { options } = await fixture(t);
  let candidateDirectory;
  await assert.rejects(prepareDesignOriginRelease({
    ...options,
    run: async (command, args, context) => {
      candidateDirectory = join(context.logPath, '..', '..');
      await options.run(command, args, context);
      if (args.includes('verify:package')) {
        await writeFile(join(options.workspaceRoot, 'package-lock.json'), '{"changed":true}');
      }
    },
  }), /Dependency lockfile changed/);
  const manifest = JSON.parse(await readFile(join(candidateDirectory, 'manifest.json'), 'utf8'));
  assert.equal(manifest.status, 'failed');
  assert.equal(manifest.source.lockfileSha256, checksum('{}'));
  assert.equal(manifest.artifact, null);
});

test('retains a failure manifest and stops later validation when a command fails', async (t) => {
  const { options } = await fixture(t);
  let candidateDirectory;
  await assert.rejects(prepareDesignOriginRelease({
    ...options,
    run: async (_command, _args, { logPath }) => {
      candidateDirectory = join(logPath, '..', '..');
      await writeFile(logPath, 'Package checks failed\n');
      throw new Error('command exited with 1');
    },
  }), /Package tests.*failed/);
  const manifest = JSON.parse(await readFile(join(candidateDirectory, 'manifest.json'), 'utf8'));
  assert.equal(manifest.status, 'failed');
  assert.equal(manifest.validation.length, 1);
  assert.equal(manifest.validation[0].status, 'failed');
  assert.equal(manifest.artifact, null);
});

test('retains a rollback tarball only when it matches the supplied checksum', async (t) => {
  const { options, directory } = await fixture(t);
  const rollbackPath = join(directory, 'previous.tgz');
  const previous = Buffer.from('approved prior artifact');
  await writeFile(rollbackPath, previous);
  const result = await prepareDesignOriginRelease({ ...options, rollbackPath, rollbackSha256: checksum(previous) });
  assert.equal(result.manifest.rollback.sha256, checksum(previous));
  assert.deepEqual(await readFile(join(result.directory, result.manifest.rollback.file)), previous);
  await assert.rejects(
    prepareDesignOriginRelease({ ...options, rollbackPath, rollbackSha256: '0'.repeat(64) }),
    /Rollback checksum mismatch/,
  );
});

test('logs command failures while redacting values split across output chunks', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'design-release-logs-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const logPath = join(directory, 'command.log');
  const license = 'sentinel-license-for-test-only';
  await assert.rejects(runLoggedCommand(process.execPath, ['-e',
    "process.stdout.write(process.env.VITE_MUI_X_LICENSE_KEY.slice(0, 8)); setTimeout(() => { process.stdout.write(process.env.VITE_MUI_X_LICENSE_KEY.slice(8) + '\\n'); process.stderr.write(process.env.EXAMPLE_API_TOKEN + '\\n'); process.exitCode = 1; }, 20);",
  ], { cwd: directory, env: { ...process.env, VITE_MUI_X_LICENSE_KEY: license, EXAMPLE_API_TOKEN: 'sentinel-private-token' }, logPath }), /exited with 1/);
  const output = await readFile(logPath, 'utf8');
  assert.match(output, /\[REDACTED\]/);
  assert.ok(!output.includes(license));
  assert.ok(!output.includes('sentinel-private-token'));
});

test('requires an independent rollback checksum and rejects unknown options', () => {
  assert.throws(() => parseReleaseOptions(['--rollback', '/tmp/previous.tgz']), /rollback-sha256/);
  assert.throws(() => parseReleaseOptions(['--publish']), /Unknown option/);
  assert.equal(parseReleaseOptions([]).outputDirectory, '/tmp/ratan-design-origin-releases');
});
