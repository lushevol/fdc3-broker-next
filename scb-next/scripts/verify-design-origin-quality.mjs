import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

export const QUALITY_STEPS = [
  {
    label: 'Base design import boundary',
    command: 'npm',
    args: ['run', 'verify:base-design-imports'],
  },
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
    label: 'Base parity runner fixtures',
    command: 'npm',
    args: ['run', 'test:base-parity-runner'],
  },
  {
    label: 'Browser runner fixtures',
    command: 'npm',
    args: ['run', 'test:browser-runner'],
  },
  {
    label: 'Canonical WebKit host fixtures',
    command: 'npm',
    args: ['run', 'test:webkit-host-runner'],
  },
  {
    label: 'Release candidate runner fixtures',
    command: 'npm',
    args: ['run', 'test:release-runner'],
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
    label: 'Canonical WebKit host assets',
    command: 'npm',
    args: ['run', 'prepare:webkit-host'],
  },
  {
    label: 'Base component compatibility',
    command: 'npm',
    args: [
      'exec',
      '--workspace',
      '@fm/base-origin',
      '--',
      'vitest',
      'run',
      'src/components/Input/compatibility.test.tsx',
      'src/components/Snackbar/compatibility.test.tsx',
      'src/components/DatePicker/compatibility.test.tsx',
      'src/components/mui5-compatibility.test.tsx',
    ],
  },
  {
    label: 'Ratan compatibility bridges',
    command: 'npm',
    args: [
      'exec',
      '--workspace',
      '@fm/ratan_container-origin',
      '--',
      'vitest',
      'run',
      'src/compat/base.test.tsx',
      'src/compat/design-controls.test.tsx',
      'src/Root/component/MfeThemeProvider/appearance.test.tsx',
    ],
  },
  {
    label: 'Cashflow compatibility bridges',
    command: 'npm',
    args: [
      'exec',
      '--workspace',
      '@fm/ratan_cashflow_blotter-origin',
      '--',
      'vitest',
      'run',
      'src/compat/base.test.ts',
      'src/compat/design-controls.test.tsx',
      'src/Root/common/component/MfeThemeProvider/appearance.test.tsx',
    ],
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
  {
    label: 'Base portal parity',
    command: 'npm',
    args: ['run', 'test:e2e:base-ui-parity'],
  },
];

export const MANUAL_RELEASE_GATES = [
  {
    label: 'Broad application unit suites',
    command: 'npm',
    args: ['run', 'test:unit'],
    reason: 'Record the full baseline and classify inherited failures before release.',
  },
  {
    label: 'Ratan full typecheck',
    command: 'npm',
    args: ['run', 'typecheck', '--workspace', '@fm/ratan_container-origin'],
    reason: 'Resolve the 43 inherited production TypeScript errors before release.',
  },
  {
    label: 'Host performance budget',
    command: 'npm',
    args: ['run', 'verify:design-origin-host-performance'],
    reason: 'Requires a controlled host fixture and reviewed performance evidence.',
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
    console.log('\n[design-origin] Automated quality gates passed.');
    for (const gate of MANUAL_RELEASE_GATES) {
      console.log(
        `[design-origin] Manual release gate: ${gate.label}: ${formatCommand(gate)} (${gate.reason})`,
      );
    }
  } catch (error) {
    console.error(`\n[design-origin] ${error.message}`);
    process.exitCode = 1;
  }
}
