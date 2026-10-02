import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MANUAL_RELEASE_GATES,
  QUALITY_STEPS,
  runQualitySteps,
} from './verify-design-origin-quality.mjs';

test('defines the complete package, dependency, browser and host gate order', () => {
  assert.deepEqual(
    QUALITY_STEPS.map(({ label }) => label),
    [
      'Base design import boundary',
      'Package tests and coverage',
      'Package typecheck',
      'Package lint',
      'Aggregate runner fixtures',
      'Base parity runner fixtures',
      'Canonical WebKit host fixtures',
      'Release candidate runner fixtures',
      'Dependency contract fixtures',
      'Host dependency resolution',
      'Canonical WebKit host assets',
      'Base component compatibility',
      'Ratan compatibility bridges',
      'Cashflow compatibility bridges',
      'Package browser quality gate',
      'Base typecheck',
      'Base production build',
      'Ratan production build',
      'Cashflow production build',
      'Base portal parity',
    ],
  );
});

test('runs the Base boundary and portal parity through their canonical commands', () => {
  const boundary = QUALITY_STEPS.find(({ label }) => label === 'Base design import boundary');
  const parity = QUALITY_STEPS.find(({ label }) => label === 'Base portal parity');
  assert.deepEqual(boundary?.args, ['run', 'verify:base-design-imports']);
  assert.deepEqual(parity?.args, ['run', 'test:e2e:base-ui-parity']);
});

test('keeps inherited broad-check debt and controlled performance visible as release gates', () => {
  assert.deepEqual(
    MANUAL_RELEASE_GATES.map(({ label }) => label),
    ['Broad application unit suites', 'Ratan full typecheck', 'Host performance budget'],
  );
  for (const { command, args, reason } of MANUAL_RELEASE_GATES) {
    assert.equal(command, 'npm');
    assert.ok(args.length > 0);
    assert.ok(reason.length > 0);
  }
});

test('runs every quality step sequentially on success', async () => {
  const calls = [];
  const steps = [
    { label: 'First', command: 'npm', args: ['run', 'first'] },
    { label: 'Second', command: 'node', args: ['second.mjs'] },
  ];

  await runQualitySteps({
    steps,
    run: async (step) => calls.push(step.label),
    log: () => {},
  });

  assert.deepEqual(calls, ['First', 'Second']);
});

test('reports the failed label and command without running later gates', async () => {
  const calls = [];
  const steps = [
    { label: 'Package tests', command: 'npm', args: ['run', 'test'] },
    { label: 'Package lint', command: 'npm', args: ['run', 'lint'] },
    { label: 'Browser gate', command: 'npm', args: ['run', 'browser'] },
  ];

  await assert.rejects(
    runQualitySteps({
      steps,
      run: async (step) => {
        calls.push(step.label);
        if (step.label === 'Package lint') {
          throw new Error('npm exited with code 1');
        }
      },
      log: () => {},
    }),
    (error) => {
      assert.match(error.message, /Package lint/);
      assert.match(error.message, /npm run lint/);
      assert.match(error.message, /exited with code 1/);
      return true;
    },
  );

  assert.deepEqual(calls, ['Package tests', 'Package lint']);
});
