import { expect, test } from '@playwright/test';

const isProductionEdge = !!process.env.PLAYWRIGHT_PRODUCTION_EDGE;
const developmentTest = isProductionEdge ? test.skip : test;
const productionTest = isProductionEdge ? test : test.skip;

developmentTest('base host preserves the login experience and styling', async ({ page }) => {
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));

  await page.goto('/');

  const signIn = page.getByRole('link', { name: 'Sign In With SSO' });
  await expect(signIn).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Markets Operations One' })).toBeVisible();
  await expect(signIn).toHaveCSS('background-color', 'rgb(0, 135, 56)');
  expect(errors).toEqual([]);
});

developmentTest(
  'development origin logs in with fixtures and opens Cashflow Blotter',
  async ({ page }) => {
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
    const fontSize = Number.parseFloat(
      await presetButton.evaluate((element) => window.getComputedStyle(element).fontSize),
    );
    expect(fontSize).toBeGreaterThanOrEqual(10);
    expect(fontSize).toBeLessThanOrEqual(12);
  },
);

developmentTest(
  'ratan loads cashflow over the second federation boundary',
  async ({ page, request }) => {
    const errors: Error[] = [];
    page.on('pageerror', (error) => errors.push(error));

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
  },
);

developmentTest(
  'entitled user completes the Alpha Payments investigation journey',
  async ({ page }) => {
    const errors: Error[] = [];
    const alphaApiRequests: string[] = [];
    page.on('pageerror', (error) => errors.push(error));
    page.on('request', (request) => {
      if (request.url().includes('/api/alpha-payments/')) {
        alphaApiRequests.push(request.url());
      }
    });

    await page.goto('/?show_normal_login=Y&survey=no');
    await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
    await page.getByPlaceholder('Enter Password').fill('acceptance');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(page.getByText('New Tile', { exact: true })).toBeVisible();

    await page.getByText('New Tile', { exact: true }).click();
    const paymentInvestigationTile = page.getByText('Payment Investigation', { exact: false }).first();
    await expect(paymentInvestigationTile).toBeVisible();
    await paymentInvestigationTile.click();

    await expect(page.getByRole('heading', { name: 'Payment Investigation' })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByRole('row', { name: /AP-20481/ })).toContainText('Merlion Bank');

    const search = page.getByRole('searchbox', { name: 'Search cases' });
    await search.fill('northstar');
    await expect(page.getByRole('row', { name: /AP-20482/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /AP-20481/ })).toHaveCount(0);
    await search.clear();

    await page.getByRole('button', { name: 'Acknowledge AP-20481' }).click();
    await expect(page.getByRole('row', { name: /AP-20481.*Acknowledged/ })).toBeVisible();
    await expect(page.getByLabel('Acknowledged cases')).toContainText('2');

    expect(alphaApiRequests.length).toBeGreaterThanOrEqual(2);
    expect(alphaApiRequests.every((url) => url.startsWith('http://127.0.0.1:8001/'))).toBe(true);
    expect(errors).toEqual([]);

    await page.getByRole('button', { name: 'Add Workspace' }).click();
    await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(2);
    await page.getByRole('button', { name: 'delete' }).first().click();
    await expect(page.getByRole('heading', { name: 'Payment Investigation' })).toHaveCount(0);
  },
);

productionTest('production edge completes the captured Cashflow journey', async ({ page }) => {
  test.setTimeout(60_000);
  const errors: Error[] = [];
  const consoleErrors: string[] = [];
  page.on('pageerror', (error) => errors.push(error));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

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
  await expect(page.getByRole('button', { name: 'Pending Operator' })).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Pending Verification' })).toHaveCount(2);

  const gridTheme = page.locator('.ag-grid-ratan .ag-theme-alpine-dark');
  await expect(gridTheme).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('row', { name: /CF-ACCEPT-001/ })).toHaveCSS(
    'color',
    'rgb(255, 255, 255)',
  );

  const cashflowId = page.getByPlaceholder('Multiple searches separated by commas').first();
  await cashflowId.fill('M0P56753524');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const searchedRow = page.getByRole('row', { name: /M0P56753524/ });
  await expect(searchedRow).toBeVisible();
  await expect(page.getByText('1/1', { exact: true })).toBeVisible();
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toHaveCount(0);

  await searchedRow.dblclick();
  const detailsDialog = page.getByRole('dialog', { name: /Cashflow Detail/ });
  await expect(detailsDialog).toBeVisible();
  await expect(page.getByText(/Unable to fetch cashflow/)).toHaveCount(0);
  await expect(detailsDialog.getByText('56753524', { exact: true })).toBeVisible();
  await expect(detailsDialog.getByText('WAITING', { exact: true })).toBeVisible();
  await expect(detailsDialog.getByText('Pending Operator', { exact: true })).toBeVisible();

  await page.getByRole('tab', { name: 'Accounting Detail', exact: true }).click();
  await expect(
    detailsDialog
      .getByRole('tabpanel', { name: 'Accounting Detail', exact: true })
      .getByText('No Rows To Show', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();

  let builderButtons = page.getByRole('button', { name: 'Create or Modify' });
  await expect(builderButtons).toHaveCount(2);
  await builderButtons.first().click();
  await expect(page.getByRole('dialog', { name: /Custom Search/ })).toBeVisible();
  await expect(page.getByText('Pending operator cashflows', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();

  builderButtons = page.getByRole('button', { name: 'Create or Modify' });
  await builderButtons.nth(1).click();
  await expect(page.getByRole('dialog', { name: /View Builder/ })).toBeVisible();
  await expect(page.getByText('Available Fields', { exact: true })).toBeVisible();
  await expect(page.getByText('Display View', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();

  await expect(page.getByText(/cashflow notification has been interrupted/i)).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
