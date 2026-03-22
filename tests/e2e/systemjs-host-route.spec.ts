import { expect, test } from '@playwright/test';

const systemAssetNames = [
  'base.js',
  'template_container.js',
  'template_container-app.js',
  'template.js',
  'template-app.js',
];

test('host login flow mounts template container and tile through SystemJS', async ({ page }) => {
  const fatalErrors: string[] = [];
  const assetStatuses = new Map<string, number>();

  page.on('console', (msg) => {
    if (msg.type() !== 'error') {
      return;
    }

    const text = msg.text();
    if (
      /SystemJS|single-spa|LOADING_SOURCE_CODE|Failed to fetch dynamically imported module|Loading chunk/i.test(
        text,
      )
    ) {
      fatalErrors.push(text);
    }
  });

  page.on('pageerror', (error) => {
    fatalErrors.push(error.message);
  });

  page.on('response', (response) => {
    const url = response.url();
    const assetName = systemAssetNames.find((name) => url.includes(`/${name}`));
    if (assetName) {
      assetStatuses.set(assetName, response.status());
    }
  });

  await page.goto('http://127.0.0.1:8001/?show_normal_login=Y');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto('http://127.0.0.1:8001/?show_normal_login=Y');

  const closeExpiredSessionModal = async () => {
    const closeButton = page.getByRole('button', { name: 'Close' });
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  };

  await closeExpiredSessionModal();

  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await closeExpiredSessionModal();

  const findTileButton = page.getByRole('button', { name: 'Find tile' });
  await expect(findTileButton).toBeVisible();
  await findTileButton.evaluate((element: HTMLButtonElement) => {
    element.click();
  });

  await expect(page.getByText('Tile Options')).toBeVisible();
  await page.getByText('Test Tile', { exact: true }).click();

  await expect(page.getByRole('tab', { name: 'Test Tile' })).toBeVisible();
  await expect(page.getByRole('tabpanel').first()).toContainText('test');

  await page.reload();
  await closeExpiredSessionModal();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toHaveCount(0);
  await expect(page.getByRole('tab', { name: 'Test Tile' })).toBeVisible();
  await expect(page.getByRole('tabpanel').first()).toContainText('test');

  expect(assetStatuses.get('base.js')).toBeTruthy();
  expect([200, 304]).toContain(assetStatuses.get('template_container.js'));
  expect([200, 304]).toContain(assetStatuses.get('template_container-app.js'));
  expect([200, 304]).toContain(assetStatuses.get('template.js'));
  expect([200, 304]).toContain(assetStatuses.get('template-app.js'));
  expect(fatalErrors).toEqual([]);
});
