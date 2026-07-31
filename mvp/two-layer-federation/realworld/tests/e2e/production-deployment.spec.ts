import { expect, test, type Page } from '@playwright/test';

async function signIn(page: Page, path = '/') {
  await page.goto(path);
  await page.getByRole('textbox', { name: 'Username' }).fill('test');
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('button', { name: 'New tile' })).toBeVisible();
}

async function openCashflow(page: Page) {
  await page.getByRole('button', { name: 'New tile' }).click();
  await page.getByRole('button', { name: 'Open Cashflow' }).click();
}

test('loads the immutable Cashflow release through the production registry', async ({ page }) => {
  const responses: Array<{ url: string; cacheControl?: string }> = [];
  page.on('response', (response) =>
    responses.push({
      url: response.url(),
      cacheControl: response.headers()['cache-control'],
    }),
  );

  await signIn(page);
  await openCashflow(page);
  await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
  const filter = page.getByRole('searchbox', { name: 'Filter cashflows' });
  await filter.fill('USD');
  await expect(page.getByText('2 records')).toBeVisible();

  const manifest = responses.find(
    (response) =>
      response.url.includes('/artifacts/cashflow/') && response.url.endsWith('/mf-manifest.json'),
  );
  expect(manifest?.url).toMatch(
    /^https:\/\/localhost:9[45]43\/artifacts\/cashflow\/1\.0\.0-sha256-/,
  );
  expect(manifest?.cacheControl).toContain('immutable');
  expect(
    responses.some((response) =>
      /single-spa|system\.min|importmap|ratan[_-]container/i.test(response.url),
    ),
  ).toBe(false);
});

test('supports nested refresh from the static production host', async ({ page }) => {
  await signIn(page, '/cashflow/details/CF-1003');
  await expect(page.getByRole('heading', { name: 'CF-1003' })).toBeVisible();
  await page.reload();
  await page.getByRole('textbox', { name: 'Username' }).fill('test');
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'CF-1003' })).toBeVisible();
});

test('contains a remote failure and recovers without losing the host', async ({ page }) => {
  await page.route('**/artifacts/cashflow/**/mf-manifest.json', (route) => route.abort('failed'));
  await signIn(page);
  await openCashflow(page);
  await expect(page.getByRole('heading', { name: 'Application unavailable' })).toBeVisible();
  await page.unroute('**/artifacts/cashflow/**/mf-manifest.json');
  await page.getByRole('button', { name: 'Retry Cashflow' }).click();
  await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
});
