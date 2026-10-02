import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from './base-ui-parity.fixture';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });

const fontsDirectory = fileURLToPath(
  new URL('../../../sc-dev-web/sc-dev-web/dist/assets/fonts/', import.meta.url),
);
const fixedTime = new Date('2099-12-31T00:00:00Z');

for (const generation of ['legacy', 'webkit'] as const) {
  test(`${generation} login error toast matches before migration`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.clock.setFixedTime(fixedTime);
    await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
      route.fulfill({
        path: join(fontsDirectory, basename(new URL(route.request().url()).pathname)),
      }),
    );
    await page.route('**/api/auth/v2/sso/login', (route) =>
      route.fulfill({ status: 401, json: { message: 'AuthenticationException' } }),
    );
    await page.goto(
      `/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=false`,
    );
    await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
    await page.getByPlaceholder('Enter Password').fill('incorrect');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    const toast = page.getByRole('alert').getByText('Login failed, please try again.');
    await expect(toast).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.MuiSnackbar-root')).toHaveScreenshot(
      `login-error-${generation}.png`,
      {
        animations: 'disabled',
        maxDiffPixels: 0,
      },
    );
    await page.getByRole('alert').getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test(`${generation} session timeout dialog matches before migration`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.clock.setFixedTime(fixedTime);
    await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
      route.fulfill({
        path: join(fontsDirectory, basename(new URL(route.request().url()).pathname)),
      }),
    );
    await page.route('**/api/auth/v2/sso/login', async (route) => {
      const response = await route.fetch();
      const headers = { ...response.headers() };
      const [scheme, token] = headers['single-ui-authorization'].split(' ');
      const [header, payload, signature] = token.split('.');
      const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      claims.exp = fixedTime.getTime() / 1000 + 30;
      headers['single-ui-authorization'] =
        `${scheme} ${header}.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.${signature}`;
      await route.fulfill({ response, headers });
    });
    await page.route('**/api/auth/v2/sso/refreshtoken', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    await page.goto(
      `/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=false`,
    );
    await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
    await page.getByPlaceholder('Enter Password').fill('acceptance');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(page.getByRole('button', { name: 'User Profiles' })).toBeVisible();
    await page.clock.runFor(31_000);
    const dialog = page.getByRole('dialog', { name: 'Your session has been expired' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Extend' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Logout' })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`timeout-${generation}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixels: 0,
    });
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
  });
}
