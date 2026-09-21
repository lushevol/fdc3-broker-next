import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

export const QUALITY_STEPS = [
  {
    label: 'Package tests and coverage',
    command: 'npm',
    args: ['run', 'test', '--workspace', 'ratan-design-origin'],
  },
  {
    label: 'Package typecheck',
    command: 'npm',
    args: ['run', 'typecheck', '--workspace', 'ratan-design-origin'],
  },
  {
    label: 'Package lint',
    command: 'npm',
    args: ['run', 'lint', '--workspace', 'ratan-design-origin', '--', '--max-warnings=0'],
  },
  {
    label: 'Aggregate runner fixtures',
    command: 'npm',
    args: ['run', 'test:quality-runner'],
  },
  {
    label: 'Dependency contract fixtures',
    command: 'npm',
    args: ['run', 'test:dependency-isolation'],
  },
  {
    label: 'Host dependency resolution',
    command: 'npm',
    args: ['run', 'verify:dependency-isolation'],
  },
  {
    label: 'Package browser quality gate',
    command: 'npm',
    args: ['run', 'test:e2e:design-origin'],
  },
  {
    label: 'Base typecheck',
    command: 'npm',
    args: ['run', 'typecheck', '--workspace', '@fm/base-origin'],
  },
  {
    label: 'Base production build',
    command: 'npm',
    args: ['run', 'build', '--workspace', '@fm/base-origin'],
  },
  {
    label: 'Ratan production build',
    command: 'npm',
    args: ['run', 'build', '--workspace', '@fm/ratan_container-origin'],
  },
  {
    label: 'Cashflow production build',
    command: 'npm',
    args: ['run', 'build', '--workspace', '@fm/ratan_cashflow_blotter-origin'],
  },
];

function formatCommand({ command, args }) {
  return [command, ...args].join(' ');
}

function spawnStep({ command, args }) {
  return new Promise((resolveStep, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: process.env,
      stdio: 'inherit',
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolveStep();
      else reject(new Error(`${command} exited with ${code ?? signal}`));
    });
  });
}

export async function runQualitySteps({
  steps = QUALITY_STEPS,
  run = spawnStep,
  log = console.log,
} = {}) {
  for (const step of steps) {
    log(`\n[design-origin] ${step.label}: ${formatCommand(step)}`);
    try {
      await run(step);
    } catch (error) {
      throw new Error(`${step.label} failed (${formatCommand(step)}): ${error.message}`, {
        cause: error,
      });
    }
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  try {
    await runQualitySteps();
    console.log('\n[design-origin] All quality gates passed.');
  } catch (error) {
    console.error(`\n[design-origin] ${error.message}`);
    process.exitCode = 1;
  }
}
