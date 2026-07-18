import { expect, test } from '@playwright/test';

test.describe('two-layer federation MVP', () => {
  test('loads Cashflow directly and completes the workspace journey', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));

    await page.goto('/');
    await expect(page.getByTestId('architecture-badge')).toHaveText('Host → Application');
    await expect(page.getByText('Legacy runtime').locator('..').getByText('None')).toBeVisible();

    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
    await expect(page).toHaveURL(/\/cashflow$/);

    const filter = page.getByRole('searchbox', { name: 'Filter cashflows' });
    await filter.fill('USD');
    await expect(page.getByText('2 records')).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'CF-1001' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: 'CF-1002' })).toHaveCount(0);

    await filter.clear();
    await page.getByRole('button', { name: 'Select CF-1002' }).click();
    await page.getByRole('button', { name: 'View CF-1002 details' }).click();
    await expect(page).toHaveURL(/\/cashflow\/details\/CF-1002$/);
    await expect(page.getByRole('heading', { name: 'CF-1002' })).toBeVisible();

    await page.getByRole('button', { name: 'Notify host about CF-1002' }).click();
    await expect(page.getByRole('status')).toContainText('Cashflow CF-1002 selected');

    await page.reload();
    await expect(page.getByRole('heading', { name: 'CF-1002' })).toBeVisible();
    await page.getByRole('button', { name: /Back to cashflows/ }).click();
    await expect(filter).toHaveValue('');

    await page.getByRole('button', { name: 'Close Cashflow' }).click();
    await expect(page.getByText('Choose an application')).toBeVisible();
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await expect(page.getByRole('searchbox', { name: 'Filter cashflows' })).toHaveValue('');
    await expect(page.locator('[data-instance-id="cashflow-2"]')).toBeVisible();

    expect(requests.some((url) => url.includes('127.0.0.1:9101/mf-manifest.json'))).toBe(true);
    expect(requests.some((url) => /single-spa|system\.min|importmap|ratan[_-]container/i.test(url))).toBe(false);
    const runtimeManifests = requests.filter((url) => /mf-manifest\.json|remoteEntry\.js/i.test(url));
    expect(runtimeManifests.length).toBeGreaterThan(0);
    expect(runtimeManifests.every((url) => /127\.0\.0\.1:9101/.test(url))).toBe(true);
    expect(requests.some((url) => /ratan[_-]design.*(?:manifest|remote)|design[_-]system.*(?:manifest|remote)/i.test(url))).toBe(false);
  });

  test('propagates host appearance live, persists it, and exposes visible keyboard focus', async ({ page }) => {
    await page.goto('/');
    const hostRoot = page.locator('[data-ratan-scope="host"]');
    await expect(hostRoot).toHaveAttribute('data-ratan-theme', 'dark');
    await expect(hostRoot).toHaveAttribute('data-ratan-density', 'compact');

    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    const applicationRoot = page.locator('[data-ratan-scope="application"]');
    await expect(applicationRoot).toHaveAttribute('data-ratan-theme', 'dark');
    await expect(applicationRoot).toHaveAttribute('data-ratan-density', 'compact');

    await page.getByRole('button', { name: 'Use light theme' }).click();
    await expect(hostRoot).toHaveAttribute('data-ratan-theme', 'light');
    await expect(applicationRoot).toHaveAttribute('data-ratan-theme', 'light');
    await page.getByRole('button', { name: 'Use comfortable density' }).click();
    await expect(hostRoot).toHaveAttribute('data-ratan-density', 'comfortable');
    await expect(applicationRoot).toHaveAttribute('data-ratan-density', 'comfortable');

    await page.reload();
    await expect(page.locator('[data-ratan-scope="host"]')).toHaveAttribute('data-ratan-theme', 'light');
    await expect(page.locator('[data-ratan-scope="application"]')).toHaveAttribute('data-ratan-density', 'comfortable');

    await page.locator('body').click({ position: { x: 4, y: 4 } });
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus-visible');
    await expect(focused).toBeVisible();
    expect(await focused.evaluate((element) => getComputedStyle(element).outlineWidth)).not.toBe('0px');
  });

  test('renders the independently built application with deterministic standalone appearance', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto('http://127.0.0.1:9101/');
    await expect(page.getByRole('heading', { name: 'Cashflow blotter' }), pageErrors.join('\n')).toBeVisible();
    const applicationRoot = page.locator('[data-ratan-scope="application"]');
    await expect(applicationRoot).toHaveAttribute('data-ratan-theme', 'dark');
    await expect(applicationRoot).toHaveAttribute('data-ratan-density', 'compact');
  });

  test('contains a remote download failure and retries after recovery', async ({ page }) => {
    await page.route('**/mf-manifest.json', (route) => route.abort('failed'));
    await page.goto('/');
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await expect(page.getByRole('heading', { name: 'Application unavailable' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open Cashflow' })).toBeEnabled();

    await page.unroute('**/mf-manifest.json');
    await page.getByRole('button', { name: 'Retry Cashflow' }).click();
    await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
  });

  test('uses the runtime registry URL without rebuilding the host', async ({ page }) => {
    let requestedReleaseManifest = false;
    page.on('request', (request) => {
      if (request.url().includes('mf-manifest.json?release=B')) requestedReleaseManifest = true;
    });
    await page.route('**/registry.json', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          applications: [{
            id: 'cashflow', displayName: 'Cashflow', remoteName: 'mfe_cashflow_poc',
            manifestUrl: 'http://127.0.0.1:9101/mf-manifest.json?release=B',
            exposedModule: './application', basePath: '/cashflow', contractVersion: '1.0.0',
            appearanceContractVersion: '1.0.0',
            capabilities: ['navigation', 'notifications', 'telemetry', 'workspace', 'appearance'],
          }],
        }),
      }),
    );
    await page.goto('/');
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await expect(page.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
    expect(requestedReleaseManifest).toBe(true);
  });

  test('contains an incompatible appearance contract before application rendering', async ({ page }) => {
    await page.route('**/registry.json', (route) =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          applications: [{
            id: 'cashflow', displayName: 'Cashflow', remoteName: 'mfe_cashflow_poc',
            manifestUrl: 'http://127.0.0.1:9101/mf-manifest.json', exposedModule: './application',
            basePath: '/cashflow', contractVersion: '1.0.0', appearanceContractVersion: '2.0.0',
            capabilities: ['navigation', 'notifications', 'telemetry', 'workspace', 'appearance'],
          }],
        }),
      }),
    );
    await page.goto('/');
    await page.getByRole('button', { name: 'Open Cashflow' }).click();
    await expect(page.getByRole('heading', { name: 'Application unavailable' })).toBeVisible();
    await expect(page.getByText(/Unsupported appearance contract version/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open Cashflow' })).toBeEnabled();
  });
});
