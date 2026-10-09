import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, expect } from '@playwright/test';

const portalUrl = process.env.PORTAL_URL ?? 'http://localhost:8181';
const output = process.env.PORTAL_BROWSER_OUTPUT ?? '/tmp/mfe-base-styled-browser';
const timeout = 30_000;
const report = { portalUrl, scenarios: [], failures: [] };
const photo = '<svg xmlns="http://www.w3.org/2000/svg" width="151" height="151"><rect width="151" height="151" fill="#b7c9d3"/><circle cx="75" cy="56" r="25" fill="white"/><path d="M27 146c0-33 21-53 48-53s49 20 49 53" fill="white"/></svg>';
const savedKeys = ['SET_TOKEN', 'SET_USER', 'SET_THEME', 'theme', 'SET_TIME_TYPE', 'SET_WORKSPACES'];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: process.env.PORTAL_BROWSER_HEADLESS !== 'false' });

async function scenario(name, action) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 982 }, locale: 'en-US', timezoneId: 'Asia/Singapore' });
  const page = await context.newPage();
  page.setDefaultTimeout(timeout);
  page.setDefaultNavigationTimeout(timeout);
  const runtimeErrors = [];
  const consoleErrors = [];
  const baseArtifacts = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('response', (response) => {
    if (/\/base(?:-production)?\/base\.js(?:\?|$)/.test(response.url())) {
      baseArtifacts.push({ url: response.url(), status: response.status() });
    }
  });
  await page.route('https://axess.sc.net/**/photo', (route) => route.fulfill({ contentType: 'image/svg+xml', body: photo }));
  await page.route('https://leap.standardchartered.com/**/photo_lg.jpg', (route) => route.fulfill({ contentType: 'image/svg+xml', body: photo }));
  try {
    const evidence = await action(page, baseArtifacts);
    assert.deepEqual(runtimeErrors, [], 'The built Base must not throw runtime errors');
    assert.deepEqual(consoleErrors, [], 'The built Base must not log browser console errors');
    report.scenarios.push({ name, passed: true, baseArtifacts, runtimeErrors, consoleErrors, evidence });
    console.info(`PASS ${name}`);
  } catch (error) {
    await page.screenshot({ path: path.join(output, `${name}-failure.png`), fullPage: true }).catch(() => {});
    report.scenarios.push({ name, passed: false, baseArtifacts, runtimeErrors, consoleErrors });
    report.failures.push({ name, message: error instanceof Error ? error.stack : String(error) });
    console.error(`FAIL ${name}: ${error instanceof Error ? error.message : error}`);
  } finally {
    await context.close();
    await writeFile(path.join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  }
}

async function open(page, artifacts, artifact = 'development', newStyles = true, mode = 'light') {
  const proofPath = artifact === 'production' ? '/production-proof/' : '/';
  await page.goto(`${portalUrl}${proofPath}?show_normal_login=Y&survey=no&new-styles=${newStyles}&login-theme=${mode}${artifact === 'production' ? '&artifact=production' : ''}`);
  await expect(page.locator('body')).toHaveAttribute('data-base-artifact', artifact);
  const expectedPath = artifact === 'production' ? '/base-production/base.js' : '/base/base.js';
  await expect.poll(() => artifacts.some((entry) => new URL(entry.url).pathname === expectedPath && entry.status === 200)).toBe(true);
  const mounted = await page.evaluate(() => {
    const system = window.System;
    const name = system.resolve('@fm/base');
    const base = system.get(name);
    return { resolved: name, bootstrap: typeof base?.bootstrap, mount: typeof base?.mount, provider: typeof base?.Provider, service: typeof base?.Service };
  });
  assert.equal(new URL(mounted.resolved).pathname, expectedPath, 'The actual emitted SystemJS artifact must be mounted');
  assert.equal(mounted.bootstrap, 'function');
  assert.equal(mounted.mount, 'function');
  assert.equal(mounted.provider, 'object');
  assert.equal(mounted.service, 'object');
  return mounted;
}

async function login(page, mode = 'light') {
  const username = page.getByLabel('Username', { exact: true }).or(page.getByPlaceholder('Enter Username', { exact: true })).first();
  const password = page.getByLabel('Password', { exact: true }).or(page.getByPlaceholder('Enter Password', { exact: true })).first();
  await username.fill('mock.cashflow');
  await password.fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByRole('button', { name: 'User Profiles', exact: true })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Theme Switch', exact: true }).setChecked(mode === 'light');
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toHaveCount(0);
}

async function expectRemote(page, generation, mode) {
  await expect(page.getByTestId('systemjs-fixture-tile')).toBeVisible();
  await expect(page.getByTestId('remote-appearance')).toHaveText(`${generation} / ${mode}`);
  const root = page.getByTestId('systemjs-fixture-tile').locator('xpath=ancestor::*[contains(@class,"ratan-design-root")][1]');
  await expect(root).toHaveAttribute('data-generation', generation);
  await expect(root).toHaveAttribute('data-mode', mode);
}

async function savedState(page) {
  return page.evaluate((keys) => Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)])), savedKeys);
}

await scenario('development-systemjs-journey', async (page, artifacts) => {
  const mounted = await open(page, artifacts);
  await expect(page.getByRole('group', { name: 'Local portal style', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Styling console', exact: true })).toBeVisible();
  await login(page);
  await expect(page.getByTestId('portal-prototype-empty')).toBeVisible();
  await expect(page.getByTestId('portal-prototype-empty').locator('h1')).toHaveCSS('font-size', '20px');
  await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Tile Option', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add Cashflow Blotter', exact: true }).click();
  await expectRemote(page, 'webkit', 'light');
  await page.getByRole('checkbox', { name: 'Theme Switch', exact: true }).uncheck();
  await expectRemote(page, 'webkit', 'dark');
  const saved = await savedState(page);
  assert.ok(saved.SET_TOKEN, 'Login token must be preserved across generation changes');
  const beforeNavigations = await page.evaluate(() => performance.getEntriesByType('navigation').length);
  for (const generation of ['legacy', 'webkit']) {
    await page.getByRole('group', { name: 'Local portal style', exact: true }).getByRole('button', {
      name: `Use ${generation === 'legacy' ? 'Legacy' : 'WebKit'} portal style`, exact: true,
    }).click();
    await expectRemote(page, generation, 'dark');
    assert.deepEqual(await savedState(page), saved, 'Style selection must preserve authentication, preferences, and workspaces');
  }
  assert.equal(await page.evaluate(() => performance.getEntriesByType('navigation').length), beforeNavigations, 'Style switching must not reload the document');
  await page.getByRole('button', { name: 'Styling console', exact: true }).click();
  const consoleDialog = page.getByRole('dialog', { name: 'Styling console', exact: true });
  await expect(consoleDialog).toBeVisible();
  await page.getByLabel('Font size (px)', { exact: true }).fill('16');
  await page.getByLabel('Font size (px)', { exact: true }).press('Tab');
  await page.getByRole('checkbox', { name: 'Apply to Portal', exact: true }).check();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('portal.dev.style-preview.v1') ?? '{}').settings?.fontSize)).toBe(16);
  await page.getByRole('button', { name: 'Reset styles', exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Apply to Portal', exact: true })).not.toBeChecked();
  await page.getByRole('button', { name: 'Close styling console', exact: true }).click();
  await expect(consoleDialog).toBeHidden();
  await expectRemote(page, 'webkit', 'dark');
  const initialTabs = await page.getByRole('tab').count();
  await page.getByRole('button', { name: 'Add Workspace', exact: true }).click();
  await expect(page.getByRole('tab')).toHaveCount(initialTabs + 1);
  const tileTab = page.getByRole('tab', { name: 'Cashflow Blotter', exact: true });
  await tileTab.click();
  await expectRemote(page, 'webkit', 'dark');
  await tileTab.getByRole('button', { name: 'delete', exact: true }).click();
  await expect(page.getByTestId('systemjs-fixture-tile')).toHaveCount(0);
  await expect(page.getByRole('tab')).toHaveCount(initialTabs);
  await page.screenshot({ path: path.join(output, 'development-workspace.png'), fullPage: true });
  return { mounted, originalTabs: initialTabs, remainingTabs: await page.getByRole('tab').count() };
});

async function switchMetrics(input) {
  return input.locator('xpath=ancestor::span[contains(@class,"MuiSwitch-root")][1]').evaluate((root) => {
    const track = root.querySelector('.MuiSwitch-track');
    const thumb = root.querySelector('.MuiSwitch-thumb');
    const base = root.querySelector('.MuiSwitch-switchBase');
    if (!track || !thumb || !base) throw new Error('Switch track, thumb, and base are required');
    const rect = (element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    };
    const a = track.getBoundingClientRect();
    const b = thumb.getBoundingClientRect();
    return { track: rect(track), thumb: rect(thumb), vertical: { top: b.top - a.top, bottom: a.bottom - b.bottom },
      horizontal: { left: b.left - a.left, right: a.right - b.right }, trackColor: getComputedStyle(track).backgroundColor,
      trackBorder: getComputedStyle(track).borderWidth, baseBackground: getComputedStyle(base).backgroundColor };
  });
}

for (const width of [320, 390, 768, 1440]) {
  await scenario(`responsive-profile-switches-${width}`, async (page, artifacts) => {
    await page.setViewportSize({ width, height: 982 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, artifacts);
    await login(page);
    const group = page.getByRole('group', { name: 'Local portal style', exact: true });
    const groupBox = await group.boundingBox();
    assert.ok(groupBox && groupBox.x >= 0 && groupBox.x + groupBox.width <= width, 'Local generation control must fit in the viewport');
    const metrics = [];
    for (const mode of ['light', 'dark']) {
      await page.getByRole('checkbox', { name: 'Theme Switch', exact: true }).setChecked(mode === 'light');
      await page.getByRole('button', { name: 'User Profiles', exact: true }).click();
      const menu = page.getByTestId('portal-prototype-avatar-menu');
      await expect(menu).toBeVisible();
      const menuBox = await menu.boundingBox();
      assert.ok(menuBox && menuBox.x >= 0 && menuBox.x + menuBox.width <= width, 'Profile menu must fit within the viewport');
      assert.ok(menuBox.width <= 321, 'Profile dropdown must retain compact width');
      await expect(menu.getByText('Click to view user profile', { exact: true })).toHaveCSS('font-size', '12px');
      await expect(menu.getByRole('menuitem', { name: 'Logout', exact: true })).toHaveCSS('font-size', '14px');
      await menu.getByRole('menuitem').first().click();
      const dialog = page.getByRole('dialog', { name: 'User Profile', exact: true });
      await expect(dialog).toBeVisible();
      const profileBox = await dialog.boundingBox();
      assert.ok(profileBox && profileBox.x >= 0 && profileBox.y >= 0 && profileBox.x + profileBox.width <= width && profileBox.y + profileBox.height <= 983, 'Profile panel must be contained in the viewport');
      const banner = page.getByTestId('prototype-profile-banner');
      const bannerBox = await banner.boundingBox();
      const artwork = banner.locator('img');
      const artBox = await artwork.boundingBox();
      assert.ok(bannerBox && artBox);
      for (const dimension of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(bannerBox[dimension] - artBox[dimension]) <= 1, 'Profile artwork must fill its banner');
      await expect(artwork).toHaveCSS('object-fit', 'cover');
      await expect.poll(() => artwork.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
      await expect(dialog.locator('.MuiDialogContent-root')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(page.getByTestId('prototype-profile-identity')).toHaveCSS('background-color', mode === 'light' ? 'rgb(255, 255, 255)' : 'rgb(26, 26, 26)');
      const portrait = dialog.locator('.MuiAvatar-root');
      assert.equal(await portrait.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const hit = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + 12);
        return !!hit && element.contains(hit);
      }), true, 'The upper portrait must remain visible above the banner/content boundary');
      await expect(dialog.getByRole('heading', { name: 'User Profile', exact: true })).toHaveCSS('font-size', '14px');
      await page.screenshot({ path: path.join(output, `profile-${mode}-${width}.png`), animations: 'disabled' });
      await dialog.getByRole('button', { name: 'Close User Profile', exact: true }).click();
      await expect(dialog).toBeHidden();
      for (const name of ['Theme Switch', 'Time Switch']) {
        if (name === 'Time Switch') {
          await page.getByRole('checkbox', { name: 'Theme Switch', exact: true }).setChecked(mode === 'light');
        }
        const input = page.getByRole('checkbox', { name, exact: true });
        await input.uncheck();
        await page.mouse.move(0, 0);
        await page.waitForTimeout(250);
        const before = await switchMetrics(input);
        assert.ok(Math.abs(before.vertical.top - before.vertical.bottom) <= 0.5, `${name}: thumb must be vertically centered`);
        assert.ok(before.vertical.top >= 0 && before.horizontal.left >= 0 && before.horizontal.right >= 0, `${name}: thumb must stay within the track`);
        const root = input.locator('xpath=ancestor::span[contains(@class,"MuiSwitch-root")][1]');
        await root.hover();
        const frames = await root.evaluate(async (element) => {
          const track = element.querySelector('.MuiSwitch-track');
          if (!track) throw new Error('Missing switch track');
          const values = [];
          for (let i = 0; i < 12; i++) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
            const style = getComputedStyle(track);
            values.push({ background: style.backgroundColor, border: style.borderWidth });
          }
          return values;
        });
        const hovered = await switchMetrics(input);
        assert.deepEqual(hovered, before, `${name}: hover must preserve geometry and background`);
        for (const frame of frames) assert.deepEqual(frame, { background: before.trackColor, border: before.trackBorder }, `${name}: hover frames must not flicker`);
        metrics.push({ mode, name, before, frames });
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'The shell must not overflow horizontally');
    }
    return { width, metrics };
  });
}

for (const newStyles of [true, false]) {
  await scenario(`production-systemjs-${newStyles ? 'webkit' : 'legacy'}`, async (page, artifacts) => {
    const mounted = await open(page, artifacts, 'production', newStyles);
    await expect(page.getByRole('group', { name: 'Local portal style', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Styling console', exact: true })).toHaveCount(0);
    await login(page, 'light');
    await expect(page.getByRole('group', { name: 'Local portal style', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Styling console', exact: true })).toHaveCount(0);
    if (newStyles) {
      await expect(page.getByTestId('portal-prototype-empty')).toBeVisible();
      await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
      await page.getByRole('button', { name: 'Add Cashflow Blotter', exact: true }).click();
      await expectRemote(page, 'webkit', 'light');
    }
    await page.screenshot({ path: path.join(output, `production-${newStyles ? 'webkit' : 'legacy'}.png`), fullPage: true });
    return { mounted, localControls: 'absent' };
  });
}
await browser.close();
console.info(`Browser evidence: ${path.join(output, 'report.json')}`);
if (report.failures.length) process.exitCode = 1;
