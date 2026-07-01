import { expect, test, type Page } from '@playwright/test';

test.use({ channel: 'chrome' });

async function closeExpiredSessionModal(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
}

async function loginToWorkspace(page: Page): Promise<void> {
  await page.goto('http://127.0.0.1:8001/?show_normal_login=Y');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto('http://127.0.0.1:8001/?show_normal_login=Y');
  await closeExpiredSessionModal(page);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await closeExpiredSessionModal(page);
  await page.waitForTimeout(3000);
}

test.describe('Cashflow Blotter Rendering', () => {
  test('cashflow blotter and ratan container expose Module Federation manifests', async ({
    page,
  }) => {
    for (const remote of [
      {
        name: 'ratan_cashflow_blotter',
        url: 'http://localhost:8015/mf-manifest.json',
        remoteEntry: 'ratan_cashflow_blotter.js',
      },
      {
        name: 'ratan_container',
        url: 'http://localhost:8009/mf-manifest.json',
        remoteEntry: 'ratan_container.js',
      },
    ]) {
      const response = await page.request.get(remote.url);
      expect(response.status()).toBe(200);

      const manifest = await response.json();
      expect(manifest.name).toBe(remote.name);
      expect(manifest.metaData.remoteEntry.name).toBe(remote.remoteEntry);
      expect(manifest.exposes.some((expose: { name: string }) => expose.name === '.')).toBe(true);
    }
  });

  test('logged-in app shell can initialize the Module Federation workspace path', async ({
    page,
  }) => {
    await loginToWorkspace(page);

    const errors: any[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    const hasNewTile = await page
      .getByText('New Tile')
      .isVisible()
      .catch(() => false);
    const hasFindTile = await page
      .getByText('Find tile')
      .isVisible()
      .catch(() => false);

    expect(hasNewTile || hasFindTile).toBe(true);
    expect(errors).toEqual([]);
  });

  test('cashflow blotter routes exist in compiled bundle', async ({ page }) => {
    const manifestResponse = await page.request.get('http://localhost:8015/mf-manifest.json');
    expect(manifestResponse.status()).toBe(200);

    const manifest = await manifestResponse.json();
    const defaultExpose = manifest.exposes.find((expose: { name: string }) => expose.name === '.');
    expect(defaultExpose).toBeTruthy();

    const exposedAssets = [
      ...defaultExpose.assets.js.sync,
      ...defaultExpose.assets.js.async,
    ] as string[];
    const exposedContent = await Promise.all(
      exposedAssets.map(async (assetPath) => {
        const response = await page.request.get(`http://localhost:8015/${assetPath}`);
        expect(response.status()).toBe(200);
        return response.text();
      }),
    );
    const content = exposedContent.join('\n');

    // All expected routes from the Routing component
    const routesToCheck = [
      '/cashflow_cn/*',
      '/cashflow_blotter_cn/cashflow_cn/*',
      '/cashflow_open_search/*',
      '/cashflow_group_management/*',
      '/cashflow_cn_dashboard/*',
      '/cashflow_bic_netting_static_table/*',
      '/cashflow_utilization_static_table/*',
      '/cashflow_authorization_limits/*',
      '/cashflow_splitting_static/*',
    ];

    for (const route of routesToCheck) {
      const cleanRoute = route.replace('/*', '').replace('/', '');
      const hasRoute = content.includes(cleanRoute);
      console.log(`Route ${route}: ${hasRoute ? 'present' : 'missing'}`);
      expect(hasRoute).toBe(true);
    }
  });
});
