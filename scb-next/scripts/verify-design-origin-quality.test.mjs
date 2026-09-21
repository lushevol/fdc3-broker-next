import assert from 'node:assert/strict';
import test from 'node:test';

import { QUALITY_STEPS, runQualitySteps } from './verify-design-origin-quality.mjs';

test('defines the complete package, dependency, browser and host gate order', () => {
  assert.deepEqual(
    QUALITY_STEPS.map(({ label }) => label),
    [
      'Package tests and coverage',
      'Package typecheck',
      'Package lint',
      'Aggregate runner fixtures',
      'Dependency contract fixtures',
      'Host dependency resolution',
      'Package browser quality gate',
      'Base typecheck',
      'Base production build',
      'Ratan production build',
      'Cashflow production build',
    ],
  );
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
