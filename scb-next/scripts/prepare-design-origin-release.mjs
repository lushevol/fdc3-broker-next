import { spawn, execFile } from 'node:child_process';
import { constants, createWriteStream } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { finished } from 'node:stream/promises';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const workspaceRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const executeFile = promisify(execFile);
const hash = (content) => createHash('sha256').update(content).digest('hex');
const steps = [
  { label: 'Package tests', args: ['run', 'test', '--workspace', 'ratan-design-origin'] },
  { label: 'Package typecheck', args: ['run', 'typecheck', '--workspace', 'ratan-design-origin'] },
  { label: 'Package lint', args: ['run', 'lint', '--workspace', 'ratan-design-origin', '--', '--max-warnings=0'] },
  { label: 'Package build', args: ['run', 'build', '--workspace', 'ratan-design-origin'] },
  { label: 'Independent tarball consumer', args: ['run', 'verify:package', '--workspace', 'ratan-design-origin'] },
];

function redact(value, env) {
  let output = value;
  for (const [name, secret] of Object.entries(env)) {
    if (/(license|token|password|secret|credential|api.?key)/i.test(name) && secret) {
      output = output.replaceAll(secret, '[REDACTED]');
    }
  }
  return output.replace(/(https?:\/\/)[^/\s]+:[^@\s]+@/g, '$1[REDACTED]@');
}

export async function runLoggedCommand(command, args, { cwd, env, logPath }) {
  const log = createWriteStream(logPath, { flags: 'wx' });
  const logFinished = finished(log);
  const child = spawn(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
  const pending = { stdout: '', stderr: '' };
  const record = (stream, value) => log.write(`[${stream}] ${redact(value, env)}\n`);
  record('command', [command, ...args].join(' '));
  for (const stream of ['stdout', 'stderr']) {
    child[stream].setEncoding('utf8');
    child[stream].on('data', (chunk) => {
      pending[stream] += chunk;
      const lines = pending[stream].split('\n');
      pending[stream] = lines.pop();
      for (const line of lines) record(stream, line);
    });
  }
  log.on('error', () => child.kill('SIGTERM'));
  let result;
  try {
    result = await new Promise((resolveCommand, reject) => {
      child.once('error', reject);
      child.once('close', (code, signal) => resolveCommand({ code, signal }));
    });
  } finally {
    for (const stream of ['stdout', 'stderr']) {
      if (pending[stream]) record(stream, pending[stream]);
    }
    log.end();
    await logFinished;
  }
  if (result.code !== 0) throw new Error(`${command} exited with ${result.code ?? result.signal}`);
}

async function readSource(root) {
  const repositoryRoot = dirname(root);
  const { stdout: commit } = await executeFile('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot });
  const { stdout: packageTree } = await executeFile('git', [
    'rev-parse', 'HEAD:scb-next/packages/ratan-design-origin',
  ], { cwd: repositoryRoot });
  const { stdout: dirty } = await executeFile('git', [
    'status', '--porcelain', '--', 'scb-next/packages/ratan-design-origin',
  ], { cwd: repositoryRoot });
  return { commit: commit.trim(), packageTree: packageTree.trim(), dirty: dirty.trim() };
}

export function parseReleaseOptions(args) {
  const options = { outputDirectory: '/tmp/ratan-design-origin-releases' };
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    const fields = {
      '--output': 'outputDirectory',
      '--rollback': 'rollbackPath',
      '--rollback-sha256': 'rollbackSha256',
    };
    if (!fields[flag]) throw new Error(`Unknown option: ${flag}`);
    const value = args[++index];
    if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`);
    options[fields[flag]] = value;
  }
  if (Boolean(options.rollbackPath) !== Boolean(options.rollbackSha256)) {
    throw new Error('--rollback and --rollback-sha256 must be supplied together');
  }
  if (options.rollbackSha256 && !/^[a-f0-9]{64}$/i.test(options.rollbackSha256)) {
    throw new Error('--rollback-sha256 must be the approved artifact SHA-256');
  }
  return options;
}

export async function prepareDesignOriginRelease({
  workspaceRoot: root = workspaceRoot,
  outputDirectory = '/tmp/ratan-design-origin-releases',
  rollbackPath,
  rollbackSha256,
  readSource: sourceReader = readSource,
  run = runLoggedCommand,
  env = process.env,
  log = console.log,
} = {}) {
  const source = await sourceReader(root);
  if (source.dirty) throw new Error('Commit package inputs before preparing a release candidate.');
  if (!/^[a-f0-9]{40,64}$/i.test(source.commit)) throw new Error('Source commit is invalid.');
  const packageRoot = join(root, 'packages/ratan-design-origin');
  const { name, version } = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
  if (name !== 'ratan-design-origin' || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version)) {
    throw new Error('Expected a versioned ratan-design-origin package.');
  }
  let rollbackBytes;
  if (rollbackPath) {
    if (!rollbackSha256) throw new Error('Rollback artifact requires its approved SHA-256.');
    rollbackBytes = await readFile(rollbackPath);
    if (hash(rollbackBytes) !== rollbackSha256.toLowerCase()) throw new Error('Rollback checksum mismatch.');
  }
  await mkdir(outputDirectory, { recursive: true });
  const directory = await mkdtemp(join(resolve(outputDirectory), `${name}-${version}-${source.commit.slice(0, 12)}-`));
  await mkdir(join(directory, 'logs'));
  const consumerPathFile = join(directory, 'consumer-path.txt');
  const manifest = {
    schemaVersion: 1,
    status: 'preparing',
    preparedAt: new Date().toISOString(),
    package: { name, version },
    source: {
      commit: source.commit,
      packageTree: source.packageTree,
      packageInputsClean: true,
      lockfileSha256: hash(await readFile(join(root, 'package-lock.json'))),
    },
    artifact: null,
    rollback: null,
    validation: [],
    releaseGates: {
      browserQuality: 'not-run',
      basePortalParity: 'not-run',
      broadApplicationUnits: 'not-run',
      ratanFullTypecheck: 'not-run',
      hostPerformance: 'not-run',
      externalApprovals: 'unrecorded',
      muiXLicenseConfigured: Boolean(env.VITE_MUI_X_LICENSE_KEY),
    },
  };
  const writeManifest = () => writeFile(join(directory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeManifest();
  try {
    for (const [index, step] of steps.entries()) {
      const file = `logs/${index + 1}.log`;
      const entry = { label: step.label, command: 'npm', args: step.args, status: 'running', file };
      manifest.validation.push(entry);
      log(`[design-release] ${step.label}; log: ${join(directory, file)}`);
      try {
        await run('npm', step.args, {
          cwd: root,
          env: { ...env, RATAN_DESIGN_CONSUMER_PATH_FILE: consumerPathFile },
          logPath: join(directory, file),
        });
        entry.status = 'passed';
        entry.sha256 = hash(await readFile(join(directory, file)));
      } catch (error) {
        entry.status = 'failed';
        throw new Error(`${step.label} failed: ${redact(error.message, env)}; evidence: ${directory}`);
      }
      await writeManifest();
    }
    const after = await sourceReader(root);
    if (after.dirty || after.packageTree !== source.packageTree) {
      throw new Error('Package inputs changed while preparing the candidate.');
    }
    if (hash(await readFile(join(root, 'package-lock.json'))) !== manifest.source.lockfileSha256) {
      throw new Error('Dependency lockfile changed while preparing the candidate.');
    }
    const consumer = (await readFile(consumerPathFile, 'utf8')).trim();
    const tarballs = (await readdir(consumer)).filter((file) => file.endsWith('.tgz'));
    if (tarballs.length !== 1) throw new Error('Expected exactly one independently verified tarball.');
    const bytes = await readFile(join(consumer, tarballs[0]));
    const file = `${name}-${version}-${source.commit.slice(0, 12)}.tgz`;
    await copyFile(join(consumer, tarballs[0]), join(directory, file), constants.COPYFILE_EXCL);
    manifest.artifact = { file, sha256: hash(bytes), bytes: bytes.length };
    await writeFile(join(directory, 'SHA256SUMS'), `${manifest.artifact.sha256}  ${file}\n`, { flag: 'wx' });
    if (rollbackBytes) {
      await mkdir(join(directory, 'rollback'));
      const rollbackFile = `rollback/${hash(rollbackBytes)}.tgz`;
      await writeFile(join(directory, rollbackFile), rollbackBytes, { flag: 'wx' });
      manifest.rollback = { file: rollbackFile, sha256: hash(rollbackBytes), bytes: rollbackBytes.length };
    }
    manifest.status = 'prepared';
    await writeManifest();
    log(`[design-release] Prepared local candidate: ${directory}`);
    log('[design-release] Browser, portal, manual release checks and external approvals remain required.');
    return { directory, manifest };
  } catch (error) {
    manifest.status = 'failed';
    manifest.failure = redact(error.message, env);
    await writeManifest();
    throw error;
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  try {
    await prepareDesignOriginRelease(parseReleaseOptions(process.argv.slice(2)));
  } catch (error) {
    console.error(`[design-release] ${redact(error.message, process.env)}`);
    process.exitCode = 1;
  }
}
