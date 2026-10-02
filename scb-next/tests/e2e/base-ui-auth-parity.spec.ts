import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from './base-ui-parity.fixture';

test.use({
  deviceScaleFactor: 1,
  locale: 'en-US',
  timezoneId: 'Asia/Singapore',
});

const fontsDirectory = fileURLToPath(
  new URL('../../../sc-dev-web/sc-dev-web/public/assets/fonts/', import.meta.url),
);

for (const generation of ['legacy', 'webkit'] as const) {
  for (const layout of ['old', 'new'] as const) {
    for (const mode of ['dark', 'light'] as const) {
      test(`${generation} ${layout} ${mode} shell presentation and controls match before migration`, async ({
        page,
      }) => {
        test.setTimeout(60_000);
        const errors: Error[] = [];
        page.on('pageerror', (error) => errors.push(error));
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
        await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
          route.fulfill({
            path: join(fontsDirectory, basename(new URL(route.request().url()).pathname)),
          }),
        );
        await page.route('**/api/auth/v2/sso/login', async (route) => {
          const response = await route.fetch();
          const body = await response.json();
          const userInfo = JSON.parse(body.userInfo);
          userInfo.entitlements = {
            'X_RATANONE:FMO_OPS_SUP': {
              RATAN_STRATEGIC_CASHFLOW_BLOTTER: ['UI_Read_Access', 'F_Export_Data'],
            },
            'X_ALPHA_PAYMENTS:FMO_OPS_SUP': {
              ALPHA_PAYMENTS: ['UI_READ', 'ACKNOWLEDGE'],
            },
          };
          await route.fulfill({ response, json: { ...body, userInfo: JSON.stringify(userInfo) } });
        });

        await page.goto(
          `/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=${layout === 'new'}`,
        );
        await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
        await page.getByPlaceholder('Enter Password').fill('acceptance');
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();
        const newTile =
          layout === 'new'
            ? page.getByRole('button', { name: 'Open new tile' })
            : page.getByText('New Tile', { exact: true });
        await expect(newTile).toBeVisible();

        const themeSwitch = page.getByRole('checkbox', { name: 'Theme Switch' });
        await themeSwitch.setChecked(mode === 'light');
        await expect(page.locator('html')).toHaveClass(
          generation === 'webkit' ? `${mode} sc-mode-${mode}` : mode,
        );
        await page.evaluate(() => document.fonts.ready);
        const snapshot = (state: string) =>
          expect(page).toHaveScreenshot(`${generation}-${layout}-${mode}-${state}.png`, {
            animations: 'disabled',
            fullPage: true,
            maxDiffPixels: 0,
          });

        await snapshot('home');
        await newTile.click();
        await expect(page.getByText('Cashflow Blotter', { exact: true })).toBeVisible();
        // Wait for settled compositing before sampling text beneath the drawer backdrop.
        await expect(page.locator('.MuiDrawer-paper')).toHaveCSS('transform', 'none');
        await expect(page.locator('.MuiBackdrop-root:visible')).toHaveCSS('opacity', '1');
        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );
        await snapshot('drawer');
        await page.keyboard.press('Escape');
        await expect(page.getByText('Cashflow Blotter', { exact: true })).toBeHidden();

        await page.getByRole('button', { name: 'User Profiles' }).click();
        await expect(page.getByText('Click to view user profile details')).toBeVisible();
        await snapshot('profile-menu');
        await page.getByText('Click to view user profile details').click();
        const dialog = page.getByRole('dialog').filter({ hasText: 'User Profile' });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByText('RATAN :: X_RATANONE :: FMO_OPS_SUP')).toBeVisible();
        await snapshot('profile-dialog');

        await dialog.getByText('RATAN :: X_RATANONE :: FMO_OPS_SUP').click();
        await expect(dialog.getByText('RATAN_STRATEGIC_CASHFLOW_BLOTTER')).toBeVisible();
        await snapshot('profile-expanded');
        await dialog.getByRole('button', { name: /^Close$/i }).click();
        await expect(dialog).toHaveCount(0);
        expect(errors).toEqual([]);
      });
    }
  }
}

for (const layout of ['old', 'new'] as const) {
  for (const viewport of [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'compact-desktop', width: 1280, height: 900 },
  ]) {
    test(`webkit ${layout} shell at ${viewport.name} matches before migration`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
      await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
        route.fulfill({
          path: join(fontsDirectory, basename(new URL(route.request().url()).pathname)),
        }),
      );
      await page.goto(
        `/?show_normal_login=Y&survey=no&new-styles=true&new-layout=${layout === 'new'}`,
      );
      await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
      await page.getByPlaceholder('Enter Password').fill('acceptance');
      await page.getByRole('button', { name: 'Sign In', exact: true }).click();
      const newTile =
        layout === 'new'
          ? page.getByRole('button', { name: 'Open new tile' })
          : page.getByText('New Tile', { exact: true });
      await expect(newTile).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`webkit-${layout}-${viewport.name}-home.png`, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixels: 0,
      });
      await newTile.click();
      await expect(page.getByText('Cashflow Blotter', { exact: true })).toBeVisible();
      await expect(page).toHaveScreenshot(`webkit-${layout}-${viewport.name}-drawer.png`, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixels: 0,
      });
      await page.keyboard.press('Escape');
      await expect(page.getByText('Cashflow Blotter', { exact: true })).toBeHidden();
    });
  }
}
