import type { Locator, Page } from '@playwright/test';
import { expect, test } from './portal-prototype.fixture';
import { referenceViewport } from '../fixtures/portal-prototype';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });

const shell = (page: Page) => page.locator('.portal-shell-header');
const workspaces = (page: Page) =>
  page.getByRole('tab').filter({ has: page.getByRole('textbox', { name: 'Workspace Name' }) });
const selectedWorkspace = (page: Page) =>
  page
    .getByRole('tab', { selected: true })
    .filter({ has: page.getByRole('textbox', { name: 'Workspace Name' }) });
const shellControls = (page: Page): Array<{ name: string; locator: Locator }> => [
  { name: 'brand', locator: shell(page).getByRole('img', { name: 'Markets Operations One logo' }) },
  { name: 'new tile', locator: page.getByRole('button', { name: 'Open new tile', exact: true }) },
  {
    name: 'theme',
    locator: page
      .getByRole('checkbox', { name: 'Theme Switch' })
      .locator('xpath=ancestor::section[1]'),
  },
  {
    name: 'clock',
    locator: page
      .getByRole('checkbox', { name: 'Time Switch' })
      .locator('xpath=ancestor::section[1]'),
  },
  { name: 'avatar', locator: page.getByRole('button', { name: 'User Profiles', exact: true }) },
];

async function expectControlsReachable(page: Page) {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('An explicit acceptance viewport is required.');
  const controls = shellControls(page);
  const boxes = [];
  for (const control of controls) {
    await expect(control.locator, `${control.name} is visible`).toBeVisible();
    const box = await control.locator.boundingBox();
    expect(box, `${control.name} has layout bounds`).not.toBeNull();
    if (!box) throw new Error(`${control.name} has no layout bounds.`);
    expect(box.x, `${control.name} stays within the left edge`).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, `${control.name} stays within the right edge`).toBeLessThanOrEqual(
      viewport.width,
    );
    expect(box.y, `${control.name} stays above the workspace`).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual((await shell(page).boundingBox())?.height ?? 0);
    boxes.push({ name: control.name, ...box });
  }
  for (let index = 0; index < boxes.length; index += 1) {
    for (const other of boxes.slice(index + 1)) {
      const box = boxes[index];
      const overlap =
        Math.min(box.x + box.width, other.x + other.width) > Math.max(box.x, other.x) &&
        Math.min(box.y + box.height, other.y + other.height) > Math.max(box.y, other.y);
      expect(overlap, `${box.name} does not overlap ${other.name}`).toBe(false);
    }
  }
  const width = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(width.document, 'the document has no horizontal overflow').toBeLessThanOrEqual(
    width.viewport,
  );
  expect(width.body, 'the body has no horizontal overflow').toBeLessThanOrEqual(width.viewport);
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} native header has the prototype boundary and reachable controls`, async ({
    page,
    portal,
  }) => {
    await page.setViewportSize(referenceViewport);
    await portal.open('empty', theme);
    await expect(shell(page)).toHaveCSS('height', '94px');
    expect((await page.locator('.prototype-home > main').boundingBox())?.y).toBe(94);
    await expectControlsReachable(page);
    await expect(page.getByRole('button', { name: 'Add Workspace', exact: true })).toBeVisible();
    await expect(workspaces(page)).toHaveCount(3);
    await expect(
      selectedWorkspace(page).getByRole('textbox', { name: 'Workspace Name' }),
    ).toHaveValue('Workspace 2');
  });

  test(`${theme} workspace add, rename, selection and deletion preserve navigation`, async ({
    page,
    portal,
  }) => {
    await page.setViewportSize(referenceViewport);
    await portal.open('empty', theme);
    await page.getByRole('button', { name: 'Add Workspace', exact: true }).click();
    await expect(workspaces(page)).toHaveCount(4);
    const selected = selectedWorkspace(page);
    const name = selected.getByRole('textbox', { name: 'Workspace Name' });
    await expect(name).toHaveValue('Workspace 3');
    await selected.dblclick();
    await expect(name).toBeFocused();
    await name.fill('Regional Settlement Operations');
    await page.keyboard.press('Tab');
    await expect(name).toHaveValue('Regional Settlement Operations');
    await workspaces(page).first().click();
    await expect(workspaces(page).first()).toHaveAttribute('aria-selected', 'true');
    await workspaces(page).last().click();
    await expect(
      selectedWorkspace(page).getByRole('textbox', { name: 'Workspace Name' }),
    ).toHaveValue('Regional Settlement Operations');
    await page
      .getByRole('tab', { selected: true })
      .getByRole('button', { name: 'delete', exact: true })
      .click();
    await expect(workspaces(page)).toHaveCount(3);
    await expect(
      selectedWorkspace(page).getByRole('textbox', { name: 'Workspace Name' }),
    ).toHaveValue('Workspace 2');
    expect(
      await page.evaluate(() => JSON.parse(localStorage.getItem('SET_WORKSPACES') ?? '[]').length),
    ).toBe(3);
  });

  test(`${theme} theme and UTC/local switches update preferences and clock`, async ({
    page,
    portal,
  }) => {
    await page.setViewportSize(referenceViewport);
    await portal.open('empty', theme);
    const themeSwitch = page.getByRole('checkbox', { name: 'Theme Switch' });
    await themeSwitch.setChecked(theme === 'dark');
    const opposite = theme === 'light' ? 'dark' : 'light';
    await expect(page.locator('html')).toHaveClass(`${opposite} sc-mode-${opposite}`);
    expect(await page.evaluate(() => localStorage.getItem('SET_THEME'))).toBe(opposite);
    await themeSwitch.setChecked(theme === 'light');
    await expect(page.locator('html')).toHaveClass(`${theme} sc-mode-${theme}`);
    const clock = page
      .getByRole('checkbox', { name: 'Time Switch' })
      .locator('xpath=ancestor::section[1]');
    await expect(clock).toContainText('06:45 UTC');
    const timeSwitch = page.getByRole('checkbox', { name: 'Time Switch' });
    await timeSwitch.uncheck();
    await expect(clock).toContainText('14:45 Local');
    expect(await page.evaluate(() => localStorage.getItem('SET_TIME_TYPE'))).toBe('local');
    await timeSwitch.check();
    await expect(clock).toContainText('06:45 UTC');
  });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
  ]) {
    test(`${theme} ${viewport.width}px header keeps long workspace tabs and controls usable`, async ({
      page,
      portal,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await portal.open('empty', theme, true);
      await expectControlsReachable(page);
      await expect(workspaces(page)).toHaveCount(10);
      const add = page.getByRole('button', { name: 'Add Workspace', exact: true });
      await add.focus();
      await expect(add).toBeFocused();
      const box = await add.boundingBox();
      expect(box?.x).toBeGreaterThanOrEqual(0);
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewport.width);
      await page.keyboard.press('Enter');
      await expect(workspaces(page)).toHaveCount(11);
      await expect(selectedWorkspace(page)).toBeInViewport();
      await expect(
        selectedWorkspace(page).getByRole('textbox', { name: 'Workspace Name' }),
      ).toBeInViewport();
      await expect(
        selectedWorkspace(page).getByRole('button', { name: 'delete', exact: true }),
      ).toBeInViewport();
      await expectControlsReachable(page);
      const selected = selectedWorkspace(page);
      const name = selected.getByRole('textbox', { name: 'Workspace Name' });
      await selected.dblclick();
      await expect(name).toBeFocused();
      await name.fill('Workspace acceptance');
      await page.keyboard.press('Tab');
      await expect(name).toHaveValue('Workspace acceptance');
      await selected.getByRole('button', { name: 'delete', exact: true }).click();
      await expect(workspaces(page)).toHaveCount(10);
      await expectControlsReachable(page);
    });
  }

  test(`${theme} login, new tile, real Cashflow launch and workspace removal complete`, async ({
    page,
    portal,
  }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(referenceViewport);
    await portal.open('empty', theme);
    await portal.openDrawer();
    await page
      .locator('.MuiDrawer-paper')
      .getByText(/^Cashflow Blotter\s*\[FX & Equity\]$/)
      .click();
    await expect(page.locator('.MuiDrawer-paper')).toBeHidden();
    await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText('CF-ACCEPT-002', { exact: true })).toBeVisible();
    const selected = selectedWorkspace(page);
    await expect(selected.getByRole('textbox', { name: 'Workspace Name' })).toHaveValue(
      'Cashflow Blotter [FX & Equity]',
    );
    await selected.getByRole('button', { name: 'delete', exact: true }).click();
    await expect(workspaces(page)).toHaveCount(2);
    await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Find tile$/i })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
