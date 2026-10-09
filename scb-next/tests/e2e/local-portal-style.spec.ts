import type { Page } from '@playwright/test';
import { expect, test } from './base-ui-parity.fixture';

const initialRoute =
  '/?show_normal_login=Y&survey=no&new-styles=true&new-layout=true&login-theme=dark#local-style-check';
const styleStorageKey = 'portal.dev.style-preview.v1';

async function savedPortalState(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      ['SET_TOKEN', 'SET_USER', 'SET_THEME', 'theme', 'SET_TIME_TYPE', 'SET_WORKSPACES'].map(
        (key) => [key, localStorage.getItem(key)],
      ),
    ),
  );
}

async function expectGeneration(page: Page, generation: 'legacy' | 'webkit') {
  const group = page.getByRole('group', { name: 'Local portal style', exact: true });
  await expect(group).toBeVisible();
  await expect(
    group.getByRole('button', {
      name: `Use ${generation === 'webkit' ? 'WebKit' : 'Legacy'} portal style`,
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  if (generation === 'webkit') {
    await expect(page.locator('html')).toHaveAttribute('data-generation', 'webkit');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
  } else {
    await expect(page.locator('html')).toHaveClass('dark');
    await expect(page.locator('html')).not.toHaveAttribute('data-generation');
  }
}

async function expectRemoteGeneration(page: Page, generation: 'legacy' | 'webkit') {
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toBeVisible({ timeout: 20_000 });
  const roots = page.locator('.ratan-design-root:not(html)').filter({
    hasNot: page.getByRole('button', { name: 'Styling console', exact: true }),
  });
  await expect.poll(() => roots.count()).toBeGreaterThanOrEqual(2);
  expect(
    await roots.evaluateAll(
      (elements, selected) =>
        elements.every(
          (element) =>
            element.getAttribute('data-generation') === selected &&
            element.getAttribute('data-mode') === 'dark',
        ),
      generation,
    ),
  ).toBe(true);
}

async function switchGeneration(page: Page, generation: 'legacy' | 'webkit') {
  await page
    .getByRole('group', { name: 'Local portal style', exact: true })
    .getByRole('button', {
      name: `Use ${generation === 'webkit' ? 'WebKit' : 'Legacy'} portal style`,
      exact: true,
    })
    .click();
  await page.waitForURL(
    (url) => url.searchParams.get('new-styles') === String(generation === 'webkit'),
  );
  await expectGeneration(page, generation);
  const url = new URL(page.url());
  expect(url.searchParams.has('new-layout')).toBe(false);
  expect(url.searchParams.get('show_normal_login')).toBe('Y');
  expect(url.searchParams.get('survey')).toBe('no');
  expect(url.searchParams.get('login-theme')).toBe('dark');
  expect(url.hash).toBe('#local-style-check');
}

test('local portal style switches login, shell and remotes without changing saved portal state', async ({
  page,
}, testInfo) => {
  test.skip(!!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'Uses development login and tile fixtures');
  test.setTimeout(90_000);
  const runtimeErrors: string[] = [];
  const preferenceWrites: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/preference') && !['GET', 'HEAD'].includes(request.method())) {
      preferenceWrites.push(request.url());
    }
  });

  await page.goto(initialRoute);
  await expectGeneration(page, 'webkit');
  await switchGeneration(page, 'legacy');
  await expect(page.getByPlaceholder('Enter Username', { exact: true })).toBeVisible();
  await switchGeneration(page, 'webkit');
  await page.getByLabel('Username', { exact: true }).fill('mock.cashflow');
  await page.getByLabel('Password', { exact: true }).fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('button', { name: 'Open new tile', exact: true }).click();
  await page.getByRole('button', { name: 'Add Cashflow Blotter', exact: true }).click();
  await expectRemoteGeneration(page, 'webkit');
  await page.getByRole('button', { name: 'Add Workspace', exact: true }).click();
  await expect(page.getByRole('tab')).toHaveCount(2);
  await expect(page.getByRole('tab').last()).toHaveAttribute('aria-selected', 'true');

  await page.getByRole('button', { name: 'Styling console', exact: true }).click();
  await page.getByLabel('Font size (px)', { exact: true }).fill('18');
  await page.getByLabel('Font size (px)', { exact: true }).press('Tab');
  await page.getByRole('checkbox', { name: 'Apply to Portal', exact: true }).check();
  await page.getByRole('button', { name: 'Close styling console', exact: true }).click();
  const savedBefore = await savedPortalState(page);
  expect(savedBefore.SET_TOKEN).toBeTruthy();
  expect(JSON.parse(savedBefore.SET_WORKSPACES ?? '[]')).toHaveLength(2);
  const writesBeforeSwitch = preferenceWrites.length;

  await switchGeneration(page, 'legacy');
  await expect(page.getByRole('tab')).toHaveCount(2);
  await expect(page.getByRole('tab').last()).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toHaveCount(0);
  expect(await savedPortalState(page)).toEqual(savedBefore);
  expect(
    await page.evaluate(
      (key) => JSON.parse(sessionStorage.getItem(key) ?? '{}').settings,
      styleStorageKey,
    ),
  ).toMatchObject({ applyToPortal: false, fontSize: 18, designGeneration: 'legacy' });
  await page.getByRole('tab', { name: 'Cashflow Blotter', exact: true }).click();
  await expectRemoteGeneration(page, 'legacy');

  await switchGeneration(page, 'webkit');
  await expect(page.getByRole('tab')).toHaveCount(2);
  await expect(page.getByRole('tab', { name: 'Cashflow Blotter', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(await savedPortalState(page)).toEqual(savedBefore);
  expect(preferenceWrites).toHaveLength(writesBeforeSwitch);
  await page.getByRole('tab', { name: 'Cashflow Blotter', exact: true }).click();
  await expectRemoteGeneration(page, 'webkit');
  await page.screenshot({
    path: testInfo.outputPath('webkit-portal-local-switch.png'),
    fullPage: true,
  });
  await page
    .getByRole('tab', { name: 'Cashflow Blotter', exact: true })
    .getByRole('button', { name: 'delete', exact: true })
    .click();
  await expect(page.getByText('CF-ACCEPT-001', { exact: true })).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

for (const width of [390, 320]) {
  test(`local portal style remains visible and reachable at ${width}px`, async ({ page }) => {
    test.skip(!!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'Local development control');
    await page.setViewportSize({ width, height: 844 });
    await page.goto(initialRoute);
    const group = page.getByRole('group', { name: 'Local portal style', exact: true });
    await expect(group).toBeVisible();
    const box = await group.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    for (const name of ['Use Legacy portal style', 'Use WebKit portal style']) {
      await group.getByRole('button', { name, exact: true }).click({ trial: true });
    }
    await switchGeneration(page, 'legacy');
    await switchGeneration(page, 'webkit');
  });
}

for (const newStyles of [false, true]) {
  test(`production omits local style controls with new-styles=${newStyles}`, async ({ page }) => {
    test.skip(!process.env.PLAYWRIGHT_PRODUCTION_EDGE, 'Requires a built production preview');
    await page.goto(`/?show_normal_login=Y&survey=no&new-styles=${newStyles}`);
    const username = newStyles
      ? page.getByLabel('Username', { exact: true })
      : page.getByPlaceholder('Enter Username', { exact: true });
    await expect(username).toBeVisible();
    await expect(page.getByRole('group', { name: 'Local portal style', exact: true })).toHaveCount(
      0,
    );
    await expect(page.getByRole('button', { name: 'Styling console', exact: true })).toHaveCount(0);
  });
}
