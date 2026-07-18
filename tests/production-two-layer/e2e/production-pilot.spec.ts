import { expect, test } from '@playwright/test';

test.describe('production two-layer pilot', () => {
  test('loads Cashflow directly and completes its domain journey', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto('/');
    await expect(page.getByText('Host → Application')).toBeVisible();
    await expect(page.getByText('Legacy runtime').locator('..').getByText('None')).toBeVisible();
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
    const filter = page.getByRole('searchbox', { name: 'Filter cashflows' });
    await filter.fill('USD');
    await expect(page.getByText('2 records')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Select CF-1001' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Select CF-1002' })).toHaveCount(0);
    await filter.clear();
    await page.getByRole('button', { name: 'Select CF-1002' }).click();
    await page.getByRole('button', { name: 'View CF-1002 details' }).click();
    await expect(page).toHaveURL(/\/cashflow\/details\/CF-1002$/);
    await page.getByRole('button', { name: 'Notify host about CF-1002' }).click();
    await expect(page.getByRole('status')).toContainText('Cashflow CF-1002 selected');
    expect(requests.some((url) => url.includes('127.0.0.1:9201/mf-manifest.json'))).toBe(true);
    expect(requests.some((url) => /single-spa|system\.min|importmap|ratan[_-]container/i.test(url))).toBe(false);
  });

  test('propagates and persists host-owned appearance', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    const host = page.locator('[data-ratan-scope="host"]');
    const application = page.locator('[data-ratan-scope="application"]');
    await page.getByRole('button', { name: 'Use light theme' }).click();
    await page.getByRole('button', { name: 'Use comfortable density' }).click();
    await expect(host).toHaveAttribute('data-ratan-theme', 'light');
    await expect(application).toHaveAttribute('data-ratan-theme', 'light');
    await expect(application).toHaveAttribute('data-ratan-density', 'comfortable');
    await page.reload();
    await expect(page.locator('[data-ratan-scope="application"]')).toHaveAttribute('data-ratan-density', 'comfortable');
    await page.locator('body').click({ position: { x: 4, y: 4 } });
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus-visible')).toBeVisible();
  });

  test('supports nested refresh and fresh close/reopen state', async ({ page }) => {
    await page.goto('/cashflow/details/CF-1003');
    await expect(page.getByRole('heading', { name: 'CF-1003' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to cashflows' }).click();
    await page.getByRole('searchbox').fill('GBP');
    await page.getByRole('button', { name: 'Close Cashflow' }).click();
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await expect(page.getByRole('searchbox')).toHaveValue('');
    await expect(page.locator('[data-instance-id="cashflow-2"]')).toBeVisible();
  });

  test('runs standalone and contains recoverable remote failures', async ({ page }) => {
    await page.goto('http://127.0.0.1:9201/');
    await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
    await expect(page.locator('[data-ratan-scope="application"]')).toHaveAttribute('data-ratan-theme', 'dark');

    await page.route('**/mf-manifest.json', (route) => route.abort('failed'));
    await page.goto('http://127.0.0.1:9200/');
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await expect(page.getByRole('heading', { name: 'Application unavailable' })).toBeVisible();
    await page.unroute('**/mf-manifest.json');
    await page.getByRole('button', { name: 'Retry Cashflow' }).click();
    await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
  });

  test('runs the Authorization Limits grid cohort by pointer and keyboard', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await page.getByRole('button', { name: 'Authorization Limits' }).click();
    await expect(page).toHaveURL(/\/cashflow\/authorization-limits$/);
    const gridRegion = page.getByRole('region', { name: 'Authorization Limits' });
    await expect(gridRegion.getByRole('treegrid')).toBeVisible();
    await expect(gridRegion.getByRole('row')).toHaveCount(6);

    const filter = page.getByRole('searchbox', { name: 'Filter Authorization Limits' });
    await filter.fill('TREASURY');
    await expect(gridRegion.getByText('TREASURY-ASIA')).toBeVisible();
    await expect(gridRegion.getByText('GLOBAL-MAKER')).toHaveCount(0);
    await filter.clear();

    const limitationHeader = gridRegion.getByRole('columnheader', { name: /Limitation/ });
    await limitationHeader.click();
    await expect(limitationHeader).toHaveAttribute('aria-sort', 'ascending');

    const profileCell = gridRegion.getByRole('gridcell', { name: 'CONTROL-L1' });
    await profileCell.dblclick();
    await expect(page).toHaveURL(/\/cashflow\/authorization-limits\/details\/LIM-1009$/);
    await expect(page.getByText('$750,000.00')).toBeVisible();
    await expect(page.getByText(/remain in the legacy workflow/i)).toBeVisible();

    await page.getByRole('button', { name: 'Back to Authorization Limits' }).click();
    const keyboardCell = page.getByRole('region', { name: 'Authorization Limits' }).getByRole('gridcell', { name: 'GLOBAL-MAKER' });
    await keyboardCell.click();
    await keyboardCell.press('Enter');
    await expect(page).toHaveURL(/\/cashflow\/authorization-limits\/details\/LIM-1001$/);

    await page.getByRole('button', { name: 'Back to Authorization Limits' }).click();
    const application = page.locator('[data-ratan-scope="application"]');
    const grid = page.locator('.ratan-data-grid');
    await expect(grid).toHaveCSS('--ag-row-height', '36px');
    await page.getByRole('button', { name: 'Use comfortable density' }).click();
    await expect(application).toHaveAttribute('data-ratan-density', 'comfortable');
    await expect(grid).toHaveCSS('--ag-row-height', '44px');
  });
});
