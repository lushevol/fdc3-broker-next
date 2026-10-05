import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from './base-ui-parity.fixture';

const fonts = fileURLToPath(
  new URL('../../../sc-dev-web/sc-dev-web/public/assets/fonts/', import.meta.url),
);
const paymentCase = {
  id: 'AP-20481',
  direction: 'Inbound',
  currency: 'USD',
  amount: 1250000,
  counterparty: 'Merlion Bank',
  priority: 'Critical',
  ageMinutes: 47,
  status: 'OPEN',
};

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} real Ratan, Cashflow and Alpha remotes receive theme and preserve recovery`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1512, height: 982 });
    await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
    await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
      route.fulfill({ path: join(fonts, basename(new URL(route.request().url()).pathname)) }),
    );
    let release: () => void = () => {};
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    let requests = 0;
    let phase: 'pending' | 'ready' = 'pending';
    await page.route('**/api/alpha-payments/v1/cases', async (route) => {
      requests += 1;
      if (phase === 'pending') {
        await pending;
        await route.fulfill({ status: 503, json: { message: 'Service unavailable' } });
      } else {
        await route.fulfill({
          json: { tenantId: 'alpha-payments', total: 1, items: [paymentCase] },
        });
      }
    });
    await page.goto(`/?show_normal_login=Y&survey=no&new-styles=true&login-theme=${theme}`);
    await page.getByLabel('Username', { exact: true }).fill('mock.cashflow');
    await page.getByLabel('Password', { exact: true }).fill('acceptance');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    const themeSwitch = page.getByRole('checkbox', { name: 'Theme Switch' });
    await themeSwitch.setChecked(theme === 'light');
    await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
    await page.getByRole('button', { name: 'Add Cashflow Blotter', exact: true }).click();
    await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText('CF-ACCEPT-002', { exact: true })).toBeVisible();

    const scopes = page.locator('.ratan-design-root');
    expect(await scopes.count()).toBeGreaterThanOrEqual(3);
    const expectAppearance = async (mode: string) => {
      await expect
        .poll(() =>
          scopes.evaluateAll((roots) =>
            roots.map((root) => ({
              mode: root.getAttribute('data-mode'),
              generation: root.getAttribute('data-generation'),
            })),
          ),
        )
        .toEqual(Array(await scopes.count()).fill({ mode, generation: 'webkit' }));
    };
    await expectAppearance(theme);
    await themeSwitch.setChecked(theme === 'dark');
    await expectAppearance(theme === 'light' ? 'dark' : 'light');
    await themeSwitch.setChecked(theme === 'light');
    await expectAppearance(theme);

    await page.getByRole('button', { name: 'Add Workspace', exact: true }).click();
    await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
    await page
      .getByRole('button', { name: 'Add Payment Investigation Alpha Payments', exact: true })
      .click();
    await expect(page.getByRole('status')).toContainText('Loading payment investigations');
    const alpha = page.locator('.alpha-design-scope');
    await expect(alpha).toHaveAttribute('data-mode', theme);
    await expect(alpha).toHaveAttribute('data-generation', 'webkit');
    release();
    await expect(page.getByRole('alert')).toContainText('Unable to load payment investigations');
    const beforeRetry = requests;
    phase = 'ready';
    await page.getByRole('button', { name: 'Retry loading payment investigations' }).click();
    await expect(page.getByRole('row', { name: /AP-20481/ })).toBeVisible();
    await themeSwitch.setChecked(theme === 'dark');
    await expect(alpha).toHaveAttribute('data-mode', theme === 'light' ? 'dark' : 'light');
    await themeSwitch.setChecked(theme === 'light');
    await expect(alpha).toHaveAttribute('data-mode', theme);
    await page.getByRole('searchbox', { name: 'Search cases' }).fill('no matching investigation');
    await expect(page.getByText('No cases match the active filters.')).toBeVisible();
    await page
      .getByRole('tab', { selected: true })
      .getByRole('button', { name: 'delete', exact: true })
      .click();
    await expect(alpha).toHaveCount(0);
    await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible();
    expect(requests).toBeGreaterThan(beforeRetry);
    expect(errors).toEqual([]);
  });
}
