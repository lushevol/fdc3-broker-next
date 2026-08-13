import { expect, test } from '@playwright/test';

test('base host preserves the login experience and styling', async ({ page }) => {
  test.skip(!!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'development-origin acceptance only');
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));

  await page.goto('/');

  const signIn = page.getByRole('link', { name: 'Sign In With SSO' });
  await expect(signIn).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Markets Operations One' })).toBeVisible();
  await expect(signIn).toHaveCSS('background-color', 'rgb(0, 135, 56)');
  expect(errors).toEqual([]);
});

test('development origin logs in with fixtures and opens Cashflow Blotter', async ({ page }) => {
  test.skip(!!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'development-origin acceptance only');

  await page.goto('/?show_normal_login=Y&survey=no');
  await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
  await page.getByPlaceholder('Enter Password').fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByText('New Tile', { exact: true })).toBeVisible();

  await page.getByText('New Tile', { exact: true }).click();
  await page.getByText('Cashflow Blotter', { exact: true }).click();

  await expect(page.getByText('Quick Search', { exact: true })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible();

  const presetButton = page.getByRole('button', { name: 'Pending Operator' }).first();
  await expect(presetButton).toHaveCSS('font-family', /Poppins/);
  await expect(presetButton).toHaveCSS('font-weight', '600');
  await expect(presetButton).toHaveCSS('text-transform', 'capitalize');
  const fontSize = Number.parseFloat(await presetButton.evaluate(element =>
    window.getComputedStyle(element).fontSize,
  ));
  expect(fontSize).toBeGreaterThanOrEqual(10);
  expect(fontSize).toBeLessThanOrEqual(12);
});

test('ratan loads cashflow over the second federation boundary', async ({ page, request }) => {
  test.skip(!!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'development-origin acceptance only');
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

test('production edge logs in with fixtures and opens Cashflow Blotter', async ({ page }) => {
  test.skip(!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'production-edge acceptance only');
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));

  await page.goto('/?show_normal_login=Y&survey=no');
  await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
  await page.getByPlaceholder('Enter Password').fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByText('New Tile', { exact: true })).toBeVisible();

  await page.getByText('New Tile', { exact: true }).click();
  await expect(page.getByText('Cashflow Blotter', { exact: true })).toBeVisible();
  await page.getByText('Cashflow Blotter', { exact: true }).click();

  await expect(page.getByText('Quick Search', { exact: true })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Custom Search/View', { exact: true })).toBeVisible();
  await expect(page.getByText('Filters', { exact: true })).toBeVisible();
  await expect(page.getByText('Views', { exact: true })).toBeVisible();
  await expect(page.getByRole('treegrid')).toBeVisible();
  await expect(page.getByText(/Cashflow CN could not be rendered/)).toHaveCount(0);
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible();
  await expect(page.getByText('CF-ACCEPT-002', { exact: true })).toBeVisible();

  const gridTheme = page.locator('.ag-grid-ratan .ag-theme-alpine-dark');
  await expect(gridTheme).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('row', { name: /CF-ACCEPT-001/ })).toHaveCSS(
    'color',
    'rgb(255, 255, 255)',
  );

  const builderButtons = page.getByRole('button', { name: 'Create or Modify' });
  await expect(builderButtons).toHaveCount(2);
  await builderButtons.nth(1).click();
  await expect(page.getByRole('dialog', { name: /View Builder/ })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();

  await page.getByRole('row', { name: /CF-ACCEPT-001/ }).dblclick();
  await expect(page.getByRole('dialog', { name: /Cashflow Detail/ })).toBeVisible();
  await expect(page.getByText(/Unable to fetch cashflow/)).toHaveCount(0);
  expect(errors).toEqual([]);
});
