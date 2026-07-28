import { expect, test } from '@playwright/test';

test('loads both legacy migration MVPs directly from the portal host', async ({ page }) => {
  const requests: string[] = [];
  const pageErrors: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill('test');
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('button', { name: 'New tile' }).click();
  await page.getByRole('button', { name: 'Open Ratan Migration MVP' }).click();
  await expect(page.getByRole('heading', { name: 'Ratan container migration' })).toBeVisible();

  await page.getByRole('button', { name: 'New tile' }).click();
  await page.getByRole('button', { name: 'Open Cashflow Blotter MVP' }).click();
  await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Filter cashflows' }).fill('Atlas');
  await expect(page.getByText('CF-24001')).toBeVisible();
  await expect(page.getByText('CF-24002')).toHaveCount(0);

  expect(requests.some((url) => url.includes('127.0.0.1:9205/mf-manifest.json'))).toBe(true);
  expect(requests.some((url) => url.includes('127.0.0.1:9206/mf-manifest.json'))).toBe(true);
  expect(requests.some((url) => /single-spa|system\.min|importmap/i.test(url))).toBe(false);
  expect(pageErrors).toEqual([]);
});
