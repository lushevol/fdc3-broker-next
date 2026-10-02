import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';
import { expect, test } from './base-ui-parity.fixture';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });
const fonts = fileURLToPath(
  new URL('../../../sc-dev-web/sc-dev-web/public/assets/fonts/', import.meta.url),
);
const metadata = {
  ems2Role: 'SUPER_USER',
  active: true,
  createdAt: '2024-01-02T03:04:05Z',
  createdBy: 'ops.admin',
  updatedAt: '2024-02-03T04:05:06Z',
  updatedBy: 'ops.admin',
};
const category = { applicationCategoryId: 101, label: 'Settlement Admin', orderNo: 1, ...metadata };
const importMap = {
  importMapId: 301,
  keyName: '@fm/ratan_container',
  path: 'http://127.0.0.1:8009/remoteEntry.js',
  ...metadata,
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
  ...metadata,
};
const records = { category: [category], tile: [tile], importmap: [importMap] };
type ModuleName = keyof typeof records;
const moduleScenarios = {
  category: {
    idField: 'applicationCategoryId',
    id: 101,
    nameField: 'label',
    column: 'Category Label',
    name: 'Settlement Admin',
    created: 'New Operations',
    create: 'Create New Category',
  },
  tile: {
    idField: 'applicationTileId',
    id: 201,
    nameField: 'title',
    column: 'Tile Name',
    name: 'Cashflow Admin Tile',
    created: 'New Operations Tile',
    create: 'Create New Tile',
  },
  importmap: {
    idField: 'importMapId',
    id: 301,
    nameField: 'keyName',
    column: 'Module Name',
    name: '@fm/ratan_container',
    created: '@fm/new_operations',
    create: 'Create New Import Map',
  },
} as const;

async function prepare(page: Page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
  await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
    route.fulfill({
      path: join(fonts, basename(new URL(route.request().url()).pathname)),
    }),
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
      tiles: ['category', 'tile', 'importmap'].map((name, i) => ({
        id: 90 + i,
        title: title(name as ModuleName),
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
}

function title(moduleName: ModuleName) {
  return `${moduleName === 'importmap' ? 'Import Map' : moduleName[0].toUpperCase() + moduleName.slice(1)} Admin`;
}

async function openAdmin(page: Page, generation: string, mode: string, moduleName: ModuleName) {
  await page.goto(
    `/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=false`,
  );
  await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
  await page.getByPlaceholder('Enter Password').fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Theme Switch' }).setChecked(mode === 'light');
  await page.getByText('New Tile', { exact: true }).click();
  await page.getByText(title(moduleName), { exact: true }).click();
  await expect(page.getByRole('tab', { name: title(moduleName) })).toBeVisible();
  if (moduleName === 'tile') {
    await page.getByPlaceholder('Please select application category').click();
    await page.getByRole('option', { name: 'Settlement Admin' }).click();
  }
}

async function screenshot(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot(name, {
    animations: 'disabled',
    fullPage: true,
    maxDiffPixels: 0,
  });
}

for (const [generation, mode] of [
  ['legacy', 'dark'],
  ['webkit', 'light'],
] as const) {
  for (const moduleName of ['category', 'tile', 'importmap'] as const) {
    test(`${generation} ${moduleName} pending, empty and error states preserve appearance`, async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await prepare(page);
      let release: () => void = () => {
        throw new Error('Pending request has not started');
      };
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      let failed = false;
      await page.route('**/api/auth/v1/fmo/admin/**', async (route) => {
        const path = new URL(route.request().url()).pathname;
        if (!path.endsWith(`/${moduleName}/data`)) {
          const requestedModule = path.split('/').at(-2) as ModuleName;
          return route.fulfill({ json: { data: records[requestedModule] } });
        }
        if (failed)
          return route.fulfill({
            status: 503,
            json: { message: 'Admin service temporarily unavailable' },
          });
        await pending;
        return route.fulfill({ json: { data: [] } });
      });
      await openAdmin(page, generation, mode, moduleName);
      // These pages have no loading indicator: the pending response displays the empty grid.
      await expect(page.getByText('No rows', { exact: true })).toBeVisible();
      await screenshot(page, `${generation}-${moduleName}-pending.png`);
      release();
      await screenshot(page, `${generation}-${moduleName}-empty.png`);
      failed = true;
      await page.getByRole('button', { name: 'refresh', exact: true }).click();
      await expect(
        page.getByText('Admin service temporarily unavailable', { exact: true }),
      ).toBeVisible();
      await screenshot(page, `${generation}-${moduleName}-error.png`);
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(
        page.getByText('Admin service temporarily unavailable', { exact: true }),
      ).toHaveCount(0);
    });
  }

  for (const moduleName of ['category', 'tile', 'importmap'] as const) {
    test(`${generation} ${moduleName} sorting, filtering and mutations preserve callbacks`, async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await prepare(page);
      const calls: Record<string, unknown>[] = [];
      let release: () => void = () => {
        throw new Error('Mutation request has not started');
      };
      const scenario = moduleScenarios[moduleName];
      const record = records[moduleName][0];
      await page.route('**/api/auth/v1/fmo/admin/**', async (route) => {
        const path = new URL(route.request().url()).pathname;
        if (path.endsWith('/data')) {
          const requestedModule = path.split('/').at(-2) as ModuleName;
          return route.fulfill({
            json: {
              data:
                requestedModule === moduleName
                  ? [
                      record,
                      {
                        ...record,
                        [scenario.idField]: scenario.id + 1,
                        [scenario.nameField]:
                          moduleName === 'importmap' ? '@fm/alpha_admin' : 'Alpha Admin',
                        active: false,
                      },
                    ]
                  : records[requestedModule],
            },
          });
        }
        const payload = route.request().postDataJSON();
        calls.push(payload);
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        return route.fulfill({
          json: {
            data: {
              ...payload,
              [scenario.idField]: payload[scenario.idField] || scenario.id + 2,
              active:
                payload.mode === 'deactivate'
                  ? false
                  : payload.mode === 'checker'
                    ? true
                    : (payload.active ?? false),
            },
          },
        });
      });
      await openAdmin(page, generation, mode, moduleName);
      await page.getByRole('columnheader', { name: scenario.column }).click();
      await expect(page.locator('.MuiDataGrid-row').first()).toContainText(
        moduleName === 'importmap' ? '@fm/alpha_admin' : 'Alpha Admin',
      );
      await screenshot(page, `${generation}-${moduleName}-sorted.png`);
      const header = page.getByRole('columnheader', { name: scenario.column });
      await header.hover();
      await header.getByRole('button', { name: 'Menu' }).click();
      await page.getByRole('menuitem', { name: 'Filter' }).click();
      await page.getByPlaceholder('Filter value').fill(scenario.name);
      await expect(page.locator('.MuiDataGrid-row')).toHaveCount(1);
      await screenshot(page, `${generation}-${moduleName}-filtered.png`);
      // Clear the filter before exercising each existing mutation action.
      await page.getByPlaceholder('Filter value').clear();
      await expect(page.locator('.MuiDataGrid-row')).toHaveCount(2);
      await page.getByRole('columnheader', { name: 'Actions', exact: true }).click();
      for (const [action, submit, id] of [
        ['Edit', 'Update', scenario.id],
        ['Verify', 'Verified', scenario.id + 1],
        ['Deactivate', 'Deactivate', scenario.id],
      ] as const) {
        await page.getByTestId(`${action.toLowerCase()}-${id}`).click();
        const dialog = page.getByTestId('MicroWebUI_base_table_detail');
        await expect(dialog).toBeVisible();
        await screenshot(page, `${generation}-${moduleName}-${action.toLowerCase()}.png`);
        const submitButton = dialog
          .locator('button')
          .filter({ hasText: new RegExp(`^${submit}$`) });
        await submitButton.click();
        await expect(submitButton).toBeDisabled();
        await expect(dialog.locator('button').filter({ hasText: 'Close' }).last()).toBeDisabled();
        await screenshot(page, `${generation}-${moduleName}-${action.toLowerCase()}-saving.png`);
        release();
        await expect(dialog).toHaveCount(0);
      }
      await page.getByRole('button', { name: scenario.create }).click();
      const createDialog = page.getByTestId('MicroWebUI_base_table_detail');
      // The historical form commits field callbacks after 300 ms, including initial values.
      await page.waitForTimeout(350);
      await createDialog
        .getByTestId(new RegExp(`^ModalInput-${scenario.nameField}-`))
        .locator('input')
        .fill(scenario.created);
      await page.waitForTimeout(350);
      if (moduleName === 'tile') {
        await createDialog
          .getByTestId(/^ModalInput-importMap-/)
          .locator('input')
          .click();
        await page.getByRole('option', { name: '@fm/ratan_container', exact: true }).click();
        await page.waitForTimeout(350);
      }
      const createButton = createDialog.locator('button').filter({ hasText: /^Create$/ });
      await createButton.click();
      await expect(createButton).toBeDisabled();
      await expect
        .poll(() => calls[3])
        .toMatchObject({ [scenario.nameField]: scenario.created, ems2Role: 'SUPER_USER' });
      await screenshot(page, `${generation}-${moduleName}-create-saving.png`);
      release();
      await expect(createDialog).toHaveCount(0);
      await expect(page.getByText(scenario.created, { exact: true })).toBeVisible();
      expect(
        calls.slice(0, 3).map((call) => ({ mode: call.mode, id: call[scenario.idField] })),
      ).toEqual([
        { mode: 'maker', id: scenario.id },
        { mode: 'checker', id: scenario.id + 1 },
        { mode: 'deactivate', id: scenario.id },
      ]);
      if (moduleName === 'tile') {
        expect(calls[3]).toMatchObject({
          applicationCategory: { applicationCategoryId: 101 },
          importMap: { importMapId: 301 },
        });
      }
    });
  }

  test(`${generation} cached remote draft survives workspace switches`, async ({ page }) => {
    await prepare(page);
    await page.route('**/api/auth/v1/fmo/admin/**', (route) =>
      route.fulfill({ json: { data: [category] } }),
    );
    await openAdmin(page, generation, mode, 'category');
    await page.getByText('New Tile', { exact: true }).click();
    await page.getByText('Cashflow Blotter', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Cached remote fixture' })).toBeVisible();
    await page.getByLabel('Remote draft').fill('Unsaved settlement draft');
    await screenshot(page, `${generation}-cached-remote.png`);
    await page.getByRole('button', { name: 'Add Workspace' }).click();
    await expect(page.getByRole('heading', { name: 'Cached remote fixture' })).toBeHidden();
    await page.getByRole('tab').first().click();
    await expect(
      page.getByRole('columnheader', { name: 'Category Label', exact: true }),
    ).toBeVisible();
    await page.getByRole('tab', { name: 'Cashflow Blotter' }).click();
    await expect(page.getByRole('heading', { name: 'Cached remote fixture' })).toBeVisible();
    await expect(page.getByLabel('Remote draft')).toBeVisible();
    await expect(page.getByLabel('Remote draft')).toHaveValue('Unsaved settlement draft');
    await screenshot(page, `${generation}-cached-remote-restored.png`);
  });

  test(`${generation} Base picker popups and change callbacks preserve behavior`, async ({
    page,
  }) => {
    await prepare(page);
    await page.goto(
      `/fixtures/base-ui-parity.html?generation=${generation}&mode=${mode}&new-layout=false`,
    );
    await expect(page.getByLabel('Value date', { exact: true })).toBeVisible();
    await page
      .getByRole('button', { name: /Choose date/ })
      .first()
      .click();
    const dateDialog = page.getByRole('dialog', { name: 'Value date', exact: true });
    await expect(dateDialog).toBeVisible();
    await screenshot(page, `${generation}-base-date-popup.png`);
    await dateDialog.getByRole('gridcell', { name: '18', exact: true }).click();
    await expect(page.getByLabel('Last change')).toHaveText('2024-07-18 14:30');
    await page.keyboard.press('Escape');
    await expect(dateDialog).toHaveCount(0);
    await page.getByRole('button', { name: /Choose time/ }).click();
    const timeDialog = page.getByRole('dialog', { name: 'Settlement time', exact: true });
    await expect(timeDialog).toBeVisible();
    await screenshot(page, `${generation}-base-time-popup.png`);
    await timeDialog.getByRole('option', { name: '45 minutes', exact: true }).click();
    await expect(page.getByLabel('Last change')).toHaveText('2024-07-18 14:45');
    await timeDialog.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(timeDialog).toHaveCount(0);
    await page
      .getByRole('button', { name: /Choose date/ })
      .last()
      .click();
    const dateTimeDialog = page.getByRole('dialog', {
      name: 'Settlement date and time',
      exact: true,
    });
    await expect(dateTimeDialog).toBeVisible();
    await screenshot(page, `${generation}-base-date-time-popup.png`);
    await dateTimeDialog.getByRole('gridcell', { name: '19', exact: true }).click();
    await expect(page.getByLabel('Last change')).toHaveText('2024-07-19 14:45');
    await page.keyboard.press('Escape');
    await expect(dateTimeDialog).toHaveCount(0);
  });
}
