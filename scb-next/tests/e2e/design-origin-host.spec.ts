import { expect, test } from '@playwright/test';

test.skip(!!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'Uses the development login fixtures');

test('host can render and remove a tile after the control extraction', async ({ page }) => {
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));
  await page.goto('/?show_normal_login=Y&survey=no&new-styles=true');
  await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
  await page.getByPlaceholder('Enter Password').fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByText('New Tile', { exact: true }).click();
  await page.getByText('Cashflow Blotter', { exact: true }).click();
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible({
    timeout: 20_000,
  });
  const appearanceRoots = page.locator('.ratan-design-root');
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
  await page.getByRole('button', { name: 'Add Workspace' }).click();
  await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(2);
  await page.getByRole('button', { name: 'delete' }).first().click();
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});
