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
  await expect(page.getByText('0/0', { exact: true })).toBeVisible();

  expect(requests.some((url) => url.includes('127.0.0.1:9206/mf-manifest.json'))).toBe(true);
  expect(
    requests.some((url) =>
      /single-spa|system\.min|importmap|ratan_(?:cashflow|trades)|@fm\/base/i.test(url),
    ),
  ).toBe(false);
  expect(
    pageErrors.filter((message) =>
      /module federation|reactcurrentdispatcher|invalid hook|system\.import|render exploded/i.test(
        message,
      ),
    ),
  ).toEqual([]);
});
