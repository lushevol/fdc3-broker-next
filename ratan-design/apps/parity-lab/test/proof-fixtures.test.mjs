import assert from 'node:assert/strict';
import test from 'node:test';

import { PROOF_FIXTURE_IDS, resolveManagedBrowsers } from '../scripts/capture-proof-fixtures.mjs';

test('defines the complete proof cohort fixture set', () => {
  assert.deepEqual(PROOF_FIXTURE_IDS, ['sc-button', 'sc-text-input', 'sc-dialog', 'sc-date-picker', 'sc-tab-group', 'sc-data-grid']);
});

test('requires distinct managed Chrome and Edge executables', async () => {
  const browsers = await resolveManagedBrowsers({
    RATAN_CHROME_EXECUTABLE: '/bin/sh',
    RATAN_EDGE_EXECUTABLE: '/bin/zsh',
  });
  assert.deepEqual(browsers.map(({ id }) => id), ['chrome', 'edge']);
  assert.notEqual(browsers[0].executablePath, browsers[1].executablePath);
});
