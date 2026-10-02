import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './base-ui-parity.fixture';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });
const fonts = fileURLToPath(
  new URL('../../../sc-dev-web/sc-dev-web/public/assets/fonts/', import.meta.url),
);
const remoteEntry = fileURLToPath(
  new URL('../../web/mfe-base-origin/fixtures/remote-entry.js', import.meta.url),
);
const metadata = {
  ems2Role: 'SUPER_USER',
  active: true,
  createdAt: '2024-01-02T03:04:05Z',
  createdBy: 'ops.admin',
  updatedAt: '2024-02-03T04:05:06Z',
  updatedBy: 'ops.admin',
};
const records = [
  { applicationCategoryId: 101, label: 'Settlement Admin', orderNo: 1, ...metadata },
  { applicationCategoryId: 102, label: 'Alpha Admin', orderNo: 2, ...metadata },
];

async function prepare(page: Page) {
  await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
  await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
    route.fulfill({
      path: join(fonts, basename(new URL(route.request().url()).pathname)),
    }),
  );
  await page.route('http://127.0.0.1:8009/remoteEntry.js', (route) =>
    route.fulfill({ path: remoteEntry, contentType: 'application/javascript' }),
  );
  await page.route('**/api/auth/v2/sso/login', async (route) => {
    const response = await route.fetch();
    const body = await response.json();
    const user = JSON.parse(body.userInfo);
    user.entitlements = {
      'X_RATANONE:FMO_OPS_SUP': { RATAN_STRATEGIC_CASHFLOW_BLOTTER: ['UI_Read_Access'] },
    };
    body.userInfo = JSON.stringify(user);
    body.entitlementsToken = response.headers()['single-ui-authorization'].split(' ')[1];
    body.entities.push({ id: 99, name: 'FMO PORTAL ADMIN', roleName: 'SUPER_USER', subjects: [] });
    body.drawers.push({
      id: 99,
      label: 'Administration',
      tiles: [
        {
          id: 90,
          title: 'Category Admin',
          container: '@fm/base',
          module: '/category',
          tile: '/category',
          imageDarkTheme: '',
          imageLightTheme: '',
          entity: ['X_RATANONE'],
        },
      ],
    });
    await route.fulfill({ response, json: body });
  });
  await page.route('**/api/auth/v1/fmo/admin/category/data', (route) =>
    route.fulfill({ json: { data: records } }),
  );
}

async function openTile(page: Page, name: string) {
  await page.getByText('New Tile', { exact: true }).click();
  await page.getByText(name, { exact: true }).click();
}

async function verifyCachedAdmin(panel: Locator) {
  await expect(panel).toHaveAttribute('hidden', '');
  await expect(panel.locator('.tabmain')).toHaveAttribute('hidden', '');
  await expect(panel).toBeHidden();
  const grid = panel.locator('.MuiDataGrid-root');
  await expect
    .poll(() => grid.evaluate((node) => node.getBoundingClientRect().height))
    .toBeGreaterThan(0);
  await expect
    .poll(() => grid.evaluate((node) => node.getBoundingClientRect().width))
    .toBeGreaterThan(0);
  await expect(grid).toBeHidden();
  const widths = await panel.evaluate((node) => ({
    panel: node.getBoundingClientRect().width,
    parent: node.parentElement?.getBoundingClientRect().width,
  }));
  expect(widths.panel).toBe(widths.parent);
  await expect(panel.getByRole('row')).toHaveCount(0);
  const create = panel.locator('button').filter({ hasText: /^Create New Category$/ });
  await create.evaluate((node) => {
    (node as HTMLElement).style.visibility = 'visible';
    (node as HTMLElement).focus();
  });
  await expect(create).toBeHidden();
  expect(await create.evaluate((node) => document.activeElement === node)).toBe(false);
}

for (const generation of ['legacy', 'webkit'] as const) {
  test(`${generation} cached Base admin stays measurable, hidden and stateful`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const dimensionErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        /useResizeContainer.*empty (height|width)/s.test(message.text())
      ) {
        dimensionErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepare(page);
    await page.goto(
      `/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=false`,
    );
    await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
    await page.getByPlaceholder('Enter Password').fill('acceptance');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await openTile(page, 'Category Admin');
    const admin = page.getByTestId('workspaces-tabpanel-1');
    await expect(admin.getByRole('columnheader', { name: 'Category Label' })).toBeVisible();
    await admin.getByRole('columnheader', { name: 'Category Label' }).click();
    await expect(admin.locator('.MuiDataGrid-row').first()).toContainText('Alpha Admin');
    const header = admin.getByRole('columnheader', { name: 'Category Label' });
    await header.hover();
    await header.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('menuitem', { name: 'Filter' }).click();
    await page.getByPlaceholder('Filter value').fill('Settlement');
    await expect(admin.locator('.MuiDataGrid-row')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await openTile(page, 'Cashflow Blotter');
    const remote = page.getByTestId('workspaces-tabpanel-2');
    await expect(page.getByRole('heading', { name: 'Cached remote fixture' })).toBeVisible();
    await page.getByLabel('Remote draft').fill('Keep remote draft');
    await verifyCachedAdmin(admin);
    await page.setViewportSize({ width: 390, height: 844 });
    await verifyCachedAdmin(admin);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('tab', { name: 'Category Admin' }).click();
    await expect(admin.getByRole('columnheader', { name: 'Category Label' })).toBeVisible();
    await expect(admin.locator('.MuiDataGrid-row')).toHaveCount(1);
    await expect(admin.locator('.MuiDataGrid-row')).toContainText('Settlement Admin');
    await expect(admin.getByRole('columnheader', { name: 'Category Label' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await expect(remote).toHaveAttribute('hidden', '');
    expect(await remote.evaluate((node) => node.getBoundingClientRect().height)).toBe(0);
    await expect(page.getByLabel('Remote draft')).toBeHidden();
    await admin.getByTestId('edit-101').click();
    const details = page.getByTestId('MicroWebUI_base_table_detail');
    const surface = details.locator('.MuiDialog-paper');
    await expect(surface).toBeVisible();
    const before = await surface.boundingBox();
    expect(before?.width).toBeGreaterThan(0);
    expect(before?.height).toBeGreaterThan(0);
    await details
      .locator('button')
      .filter({ hasText: /^Close$/ })
      .last()
      .click();
    await expect(details).toHaveCount(0);
    await page.getByRole('tab', { name: 'Cashflow Blotter' }).click();
    await expect(page.getByLabel('Remote draft')).toBeVisible();
    await expect(page.getByLabel('Remote draft')).toHaveValue('Keep remote draft');
    await verifyCachedAdmin(admin);
    await page.getByRole('tab', { name: 'Category Admin' }).click();
    await expect(admin.getByRole('columnheader', { name: 'Category Label' })).toBeVisible();
    await admin.getByTestId('edit-101').click();
    await expect(surface).toBeVisible();
    expect(await surface.boundingBox()).toEqual(before);
    await details
      .locator('button')
      .filter({ hasText: /^Close$/ })
      .last()
      .click();
    expect(dimensionErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
}
