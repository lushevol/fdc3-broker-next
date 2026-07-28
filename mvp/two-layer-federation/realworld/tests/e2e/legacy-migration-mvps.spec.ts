import { expect, test } from '@playwright/test';

test('loads the migrated Cashflow CN workflow directly from the portal host', async ({ page }) => {
  const requests: string[] = [];
  const pageErrors: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/cashflow-blotter');
  await page.getByRole('textbox', { name: 'Username' }).fill('test');
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Quick Search', { exact: true })).toBeVisible();
  await expect(page.getByText('Cashflow ID', { exact: true })).toBeVisible();
  await expect(page.getByText('Trade ID', { exact: true })).toBeVisible();
  await expect(page.getByText('Product Taxonomy', { exact: true })).toBeVisible();
  await expect(page.getByText('SCB Booking Entity', { exact: true })).toBeVisible();
  await expect(page.getByText('Cashflow State', { exact: true })).toBeVisible();
  await expect(page.getByText('Results', { exact: true })).toBeVisible();
  await expect(page.getByText('2/2', { exact: true })).toBeVisible();
  await expect(page.getByText('CF-CN-24001', { exact: true })).toBeVisible();
  await expect(page.getByText('CF-CN-24002', { exact: true })).toBeVisible();
  await expect(page.getByText('Filters', { exact: true })).toBeVisible();
  await expect(page.getByText('Views', { exact: true })).toBeVisible();
  await page.getByTestId('select-fliter').click();
  await expect(page.getByText('USD pending verification', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByTestId('selectView').click();
  await expect(
    page.getByRole('option', { name: /^Operations essentials/ }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByTestId('/advanced_search/entry_selector/setting_btn'),
  ).toBeEnabled();
  await expect(page.getByTestId('customView-create-modify-btn')).toBeEnabled();

  await page.getByText('CF-CN-24001', { exact: true }).dblclick();
  const details = page.getByTestId('cashflow-details-dialog-body');
  await expect(details).toBeVisible();
  await expect(details.getByText('Trade Details', { exact: true })).toBeVisible();
  await expect(details.getByText('Cashflow Details', { exact: true }).first()).toBeVisible();
  await expect(details.getByText('TRD-CN-90001', { exact: true })).toBeVisible();
  await expect(details.getByText('USD', { exact: true }).first()).toBeVisible();
  await expect(details.getByText('1,250,000', { exact: true })).toBeVisible();

  expect(requests.some((url) => url.includes('127.0.0.1:9206/mf-manifest.json'))).toBe(true);
  expect(requests.some((url) => url.includes('127.0.0.1:9205'))).toBe(false);
  expect(
    requests.filter((url) =>
      /single-spa|system\.min|importmap|@fm\/base/i.test(url)
      || (
        /ratan[_-](?:container|migration)/i.test(url)
        && /mf-manifest\.json|remoteEntry\.js/i.test(url)
      ),
    ),
  ).toEqual([]);
  expect(
    pageErrors.filter((message) =>
      /module federation|reactcurrentdispatcher|invalid hook|system\.import|render exploded/i.test(
        message,
      ),
    ),
  ).toEqual([]);
});
