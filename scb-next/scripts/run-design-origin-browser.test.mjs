import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chmod, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const runner = fileURLToPath(new URL('./run-design-origin-browser.mjs', import.meta.url));

async function waitUntil(predicate) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (await predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error('Timed out waiting for browser runner fixture');
}

test('cancellation stops an active build and its workers and removes temporary runner state', {
  skip: process.platform === 'win32',
}, async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'browser-runner-test-'));
  const bin = join(fixture, 'bin');
  const state = join(fixture, 'state');
  const marker = join(fixture, 'worker-stopped');
  const workerFile = join(fixture, 'worker.mjs');
  const npm = join(bin, 'npm');
  let child;
  let buildPid;
  let workerPid;
  try {
    await mkdir(bin);
    await mkdir(state);
    await writeFile(workerFile, `
      import { writeFileSync } from 'node:fs';
      writeFileSync(process.env.RUNNER_FIXTURE_WORKER_PID, String(process.pid));
      process.on('SIGTERM', () => {
        writeFileSync(process.env.RUNNER_FIXTURE_STOPPED, 'stopped');
        process.exit(0);
      });
      setInterval(() => {}, 1000);
    `);
    await writeFile(npm, `#!${process.execPath}\n
      const { spawn } = require('node:child_process');
      require('node:fs').writeFileSync(process.env.RUNNER_FIXTURE_BUILD_PID, String(process.pid));
      spawn(process.execPath, [process.env.RUNNER_FIXTURE_WORKER], { stdio: 'ignore' });
      setInterval(() => {}, 1000);
    `);
    await chmod(npm, 0o755);
    child = spawn(process.execPath, [runner], {
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        TMPDIR: state,
        RUNNER_FIXTURE_BUILD_PID: join(fixture, 'build-pid'),
        RUNNER_FIXTURE_WORKER_PID: join(fixture, 'worker-pid'),
        RUNNER_FIXTURE_WORKER: workerFile,
        RUNNER_FIXTURE_STOPPED: marker,
      },
      stdio: 'ignore',
    });
    await waitUntil(async () => (await readdir(fixture)).includes('worker-pid'));
    buildPid = Number(await readFile(join(fixture, 'build-pid'), 'utf8'));
    workerPid = Number(await readFile(join(fixture, 'worker-pid'), 'utf8'));
    const closed = new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('close', (code) => resolve(code));
    });
    child.kill('SIGTERM');
    assert.equal(await closed, 143);
    await waitUntil(async () => (await readdir(fixture)).includes('worker-stopped'));
    assert.equal(await readFile(marker, 'utf8'), 'stopped');
    assert.throws(() => process.kill(buildPid, 0), { code: 'ESRCH' });
    assert.deepEqual(await readdir(state), []);
  } finally {
    child?.kill('SIGKILL');
    for (const pid of [buildPid, workerPid]) {
      if (pid) {
        try { process.kill(pid, 'SIGKILL'); } catch { /* The fixture already exited. */ }
      }
    }
    await rm(fixture, { recursive: true, force: true });
  }
});
