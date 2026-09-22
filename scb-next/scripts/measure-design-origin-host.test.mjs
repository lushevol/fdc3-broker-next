import assert from 'node:assert/strict';
import test from 'node:test';

import {
  dependencyFromSource,
  evaluateBudget,
  summarize,
} from './measure-design-origin-host.mjs';

test('summarizes repeat measurements without averaging away the slow run', () => {
  assert.deepEqual(summarize([30, 10, 20]), { min: 10, median: 20, p95: 30, max: 30 });
});

test('normalizes ordinary, pnpm and workspace design-package sources', () => {
  assert.deepEqual(dependencyFromSource('/repo/node_modules/@mui/material/Button.js'), {
    packageName: '@mui/material',
    module: 'Button.js',
  });
  assert.deepEqual(
    dependencyFromSource('/repo/node_modules/.pnpm/antd@5/node_modules/antd/es/button/index.js'),
    { packageName: 'antd', module: 'es/button/index.js' },
  );
  assert.deepEqual(dependencyFromSource('/repo/packages/ratan-design-origin/src/Button.tsx'), {
    packageName: 'ratan-design-origin',
    module: 'src/Button.tsx',
  });
});

test('reports absolute and candidate-to-baseline budget failures', () => {
  const report = { candidate: { bytes: 121 }, baseline: { bytes: 100 } };
  const failures = evaluateBudget(report, {
    checks: [{ path: 'candidate.bytes', max: 120 }],
    comparisons: [
      {
        baselinePath: 'baseline.bytes',
        candidatePath: 'candidate.bytes',
        maxRatio: 1.2,
      },
    ],
  });
  assert.deepEqual(failures, [
    'candidate.bytes: 121 exceeds 120',
    'candidate.bytes: ratio 1.21 exceeds 1.2',
  ]);
});
