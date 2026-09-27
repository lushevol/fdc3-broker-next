import { expect, test } from '@playwright/test';

for (const generation of ['legacy', 'webkit'] as const) {
  for (const layout of ['old', 'new'] as const) {
    for (const viewport of [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      test(`Login ${generation} ${layout} ${viewport.name} matches the pre-migration portal`, async ({ page }) => {
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
