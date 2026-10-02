import { expect, test } from './base-ui-parity.fixture';

for (const generation of ['legacy', 'webkit'] as const) {
  for (const layout of ['old', 'new'] as const) {
    for (const viewport of [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      test(`Login ${generation} ${layout} ${viewport.name} matches the pre-migration portal`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(
          `/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=${layout === 'new'}`,
        );
        await expect(page.getByPlaceholder('Enter Username')).toBeVisible();
        await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`login-${generation}-${layout}-${viewport.name}.png`, {
          animations: 'disabled',
          fullPage: true,
          maxDiffPixels: 0,
        });
      });
    }
  }
}

test('Base shell opens the tile drawer and manages workspace tabs', async ({ page }) => {
  await page.goto('/?show_normal_login=Y&survey=no&new-styles=true');
  await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
  await page.getByPlaceholder('Enter Password').fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  await page.getByText('New Tile', { exact: true }).click();
  await expect(page.getByText('Cashflow Blotter', { exact: true })).toBeVisible();
  await page.getByText('Cashflow Blotter', { exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Cashflow Blotter' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Workspace' }).click();
  await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(2);
  await page.getByRole('button', { name: 'delete' }).first().click();
  await expect(page.getByRole('tab', { name: 'Cashflow Blotter' })).toHaveCount(0);
});
