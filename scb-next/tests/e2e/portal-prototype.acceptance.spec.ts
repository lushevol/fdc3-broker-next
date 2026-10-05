import { fileURLToPath } from 'node:url';
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './portal-prototype.fixture';
import {
  buildPrototypeAuth,
  expandedSubject,
  prototypeClock,
  referenceViewport,
  type PrototypeTheme,
} from '../fixtures/portal-prototype';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });
test.setTimeout(60_000);

type AuthFixture = ReturnType<typeof buildPrototypeAuth> & {
  body: { entitlementsToken?: string };
};
const remoteEntry = fileURLToPath(
  new URL('../../web/mfe-base-origin/fixtures/remote-entry.js', import.meta.url),
);
const adminRecords = [
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
  {
    applicationCategoryId: 102,
    label: 'Alpha Admin',
    orderNo: 2,
    ems2Role: 'SUPER_USER',
    active: true,
    createdAt: '2024-01-02T03:04:05Z',
    createdBy: 'ops.admin',
    updatedAt: '2024-02-03T04:05:06Z',
    updatedBy: 'ops.admin',
  },
];

async function submitFixtureLogin(page: Page, auth: AuthFixture, theme: PrototypeTheme) {
  await page.route(/\/api\/auth\/v2\/sso\/login(?:\?.*)?$/, (route) =>
    route.fulfill({
      json: auth.body,
      headers: { 'single-ui-authorization': `Bearer ${auth.token}` },
    }),
  );
  await page.getByLabel('Username', { exact: true }).fill('portal.acceptance');
  await page.getByLabel('Password', { exact: true }).fill('acceptance-fixture');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByRole('button', { name: 'User Profiles', exact: true })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(`${theme} sc-mode-${theme}`);
}

function tokenWithExpiry(token: string, expiry: number) {
  const [header, encoded, signature] = token.split('.');
  const claims = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  return `${header}.${Buffer.from(JSON.stringify({ ...claims, exp: expiry })).toString('base64url')}.${signature}`;
}

async function openTile(page: Page, title: string) {
  await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Tile Option' })
    .getByRole('button', { name: `Add ${title}`, exact: true })
    .click();
}

function workspaceTab(page: Page, title: string) {
  return page.getByRole('tab', { name: title, exact: true });
}

async function expectCachedAdmin(panel: Locator) {
  await expect(panel).toHaveAttribute('hidden', '');
  await expect(panel).toBeHidden();
  const grid = panel.locator('.MuiDataGrid-root');
  await expect
    .poll(() => grid.evaluate((element) => element.getBoundingClientRect().height))
    .toBeGreaterThan(0);
  await expect
    .poll(() => grid.evaluate((element) => element.getBoundingClientRect().width))
    .toBeGreaterThan(0);
  await expect(panel.getByRole('row')).toHaveCount(0);
  const create = panel.locator('button').filter({ hasText: /^Create New Category$/ });
  await create.evaluate((element) => (element as HTMLElement).focus());
  expect(await create.evaluate((element) => element === document.activeElement)).toBe(false);
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} logout survey keeps its explicit cancel policy and the authenticated session`, async ({
    page,
    portal,
  }) => {
    await page.setViewportSize(referenceViewport);
    await portal.open('empty', theme);
    const avatar = page.getByRole('button', { name: 'User Profiles', exact: true });
    const token = await page.evaluate(() => localStorage.getItem('SET_TOKEN'));
    await avatar.click();
    await page.getByRole('menuitem', { name: 'Logout', exact: true }).click();
    const survey = page.getByRole('dialog', { name: 'Leave Now?' });
    await expect(survey.getByRole('button', { name: 'Share Feedback & Logout' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(survey).toBeVisible();
    await page.mouse.click(10, 200);
    await expect(survey).toBeVisible();
    await survey.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(survey).toHaveCount(0);
    await expect(avatar).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('SET_TOKEN'))).toBe(token);
    await avatar.click();
    await expect(page.getByRole('menu')).toBeVisible();
  });

  test(`${theme} expired session requires an explicit choice and Extend resumes through relogin`, async ({
    page,
    portal,
  }) => {
    await page.setViewportSize(referenceViewport);
    await portal.open('login', theme);
    const auth = buildPrototypeAuth('shell');
    const now = Date.parse(prototypeClock.shell) / 1000;
    auth.token = tokenWithExpiry(auth.token, now + 30);
    await page.route(/\/api\/auth\/v2\/sso\/refreshtoken(?:\?.*)?$/, (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    let relogins = 0;
    const renewed = buildPrototypeAuth('shell');
    await page.route(/\/api\/auth\/v2\/sso\/relogin(?:\?.*)?$/, (route) => {
      relogins += 1;
      return route.fulfill({
        json: renewed.body,
        headers: { 'single-ui-authorization': `Bearer ${renewed.token}` },
      });
    });
    await submitFixtureLogin(page, auth, theme);
    await page.clock.runFor(31_000);
    const timeout = page.getByRole('dialog', { name: 'Your session has been expired' });
    await expect(timeout).toBeVisible();
    await expect(timeout.getByRole('button', { name: 'Logout', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(timeout).toBeVisible();
    await timeout.getByRole('button', { name: 'Extend', exact: true }).click();
    await expect(timeout).toHaveCount(0);
    await expect.poll(() => relogins).toBe(1);
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('SET_TOKEN')))
      .toBe(`Bearer ${renewed.token}`);
    await page.clock.runFor(31_000);
    await expect(timeout).toHaveCount(0);
    await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Tile Option' })).toBeVisible();
  });

  test(`${theme} cached admin filter and remote draft survive hiding, resizing and restoration`, async ({
    page,
    portal,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        /useResizeContainer.*empty (height|width)/s.test(message.text())
      )
        errors.push(message.text());
    });
    await page.setViewportSize(referenceViewport);
    await page.route('http://127.0.0.1:8009/remoteEntry.js', (route) =>
      route.fulfill({ path: remoteEntry, contentType: 'application/javascript' }),
    );
    await portal.open('login', theme);
    const auth: AuthFixture = buildPrototypeAuth('shell');
    auth.body.entitlementsToken = auth.token;
    auth.body.entities.push({
      id: 99,
      applicationName: 'RATAN',
      name: 'FMO PORTAL ADMIN',
      roleId: 99,
      roleName: 'SUPER_USER',
      subjects: [],
    });
    auth.body.drawers.push({
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
          emailSupport: 'portal-prototype@example.test',
          entity: ['X_RATANONE'],
        },
      ],
    });
    await page.route('**/api/auth/v1/fmo/admin/category/data', (route) =>
      route.fulfill({ json: { data: adminRecords } }),
    );
    await submitFixtureLogin(page, auth, theme);
    await openTile(page, 'Category Admin');
    const admin = page.getByTestId('workspaces-tabpanel-1');
    const header = admin.getByRole('columnheader', { name: 'Category Label' });
    await expect(header).toBeVisible();
    await header.click();
    await expect(admin.locator('.MuiDataGrid-row').first()).toContainText('Alpha Admin');
    await header.hover();
    await header.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('menuitem', { name: 'Filter', exact: true }).click();
    await page.getByPlaceholder('Filter value').fill('Settlement');
    await expect(admin.locator('.MuiDataGrid-row')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await openTile(page, 'Cashflow Blotter [FX & Equity]');
    await expect(page.getByRole('heading', { name: 'Cached remote fixture' })).toBeVisible();
    await page.getByLabel('Remote draft').fill('Keep this settlement draft');
    await expectCachedAdmin(admin);
    await page.setViewportSize({ width: 390, height: 844 });
    await expectCachedAdmin(admin);
    await page.setViewportSize(referenceViewport);
    await workspaceTab(page, 'Category Admin').click();
    await expect(header).toBeVisible();
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(admin.locator('.MuiDataGrid-row')).toHaveCount(1);
    await expect(admin.locator('.MuiDataGrid-row')).toContainText('Settlement Admin');
    await expect(page.getByLabel('Remote draft')).toBeHidden();
    await workspaceTab(page, 'Cashflow Blotter [FX & Equity]').click();
    await expect(page.getByLabel('Remote draft')).toHaveValue('Keep this settlement draft');
    await expectCachedAdmin(admin);
    expect(errors).toEqual([]);
  });

  test(`${theme} mobile pinch-zoom evidence and interrupted normal-motion overlays retain usable focus`, async ({
    page,
    portal,
    context,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await portal.open('empty', theme);
    const trigger = page.getByRole('button', { name: 'Open new tile', exact: true });
    const drawer = page.getByRole('dialog', { name: 'Tile Option' });
    await trigger.click();
    await expect(drawer).toBeVisible();
    expect(
      await drawer.evaluate((element) => getComputedStyle(element).transitionDuration),
    ).not.toBe('0s');
    await page.keyboard.press('Escape');
    await trigger.press('Enter');
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.press('Enter');
    await expect(drawer).toHaveCSS('transform', 'none');
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1.25 });
    await expect.poll(() => page.evaluate(() => window.visualViewport?.scale)).toBe(1.25);
    const zoomCapture = testInfo.outputPath(`drawer-${theme}-pinch-zoom.png`);
    await page.screenshot({ path: zoomCapture, animations: 'disabled' });
    await testInfo.attach(`drawer-${theme}-pinch-zoom.png`, {
      path: zoomCapture,
      contentType: 'image/png',
    });
    // Pinch zoom changes the visual viewport; desktop text/layout zoom remains a manual gate.
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.press('Enter');
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
    await portal.openProfile();
    const profile = page.getByRole('dialog', { name: 'User Profile' });
    const role = profile.getByRole('button', {
      name: 'RATAN::X_RATANONE::FMO_COO_SUP',
      exact: true,
    });
    await role.click();
    await role.press('Enter');
    await role.press('Enter');
    await expect(role).toHaveAttribute('aria-expanded', 'true');
    const subject = profile.getByRole('button', { name: expandedSubject, exact: true });
    await subject.click();
    await subject.press('Enter');
    await subject.press('Enter');
    await expect(subject).toHaveAttribute('aria-expanded', 'true');
    await expect(profile.getByText('F_Export_Data', { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(profile).toBeHidden();
    await expect(page.getByRole('button', { name: 'User Profiles', exact: true })).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });
}
