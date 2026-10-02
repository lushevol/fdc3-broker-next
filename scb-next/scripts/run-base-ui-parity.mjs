import { spawn } from 'node:child_process';
import { copyFile, cp, mkdir, mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const base = join(root, 'web/mfe-base-origin');
const baseline = process.argv.includes('--baseline');
const cashflow = process.argv.includes('--cashflow');
const forwardedArgs = process.argv
  .slice(2)
  .filter((arg) => !['--baseline', '--states-only', '--cashflow', '--'].includes(arg));
let state;
let server;
let activeCommand;
let stopPromise;

export async function extractBaselineTree(
  workspaceRoot,
  destination,
  tree = '98c2d131:scb-next/web/mfe-base-origin',
) {
  await mkdir(destination, { recursive: true });
  // Git limits an archive to cwd's prefix, even when tree already names a subtree.
  const archive = spawn('git', ['archive', tree], {
    cwd: dirname(workspaceRoot),
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const extract = spawn('tar', ['-x', '-C', destination], {
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  archive.stdout.pipe(extract.stdin);
  try {
    await Promise.all(
      [archive, extract].map(
        (child) =>
          new Promise((resolve, reject) => {
            child.once('error', reject);
            child.once('close', (code) =>
              code === 0 ? resolve() : reject(new Error(`Baseline extraction failed: ${tree}`)),
            );
          }),
      ),
    );
  } catch (error) {
    archive.kill('SIGTERM');
    extract.kill('SIGTERM');
    throw error;
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', ...options });
    activeCommand = child;
    child.once('error', reject);
    child.once('close', (code, signal) => {
      if (activeCommand === child) activeCommand = undefined;
      return code === 0 ? resolve() : reject(new Error(`${command} exited with ${code ?? signal}`));
    });
  });
}

async function oldBaseSource() {
  const oldBase = join(state, 'scb-next/web/mfe-base-origin');
  await extractBaselineTree(root, oldBase);
  await symlink(join(dirname(root), 'node_modules'), join(state, 'node_modules'), 'dir');
  await symlink(join(root, 'node_modules'), join(state, 'scb-next/node_modules'), 'dir');
  await symlink(join(base, 'node_modules'), join(oldBase, 'node_modules'), 'dir');
  await symlink(join(dirname(root), 'sc-dev-web'), join(state, 'sc-dev-web'), 'dir');
  // Use the same runtime/mock configuration; only the original UI source differs.
  await copyFile(join(base, 'vite.config.ts'), join(oldBase, 'vite.config.ts'));
  await cp(join(base, 'dev'), join(oldBase, 'dev'), { recursive: true });
  await cp(join(root, 'devops/mock-bff'), join(state, 'scb-next/devops/mock-bff'), {
    recursive: true,
  });
  await cp(join(base, 'fixtures'), join(oldBase, 'fixtures'), { recursive: true });
  await readFile(join(oldBase, 'tsconfig.json'));
  return oldBase;
}

async function terminate(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  await new Promise((resolve) => {
    child.once('close', resolve);
    child.kill('SIGTERM');
    setTimeout(
      () => child.exitCode === null && child.signalCode === null && child.kill('SIGKILL'),
      2000,
    ).unref();
  });
}

async function stop() {
  stopPromise ??= (async () => {
    await terminate(activeCommand);
    await terminate(server);
    await rm(state, { recursive: true, force: true });
  })();
  await stopPromise;
}

export function playwrightArguments(suites, capture, extraArgs = []) {
  return [
    join(root, 'node_modules/@playwright/test/cli.js'),
    'test',
    ...suites,
    '--workers=1',
    ...extraArgs,
    capture ? '--update-snapshots=all' : '--update-snapshots=none',
  ];
}

async function runHost(cwd, port, capture, snapshotDirectory) {
  try {
    const origin = `http://127.0.0.1:${port}`;
    server = spawn(
      process.execPath,
      [
        join(root, 'node_modules/vite/bin/vite.js'),
        '--host',
        '127.0.0.1',
        '--port',
        String(port),
        '--strictPort',
        '--force',
      ],
      {
        cwd,
        stdio: 'inherit',
        env: {
          ...process.env,
          BASE_UI_PARITY_CACHE_DIR: join(state, capture ? 'cache-old' : 'cache-new'),
          VITE_RATAN_REMOTE_URL: cashflow
            ? 'http://127.0.0.1:8009/remoteEntry.js'
            : `${origin}/fixtures/remote-entry.js`,
          VITE_ALPHA_PAYMENTS_REMOTE_URL: cashflow
            ? 'http://127.0.0.1:8018/remoteEntry.js'
            : `${origin}/fixtures/remote-entry.js`,
        },
      },
    );
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt += 1) {
      if (server.exitCode !== null || server.signalCode !== null)
        throw new Error(`Base parity server exited: ${server.exitCode} / ${server.signalCode}`);
      try {
        ready = (await fetch(origin)).ok;
      } catch {
        /* Socket is not ready yet. */
      }
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    if (!ready) throw new Error('Base parity server did not start');
    const suites = cashflow
      ? ['tests/e2e/base-ui-cashflow-parity.spec.ts']
      : process.argv.includes('--states-only')
        ? ['tests/e2e/base-ui-state-parity.spec.ts']
        : [
            'tests/e2e/base-ui-migration.spec.ts',
            'tests/e2e/base-ui-auth-parity.spec.ts',
            'tests/e2e/base-ui-admin-parity.spec.ts',
            'tests/e2e/base-ui-extra-parity.spec.ts',
            'tests/e2e/base-ui-session-parity.spec.ts',
            'tests/e2e/base-ui-state-parity.spec.ts',
          ];
    const args = playwrightArguments(suites, capture, forwardedArgs);
    await run(process.execPath, args, {
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: origin,
        ...(snapshotDirectory ? { BASE_UI_PARITY_SNAPSHOT_DIR: snapshotDirectory } : {}),
      },
    });
  } finally {
    await terminate(server);
    server = undefined;
  }
}

async function main() {
  if (
    !baseline &&
    forwardedArgs.some((arg) => arg === '-u' || arg.startsWith('--update-snapshots'))
  ) {
    throw new Error(
      'Snapshot updates require --baseline so only the pinned original UI records expectations',
    );
  }
  state = await mkdtemp(join(tmpdir(), 'base-ui-parity-'));
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
      await stop();
      process.exit(1);
    });
  }
  try {
    await run('npm', ['run', 'build:packages']);
    const oldBase = await oldBaseSource();
    if (baseline) {
      await runHost(oldBase, 8122, true);
    } else {
      const snapshotDirectory = join(state, 'screenshots');
      await runHost(oldBase, 8122, true, snapshotDirectory);
      await runHost(base, 8121, false, snapshotDirectory);
    }
  } finally {
    await stop();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
