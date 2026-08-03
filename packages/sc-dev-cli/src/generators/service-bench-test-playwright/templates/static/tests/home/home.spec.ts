/**
 * <??= pluginDisplayName ??> Home — E2E Tests
 *
 * Starter spec — replace these with real assertions for your plugin.
 *
 * TC Coverage:
 *   TC-HOME-001  Home page loads (shell mounts, plugin root element visible)
 *
 * Tag reference:
 *   @smoke       — run on every deployment (~5 min)
 *   @regression  — full suite, run before UAT sign-off (~20 min)
 *   @slow        — long-running tests (AI responses, etc.)
 */

import { test, expect } from '../../fixtures/index.ts';

test.describe('<??= pluginDisplayName ??> Home', { tag: ['@regression'] }, () => {

  test(
    '[TC-HOME-001] Home page loads',
    { tag: '@smoke' },
    async ({ navigator }) => {
      await navigator.goToHome();

      // TODO: replace with a real assertion — e.g. a heading unique to your plugin
      await expect(navigator['page'].locator('body')).toBeVisible();
    },
  );

});
