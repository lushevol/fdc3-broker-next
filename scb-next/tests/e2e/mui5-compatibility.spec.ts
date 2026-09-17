import { expect, test } from '@playwright/test';

test.skip(!!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'Uses the development login fixtures');

for (const newStyles of [false, true]) {
  const style = newStyles ? 'webkit' : 'legacy';

  test(`${style} themes preserve Base dialog controls on MUI 5`, async ({ page }, testInfo) => {
    const errors: Error[] = [];
    page.on('pageerror', (error) => errors.push(error));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/?show_normal_login=Y&survey=no&new-styles=${newStyles}`);
    await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
    await page.getByPlaceholder('Enter Password').fill('acceptance');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(page.getByText('New Tile', { exact: true })).toBeVisible();

    const themeSwitch = page.getByRole('checkbox', { name: 'Theme Switch' });
    for (const mode of ['dark', 'light'] as const) {
      await themeSwitch.setChecked(mode === 'light');
      await expect(page.locator('html')).toHaveClass(newStyles ? `${mode} sc-mode-${mode}` : mode);
      await page.screenshot({ path: testInfo.outputPath(`${style}-${mode}-desktop.png`) });
    }

    await page.getByRole('button', { name: 'User Profiles' }).click();
    await page.getByText('Click to view user profile details', { exact: true }).click();
    const dialog = page.getByRole('dialog').filter({ hasText: 'User Profile' });
    await expect(dialog).toBeVisible();
    await expect(page.locator('#menu-appbar-avatar')).toBeHidden();
    await expect(dialog).toHaveCSS('width', '800px');
    await expect(dialog).toHaveCSS('height', '600px');
    await expect(dialog.locator('..')).toHaveCSS('opacity', '1');
    await expect(dialog.getByText('RATAN :: X_RATANONE :: FMO_OPS_SUP')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`${style}-profile-dialog.png`) });
    const maximize = dialog.getByRole('heading').getByRole('button', { name: 'resize', exact: true });
    await maximize.click();
    await expect(dialog).not.toHaveCSS('width', '800px');
    await maximize.click();
    await expect(dialog).toHaveCSS('width', '800px');
    await dialog.getByRole('button', { name: /^Close$/i }).click();
    await expect(dialog).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`${style} login baseline at a narrow viewport`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/?show_normal_login=Y&new-styles=${newStyles}`);
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`${style}-login-mobile.png`) });
  });
}
