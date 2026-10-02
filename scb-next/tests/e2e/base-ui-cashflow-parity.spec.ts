import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from './base-ui-parity.fixture';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });
const fonts = fileURLToPath(new URL('../../../sc-dev-web/sc-dev-web/public/assets/fonts/', import.meta.url));

for (const generation of ['legacy', 'webkit'] as const) {
  for (const mode of ['dark', 'light'] as const) {
    test(`${generation} ${mode} Cashflow rendering, search and details preserve appearance`, async ({ page }) => {
      test.setTimeout(90_000);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
      await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) => route.fulfill({
        path: join(fonts, basename(new URL(route.request().url()).pathname)),
      }));
      await page.goto(`/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=false`);
      await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
      await page.getByPlaceholder('Enter Password').fill('acceptance');
      await page.getByRole('button', { name: 'Sign In', exact: true }).click();
      await page.getByRole('checkbox', { name: 'Theme Switch' }).setChecked(mode === 'light');
      await page.getByText('New Tile', { exact: true }).click();
      await page.getByText('Cashflow Blotter', { exact: true }).click();
      await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible({ timeout: 30_000 });
      await expect(page.getByText('CF-ACCEPT-002', { exact: true })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${generation}-${mode}-cashflow-grid.png`, {
        animations: 'disabled', fullPage: true, maxDiffPixels: 0,
      });
      await page.getByPlaceholder('Multiple searches separated by commas').first().fill('M0P56753524');
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      const row = page.getByRole('row', { name: /M0P56753524/ });
      await expect(row).toBeVisible();
      await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toHaveCount(0);
      const success = page.getByText('Search success!', { exact: true });
      await expect(success).toBeVisible();
      await expect(success).toBeHidden({ timeout: 10_000 });
      await expect(page).toHaveScreenshot(`${generation}-${mode}-cashflow-search.png`, {
        animations: 'disabled', fullPage: true, maxDiffPixels: 0,
      });
      await row.dblclick();
      const details = page.getByRole('dialog', { name: /Cashflow Detail/ });
      await expect(details).toBeVisible();
      await expect(details.getByText('56753524', { exact: true })).toBeVisible();
      await expect(page.getByText(/Unable to fetch cashflow/)).toHaveCount(0);
      await expect(page).toHaveScreenshot(`${generation}-${mode}-cashflow-details.png`, {
        animations: 'disabled', fullPage: true, maxDiffPixels: 0,
      });
      await page.getByRole('button', { name: 'Close dialog' }).click();
      await page.getByRole('button', { name: 'Create or Modify' }).first().click();
      await expect(page.getByRole('dialog', { name: /Custom Search/ })).toBeVisible();
      await expect(page.getByText('Pending operator cashflows', { exact: true })).toBeVisible();
      await expect(page).toHaveScreenshot(`${generation}-${mode}-cashflow-filter-builder.png`, {
        animations: 'disabled', fullPage: true, maxDiffPixels: 0,
      });
      await page.getByRole('button', { name: 'Close dialog' }).click();
      await page.getByRole('button', { name: 'Add Workspace' }).click();
      await page.getByRole('tab').first().click();
      await expect(page.getByRole('row', { name: /M0P56753524/ })).toBeVisible();
      await page.getByRole('button', { name: 'delete' }).first().click();
      await expect(page.getByRole('row', { name: /M0P56753524/ })).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }
}
