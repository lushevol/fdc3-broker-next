import { expect, test } from './portal-prototype.fixture';

test('login preserves Enter submission, credential normalization and pending-request feedback', async ({
  page,
  portal,
}) => {
  await page.setViewportSize({ width: 1512, height: 982 });
  await portal.open('login', 'light');
  let requests = 0;
  let credentials: unknown;
  let complete!: () => void;
  const pending = new Promise<void>((resolve) => {
    complete = resolve;
  });
  await page.route(/\/api\/auth\/v2\/sso\/login(?:\?.*)?$/, async (route) => {
    requests += 1;
    credentials = route.request().postDataJSON();
    await pending;
    await route.fulfill({ status: 500, json: { message: 'Fixture login failure' } });
  });
  await page.getByLabel('Username', { exact: true }).fill(' portal.user ');
  await page.getByLabel('Password', { exact: true }).fill(' secret ');
  await page.getByLabel('Password', { exact: true }).press('Enter');
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeDisabled();
  await page.getByLabel('Password', { exact: true }).press('Enter');
  expect(requests).toBe(1);
  expect(credentials).toMatchObject({ username: 'portal.user', password: ' secret ' });
  complete();
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeEnabled();
  await expect(page.getByText('Login failed, please try again.', { exact: true })).toBeVisible();
});

const viewports = [
  { name: 'native', width: 1512, height: 982 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'short-desktop', width: 1280, height: 720 },
];

for (const theme of ['light', 'dark'] as const) {
  for (const viewport of viewports) {
    test(`${theme} ${viewport.name} login and empty workspace remain usable with reduced motion`, async ({
      page,
      portal,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
      await portal.open('login', theme);
      const login = page.getByTestId('portal-prototype-login');
      await expect(login).toBeVisible();
      await expect(page.getByRole('img', { name: 'Markets Operations One logo' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toHaveCSS(
        'transition-duration',
        '0s',
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
      const fields = await login.locator('.login-field').evaluateAll((elements) =>
        elements.map((element) => {
          const bounds = element.getBoundingClientRect();
          return { left: bounds.left, right: bounds.right };
        }),
      );
      for (const field of fields) {
        expect(field.left).toBeGreaterThanOrEqual(0);
        expect(field.right).toBeLessThanOrEqual(viewport.width);
      }
      const loginScreenshot = testInfo.outputPath('login.png');
      await page.screenshot({ path: loginScreenshot, fullPage: true, animations: 'disabled' });
      await testInfo.attach('login.png', { path: loginScreenshot, contentType: 'image/png' });
      await portal.open('empty', theme);
      const empty = page.locator('[data-testid="portal-prototype-empty"]:visible');
      await expect(empty).toBeVisible();
      await expect(empty.getByRole('heading')).toHaveCSS('font-size', '20px');
      await expect(empty.getByRole('heading')).toHaveCSS('line-height', '26px');
      await expect(empty.locator('p')).toHaveCSS('font-size', '14px');
      await expect(empty.locator('p')).toHaveCSS('line-height', '20px');
      const find = empty.getByRole('button', { name: 'Find Tile', exact: true });
      await expect(find).toHaveCSS('font-size', '14px');
      await expect(find).toHaveCSS('line-height', '20px');
      await expect(find).toHaveCSS('height', '48px');
      await find.scrollIntoViewIfNeeded();
      await expect(find).toBeInViewport();
      await expect(find).toHaveCSS('transition-duration', '0s');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
      const emptyScreenshot = testInfo.outputPath('empty.png');
      await page.screenshot({ path: emptyScreenshot, animations: 'disabled' });
      await testInfo.attach('empty.png', { path: emptyScreenshot, contentType: 'image/png' });
      const analytics = page.waitForRequest(
        (request) =>
          request.url().includes('/analytics/v1/fmo/print') &&
          request.postDataJSON()?.name === 'find tile',
      );
      await find.click();
      const request = await analytics;
      expect(request.postDataJSON()).toMatchObject({
        key: 'button',
        event: 'click',
        name: 'find tile',
        value: 'true',
        container: 'Base',
        tile: 'home',
      });
      await expect(page.locator('.MuiDrawer-paper')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('.MuiDrawer-paper')).toBeHidden();
    });
  }
}
