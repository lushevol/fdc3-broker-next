import { mergeTests } from '@playwright/test';
import { expect, test as browserTest } from './browser-test';
import { test as profileImageTest } from './base-ui-parity.fixture';

const test = mergeTests(browserTest, profileImageTest);

test.skip(!!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'Uses the development login fixtures');

test('host can render and remove a tile after the control extraction', async ({ page }) => {
  await page.goto('/?show_normal_login=Y&survey=no&new-styles=true');
  await page.getByLabel('Username', { exact: true }).fill('mock.cashflow');
  await page.getByLabel('Password', { exact: true }).fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
  await page.getByRole('button', { name: 'Add Cashflow Blotter', exact: true }).click();
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.locator('html')).toContainClass('dark sc-mode-dark ratan-design-root');
  await expect(page.locator('html')).toHaveAttribute('data-generation', 'webkit');
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  // The local console editor keeps its own light theme while the host is dark.
  const appearanceRoots = page.locator('.ratan-design-root:not(html)').filter({
    hasNot: page.getByRole('button', { name: 'Styling console', exact: true }),
  });
  expect(await appearanceRoots.count()).toBeGreaterThanOrEqual(2);
  expect(
    await appearanceRoots.evaluateAll((roots) =>
      roots.every(
        (root) =>
          root.getAttribute('data-mode') === 'dark' &&
          root.getAttribute('data-generation') === 'webkit',
      ),
    ),
  ).toBe(true);
  expect(
    await appearanceRoots.evaluateAll((roots) =>
      roots.map((root) => {
        const style = window.getComputedStyle(root);
        return {
          webkitFont: style.fontFamily.includes('SC Prosper Sans'),
          background: style.backgroundColor,
        };
      }),
    ),
  ).toEqual(
    Array(await appearanceRoots.count()).fill({
      webkitFont: true,
      background: 'rgb(26, 26, 26)',
    }),
  );
  await page.getByRole('button', { name: 'Add Workspace' }).click();
  await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(2);
  await page
    .getByRole('tab', { name: 'Cashflow Blotter', exact: true })
    .getByRole('button', { name: 'delete', exact: true })
    .click();
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toHaveCount(0);
});
