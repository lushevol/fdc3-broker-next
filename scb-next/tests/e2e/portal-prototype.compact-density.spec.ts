import { writeFile } from 'node:fs/promises';
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './base-ui-parity.fixture';
import { expectPortalTheme } from './portal-prototype.fixture';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });
test.setTimeout(90_000);

const viewports = [
  { name: 'desktop', width: 1512, height: 982 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

async function appearance(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    const textTops = new Set<number>();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      for (const rect of Array.from(range.getClientRects())) textTops.add(Math.round(rect.top));
    }
    return {
      fontSize: Number.parseFloat(style.fontSize),
      fontFamily: style.fontFamily,
      width: bounds.width,
      height: bounds.height,
      textLines: textTops.size,
    };
  });
}

async function expectProsperFace(page: Page, locator: Locator) {
  await locator.evaluate((element) => element.setAttribute('data-compact-font-probe', ''));
  const session = await page.context().newCDPSession(page);
  try {
    await session.send('DOM.enable');
    await session.send('CSS.enable');
    const { root } = await session.send('DOM.getDocument');
    const { nodeId } = await session.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: '[data-compact-font-probe]',
    });
    const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId });
    expect
      .soft(fonts.filter((font) => font.glyphCount > 0).map((font) => font.familyName))
      .toEqual(['SC Prosper Sans']);
  } finally {
    await session.detach();
    await locator.evaluate((element) => element.removeAttribute('data-compact-font-probe'));
  }
}

async function openCompactLogin(page: Page, theme: 'light' | 'dark') {
  await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
  await page.goto(`/?show_normal_login=Y&survey=no&new-styles=true&login-theme=${theme}`);
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function signIn(page: Page, theme: 'light' | 'dark') {
  await page.getByLabel('Username', { exact: true }).fill('mock.cashflow');
  await page.getByLabel('Password', { exact: true }).fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Theme Switch' }).setChecked(theme === 'light');
  await expectPortalTheme(page, theme);
}

async function addAdminContracts(page: Page) {
  await page.route('**/api/auth/v2/sso/login', async (route) => {
    const response = await route.fetch();
    const body = await response.json();
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
    route.fulfill({
      json: {
        data: [
          {
            applicationCategoryId: 101,
            label: 'Settlement Admin',
            orderNo: 1,
            ems2Role: 'SUPER_USER',
            active: true,
            createdAt: '2024-01-02T03:04:05Z',
            createdBy: 'ops.admin',
            updatedAt: '2024-02-03T04:05:06Z',
            updatedBy: 'ops.admin',
          },
        ],
      },
    }),
  );
}

async function openTile(page: Page, title: string) {
  await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
  await page.getByRole('button', { name: `Add ${title}`, exact: true }).click();
}

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of viewports) {
    test(`${theme} ${viewport.name} login keeps compact typography and controls`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await openCompactLogin(page, theme);
      const login = page.getByTestId('portal-prototype-login');
      const heading = await appearance(login.locator('h1'));
      const input = await appearance(page.getByLabel('Username', { exact: true }));
      const submit = await appearance(page.getByRole('button', { name: 'Sign In', exact: true }));
      expect.soft(heading.fontSize).toBe(32);
      expect.soft(input.fontSize).toBe(14);
      expect.soft(submit.fontSize).toBe(14);
      expect.soft(submit.height).toBe(44);
      expect.soft(submit.width).toBeLessThanOrEqual(360);
      expect.soft(submit.textLines).toBe(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
      await expectProsperFace(page, login.locator('h1'));
      await page.screenshot({ path: testInfo.outputPath('compact-login.png'), fullPage: true });
      const metricsPath = testInfo.outputPath('rendered-metrics.json');
      await writeFile(metricsPath, JSON.stringify({ heading, input, submit }));
      await testInfo.attach('rendered-metrics', {
        path: metricsPath,
        contentType: 'application/json',
      });
    });

    test(`${theme} ${viewport.name} Base and real Cashflow share compact business-control typography`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await addAdminContracts(page);
      await openCompactLogin(page, theme);
      await signIn(page, theme);
      await openTile(page, 'Category Admin');
      const create = page.getByRole('button', { name: 'Create New Category', exact: true });
      await expect(create).toBeVisible();
      await expect(page.getByRole('row', { name: /Settlement Admin/ })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const admin = await appearance(create);
      expect.soft(admin.fontSize).toBe(12);
      expect.soft(admin.height).toBe(28);
      expect.soft(admin.textLines).toBe(1);
      expect.soft(admin.fontFamily).toContain('SC Prosper Sans');
      await expectProsperFace(page, create);
      await page.screenshot({ path: testInfo.outputPath('compact-admin.png') });
      await openTile(page, 'Cashflow Blotter');
      await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible({
        timeout: 60_000,
      });
      await page.evaluate(() => document.fonts.ready);
      const operator = page.getByRole('button', { name: 'Pending Operator', exact: true }).first();
      const verification = page
        .getByRole('button', { name: 'Pending Verification', exact: true })
        .first();
      const input = page.locator('input.ant-input:visible').first();
      const header = page.locator('.ag-header-cell-text:visible').first();
      const cell = page.locator('.ag-cell').filter({ hasText: 'CF-ACCEPT-001' }).first();
      const cashflow = {
        operator: await appearance(operator),
        verification: await appearance(verification),
        search: await appearance(page.getByRole('button', { name: 'Search', exact: true })),
        input: await appearance(input),
        header: await appearance(header),
        cell: await appearance(cell),
      };
      for (const button of [cashflow.operator, cashflow.verification]) {
        expect.soft(button.fontSize).toBe(12);
        expect.soft(button.height).toBe(28);
        expect.soft(button.textLines).toBe(1);
      }
      expect.soft(cashflow.search.fontSize).toBe(14);
      expect.soft(cashflow.search.height).toBe(32);
      expect.soft(cashflow.search.textLines).toBe(1);
      expect.soft(cashflow.input.fontSize).toBe(12);
      expect.soft(cashflow.header.fontSize).toBe(11);
      expect.soft(cashflow.cell.fontSize).toBe(12);
      for (const [name, control] of Object.entries(cashflow)) {
        expect.soft(control.fontFamily, `${name} computed font`).toContain('SC Prosper Sans');
      }
      await expectProsperFace(page, verification);
      await expectProsperFace(page, header);
      await page.mouse.move(0, 0);
      await page.screenshot({ path: testInfo.outputPath('compact-cashflow.png') });
      const metricsPath = testInfo.outputPath('rendered-metrics.json');
      await writeFile(metricsPath, JSON.stringify({ admin, cashflow }));
      await testInfo.attach('rendered-metrics', {
        path: metricsPath,
        contentType: 'application/json',
      });
      await page
        .getByRole('tab', { selected: true })
        .getByRole('button', { name: 'delete', exact: true })
        .click();
      await expect(page.locator('.ag-root')).toHaveCount(0);
      await expect(create).toBeVisible();
    });
  }
}
