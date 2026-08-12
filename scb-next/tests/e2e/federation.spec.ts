import { expect, test } from '@playwright/test';

test('base host preserves the login experience and styling', async ({ page }) => {
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));

  await page.goto('/');

  const signIn = page.getByRole('link', { name: 'Sign In With SSO' });
  await expect(signIn).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Markets Operations One' })).toBeVisible();
  await expect(signIn).toHaveCSS('background-color', 'rgb(0, 135, 56)');
  expect(errors).toEqual([]);
});

test('ratan loads cashflow over the second federation boundary', async ({ page, request }) => {
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));

  const [ratanEntry, cashflowEntry] = await Promise.all([
    request.get('http://127.0.0.1:8009/remoteEntry.js'),
    request.get('http://127.0.0.1:8015/remoteEntry.js'),
  ]);
  expect(ratanEntry.ok()).toBe(true);
  expect(cashflowEntry.ok()).toBe(true);

  await page.goto('http://127.0.0.1:8009/');
  await expect(page.getByRole('button', { name: 'API Status' })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: 'Refresh Page' })).toBeVisible();
  expect(errors).toEqual([]);
});
