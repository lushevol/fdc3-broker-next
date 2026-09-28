import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });

const fontsDirectory = fileURLToPath(
  new URL('../../../sc-dev-web/sc-dev-web/dist/assets/fonts/', import.meta.url),
);

async function preparePage(page: Page) {
  await page.clock.setFixedTime(new Date('2099-12-31T00:00:00Z'));
  await page.route(/SCProsperSans-.*\.(woff2?|ttf)$/, (route) =>
    route.fulfill({
      path: join(fontsDirectory, basename(new URL(route.request().url()).pathname)),
    }),
  );
}

async function login(page: Page, generation: 'legacy' | 'webkit', layout: 'old' | 'new') {
  await preparePage(page);
  await page.goto(
    `/?show_normal_login=Y&survey=no&new-styles=${generation === 'webkit'}&new-layout=${layout === 'new'}`,
  );
  await page.getByPlaceholder('Enter Username').fill('mock.cashflow');
  await page.getByPlaceholder('Enter Password').fill('acceptance');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByRole('button', { name: 'User Profiles' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

for (const generation of ['legacy', 'webkit'] as const) {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`${generation} SSO-only Login at ${viewport.name} matches before migration`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await preparePage(page);
      await page.goto(`/?survey=no&new-styles=${generation === 'webkit'}&new-layout=false`);
      const sso = page.getByRole('link', { name: 'Sign In With SSO' });
      await expect(sso).toBeVisible();
      await expect(page.getByPlaceholder('Enter Username')).toHaveCount(0);
      await expect(page.getByPlaceholder('Enter Password')).toHaveCount(0);
      await expect(sso).toHaveAttribute('href', /.+/);
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`sso-${generation}-${viewport.name}.png`, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixels: 0,
      });
    });
  }
}

test('overflowed workspace tabs and rename match before migration', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await login(page, 'webkit', 'old');
  const addWorkspace = page.getByRole('button', { name: 'Add Workspace' });
  for (let index = 0; index < 8; index += 1) await addWorkspace.click();
  await expect(page.getByRole('tab')).toHaveCount(9);
  const selected = page.getByRole('tab', { selected: true });
  await selected.dblclick();
  const name = selected.getByRole('textbox', { name: 'Workspace Name' });
  await expect(name).toBeFocused();
  await name.fill('Long Settlement Operations Workspace');
  await page.keyboard.press('Tab');
  await expect(name).toHaveValue('Long Settlement Operations Workspace');
  await expect(page).toHaveScreenshot('overflowed-workspaces.png', {
    animations: 'disabled',
    fullPage: true,
    maxDiffPixels: 0,
  });
  await selected.getByRole('button', { name: 'delete' }).click();
  await expect(page.getByRole('tab')).toHaveCount(8);
});

for (const [generation, layout] of [
  ['legacy', 'old'],
  ['webkit', 'new'],
] as const) {
  test(`${generation} ${layout} logout survey matches before migration`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, generation, layout);
    await page.getByRole('button', { name: 'User Profiles' }).click();
    await page.getByText('Logout', { exact: true }).click();
    const survey = page.getByRole('dialog', { name: 'Leave Now?' });
    await expect(survey).toBeVisible();
    await expect(survey.getByRole('button', { name: 'Share Feedback & Logout' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(survey).toBeVisible();
    await expect(page).toHaveScreenshot(`survey-${generation}-${layout}.png`, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixels: 0,
    });
    await survey.getByRole('button', { name: 'Cancel' }).click();
    await expect(survey).toHaveCount(0);
  });
}
