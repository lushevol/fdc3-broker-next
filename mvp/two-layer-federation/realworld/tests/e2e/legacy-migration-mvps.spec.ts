import { expect, test } from '@playwright/test';

test('loads the migrated Cashflow CN workflow directly from the portal host', async ({ page }) => {
  const requests: string[] = [];
  const pageErrors: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/cashflow-blotter');
  await page.getByRole('textbox', { name: 'Enter username' }).fill('test');
  await page.getByRole('textbox', { name: 'Enter password' }).fill('test');
  await page.getByRole('button', { name: 'Sign in', exact: true }).last().click();

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
  await page
    .getByRole('textbox', { name: 'Multiple searches separated by commas' })
    .first()
    .fill('CF-CN-24001');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('1/1', { exact: true })).toBeVisible();
  await expect(page.getByText('CF-CN-24001', { exact: true })).toBeVisible();
  await expect(page.getByText('CF-CN-24002', { exact: true })).not.toBeVisible();
  await page.getByRole('button', { name: 'Clear Filters', exact: true }).click();
  await expect(page.getByText('2/2', { exact: true })).toBeVisible();
  await expect(page.getByText('Filters', { exact: true })).toBeVisible();
  await expect(page.getByText('Views', { exact: true })).toBeVisible();
  await page.getByTestId('select-fliter').click();
  await page.getByText('USD pending verification', { exact: true }).click();
  await expect(page.getByText('1/1', { exact: true })).toBeVisible();
  await expect(page.getByText('CF-CN-24001', { exact: true })).toBeVisible();
  await expect(page.getByText('CF-CN-24002', { exact: true })).not.toBeVisible();

  await page.getByRole('button', { name: 'Clear', exact: true }).first().click();
  await expect(page.getByText('2/2', { exact: true })).toBeVisible();
  await page.getByTestId('selectView').click();
  await page.getByRole('option', { name: /^Operations essentials/ }).click();
  await expect(page.getByRole('columnheader', { name: 'Trade ID' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Counterparty FMCODE' })).not.toBeVisible();
  await expect(page.getByText('Notification Error', { exact: true })).not.toBeVisible();
  await expect(page.getByTestId('/advanced_search/entry_selector/setting_btn')).toBeEnabled();
  await expect(page.getByTestId('customView-create-modify-btn')).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Export File' })).toBeEnabled();

  await page.getByText('CF-CN-24001', { exact: true }).dblclick();
  const details = page.getByTestId('cashflow-details-dialog-body');
  await expect(details).toBeVisible();
  await expect(details.getByText('Trade Details', { exact: true })).toBeVisible();
  await expect(details.getByText('Cashflow Details', { exact: true }).first()).toBeVisible();
  await expect(details.getByText('TRD-CN-90001', { exact: true })).toBeVisible();
  await expect(details.getByText('USD', { exact: true }).first()).toBeVisible();
  await expect(details.getByText('1,250,000', { exact: true })).toBeVisible();
  const dialog = page.getByRole('dialog');
  const dialogBounds = await dialog.boundingBox();
  const viewport = page.viewportSize();
  expect(dialogBounds).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(dialogBounds!.x).toBeGreaterThanOrEqual(0);
  expect(dialogBounds!.y).toBeGreaterThanOrEqual(0);
  expect(dialogBounds!.x + dialogBounds!.width).toBeLessThanOrEqual(viewport!.width);
  expect(dialogBounds!.y + dialogBounds!.height).toBeLessThanOrEqual(viewport!.height);
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(dialog).not.toBeVisible();

  await page.getByText('CF-CN-24001', { exact: true }).click({ button: 'right' });
  await page.getByRole('treeitem', { name: 'Hold', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Hold' })).toBeVisible();
  await page.getByPlaceholder('Please type in comment.').fill('Hosted acceptance');
  const holdResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      response.url().endsWith('/api/ratan/v1/ratan/lifecycle/hold'),
  );
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  const holdResponse = await holdResponsePromise;
  expect(holdResponse.ok()).toBe(true);
  expect(holdResponse.request().postDataJSON()).toMatchObject({
    action: 'Hold',
    comment: 'Hosted acceptance',
    cashflows: [
      {
        cashflowId: 'CF-CN-24001',
        businessVersion: '1',
        minorVersion: '0',
        cashflowVersion: '3',
      },
    ],
  });
  await expect(page.getByText('Hold successfully submitted', { exact: true })).toBeVisible();

  expect(requests.some((url) => url.includes('127.0.0.1:9206/mf-manifest.json'))).toBe(true);
  expect(requests.some((url) => url.includes('127.0.0.1:9205'))).toBe(false);
  expect(
    requests.filter(
      (url) =>
        /single-spa|system\.min|importmap|@fm\/base/i.test(url) ||
        (/ratan[_-](?:container|migration)/i.test(url) &&
          /mf-manifest\.json|remoteEntry\.js/i.test(url)),
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
