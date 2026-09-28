import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });

const fontsDirectory = fileURLToPath(
  new URL('../../../sc-dev-web/sc-dev-web/dist/assets/fonts/', import.meta.url),
);
const recordMetadata = {
  ems2Role: 'SUPER_USER',
  active: true,
  createdAt: '2024-01-02T03:04:05Z',
  createdBy: 'ops.admin',
  updatedAt: '2024-02-03T04:05:06Z',
  updatedBy: 'ops.admin',
};
const category = {
  applicationCategoryId: 101,
  label: 'Settlement Admin',
  orderNo: 1,
  ...recordMetadata,
};
const importMap = {
  importMapId: 301,
  keyName: '@fm/ratan_container',
  path: 'http://127.0.0.1:8009/remoteEntry.js',
  ...recordMetadata,
};
const tile = {
  applicationTileId: 201,
  applicationCategory: category,
  importMap,
  title: 'Cashflow Admin Tile',
  subtitle: 'Settlement operations',
  module: '/cashflow_blotter_cn',
  tile: '/cashflow_cn',
  ems2Subject: 'RATAN_STRATEGIC_CASHFLOW_BLOTTER',
  ems2Entities: 'X_RATANONE',
  imageDarkTheme: '',
  imageLightTheme: '',
  ...recordMetadata,
};
const records = { category: [category], tile: [tile], importmap: [importMap] };

for (const [generation, mode] of [
  ['legacy', 'dark'],
  ['webkit', 'light'],
] as const) {
  for (const moduleName of ['category', 'tile', 'importmap'] as const) {
    test(`${generation} ${mode} ${moduleName} admin grid and editor match before migration`, async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
      await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
        route.fulfill({
          path: join(fontsDirectory, basename(new URL(route.request().url()).pathname)),
        }),
      );
      await page.route('**/api/auth/v2/sso/login', async (route) => {
        const response = await route.fetch();
        const body = await response.json();
        const userInfo = JSON.parse(body.userInfo);
        userInfo.entitlements = {
          'X_RATANONE:FMO_OPS_SUP': { RATAN_STRATEGIC_CASHFLOW_BLOTTER: ['UI_Read_Access'] },
        };
        body.userInfo = JSON.stringify(userInfo);
        body.entitlementsToken = response.headers()['single-ui-authorization'].split(' ')[1];
        body.entities.push({
          id: 99,
          name: 'FMO PORTAL ADMIN',
          roleName: 'SUPER_USER',
          subjects: [],
        });
        body.drawers.push({
          id: 99,
          label: 'Administration',
          tiles: ['category', 'tile', 'importmap'].map((name, index) => ({
            id: 90 + index,
            title: `${name === 'importmap' ? 'Import Map' : name[0].toUpperCase() + name.slice(1)} Admin`,
            container: '@fm/base',
            module: `/${name}`,
            tile: `/${name}`,
            imageDarkTheme: '',
            imageLightTheme: '',
            entity: ['X_RATANONE'],
          })),
        });
        await route.fulfill({ response, json: body });
      });
      await page.route('**/api/auth/v1/fmo/admin/**', (route) => {
        const match = new URL(route.request().url()).pathname.match(
          /\/admin\/(category|tile|importmap)\/(data|audit)$/,
        );
        const rows = match ? records[match[1] as keyof typeof records] : [];
        return route.fulfill({ json: { data: rows } });
      });

      await page.goto(
        `/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=false`,
      );
      await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
      await page.getByPlaceholder('Enter Password').fill('acceptance');
      await page.getByRole('button', { name: 'Sign In', exact: true }).click();
      await page.getByRole('checkbox', { name: 'Theme Switch' }).setChecked(mode === 'light');
      await page.getByText('New Tile', { exact: true }).click();
      const tileName = `${moduleName === 'importmap' ? 'Import Map' : moduleName[0].toUpperCase() + moduleName.slice(1)} Admin`;
      await page.getByText(tileName, { exact: true }).click();
      await expect(page.getByRole('tab', { name: tileName })).toBeVisible();

      if (moduleName === 'tile') {
        const categoryField = page.getByPlaceholder('Please select application category');
        await expect(categoryField).toBeVisible();
        await categoryField.click();
        await categoryField.fill('Settlement');
        await expect(page.getByRole('option', { name: 'Settlement Admin' })).toBeVisible();
        await expect(page).toHaveScreenshot(`${generation}-${mode}-tile-listbox.png`, {
          animations: 'disabled',
          fullPage: true,
          maxDiffPixels: 0,
        });
        await page.getByRole('option', { name: 'Settlement Admin' }).click();
      }

      const visibleRecord =
        moduleName === 'category'
          ? 'Settlement Admin'
          : moduleName === 'tile'
            ? 'Cashflow Admin Tile'
            : '@fm/ratan_container';
      await expect(page.getByText(visibleRecord, { exact: true }).first()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${generation}-${mode}-${moduleName}-grid.png`, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixels: 0,
      });

      const createName =
        moduleName === 'importmap'
          ? 'Create New Import Map'
          : `Create New ${moduleName[0].toUpperCase() + moduleName.slice(1)}`;
      await page.getByRole('button', { name: createName }).click();
      const dialog = page.getByTestId('MicroWebUI_base_table_detail');
      await expect(dialog).toBeVisible();
      const close = page.locator('button').filter({ hasText: 'Close' }).last();
      await expect(close).toBeVisible();
      await expect(page).toHaveScreenshot(`${generation}-${mode}-${moduleName}-editor.png`, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixels: 0,
      });
      await close.click();
      await expect(dialog).toHaveCount(0);
    });
  }
}
