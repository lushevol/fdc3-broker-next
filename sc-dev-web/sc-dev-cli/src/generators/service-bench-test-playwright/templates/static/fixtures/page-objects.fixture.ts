/**
 * Page Objects fixture.
 *
 * Extends the base Playwright `test` object with all Page Object instances
 * pre-wired to the current page.
 *
 * HOW TO ADD A NEW PAGE OBJECT:
 *   1. Create pages/my-feature.page.ts extending BasePage
 *   2. Import it here
 *   3. Add it to the PageObjects type
 *   4. Add the fixture entry in base.extend<PageObjects>({...})
 *
 * Usage in spec files:
 *   import { test, expect } from '../fixtures/index.ts';
 *
 *   test('my test', async ({ navigator }) => {
 *     await navigator.goToHome();
 *   });
 */

import { test as base } from '@playwright/test';
import { NavigatorPage } from '../pages/navigator.page.ts';

type PageObjects = {
  navigator: NavigatorPage;
  // TODO: add your plugin-specific page objects here
  // home:      HomePage;
};

export const test = base.extend<PageObjects>({
  navigator: async ({ page }, use) => { await use(new NavigatorPage(page)); },
  // TODO: add your plugin-specific fixtures here
  // home: async ({ page }, use) => { await use(new HomePage(page)); },
});

export { expect } from '@playwright/test';
