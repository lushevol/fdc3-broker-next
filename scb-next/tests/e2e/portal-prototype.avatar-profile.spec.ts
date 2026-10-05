import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, test } from './portal-prototype.fixture';
import {
  expandedSubject,
  prototypeReferences,
  referenceViewport,
} from '../fixtures/portal-prototype';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });
test.setTimeout(60_000);

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} avatar keyboard, outside close, versions and logout confirmation`, async ({
    page,
    portal,
  }) => {
    await page.setViewportSize(referenceViewport);
    await portal.open('avatar', theme);
    const avatar = page.getByRole('button', { name: 'User Profiles', exact: true });
    const menu = page.getByTestId('portal-prototype-avatar-menu');
    await expect(menu).toHaveCSS('width', '548px');
    await expect(menu).toHaveCSS('height', '232px');
    await expect(menu).toHaveCSS('border-radius', '6px');
    await expect(menu.getByText('Root Config Version:', { exact: false })).toBeVisible();
    await expect(menu.getByText('Base Container Version:', { exact: false })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(avatar).toBeFocused();
    await avatar.press('Enter');
    await expect(menu).toBeVisible();
    await page.mouse.click(500, 400);
    await expect(menu).toBeHidden();
    await expect(avatar).toBeFocused();
    await avatar.click();
    await page.getByRole('menuitem', { name: 'Logout', exact: true }).click();
    await expect(page.getByRole('dialog').filter({ hasText: /logout/i })).toBeVisible();
  });

  test(`${theme} profile nested entitlements scroll under stable identity and restore focus`, async ({
    page,
    portal,
  }) => {
    await page.setViewportSize(referenceViewport);
    await portal.open('profile', theme);
    const dialog = page.getByRole('dialog', { name: 'User Profile' });
    await expect(dialog).toHaveCSS('width', '800px');
    await expect(dialog).toHaveCSS('height', '552px');
    await expect(dialog.getByText('Functional User Profile', { exact: true })).toHaveCSS(
      'font-size',
      '16px',
    );
    const role = dialog.getByRole('button', {
      name: 'RATAN::X_RATANONE::FMO_COO_SUP',
      exact: true,
    });
    expect((await role.boundingBox())?.height).toBe(48);
    const identity = page.getByTestId('prototype-profile-identity');
    const hierarchy = page.getByRole('region', { name: 'Profile entitlements' });
    await role.click();
    await expect(dialog).toHaveCSS('height', '800px');
    const top = await identity.boundingBox();
    await dialog.getByRole('button', { name: expandedSubject, exact: true }).click();
    await expect(dialog.getByText('F_Export_Data', { exact: true })).toBeVisible();
    await hierarchy.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    expect(await identity.boundingBox()).toEqual(top);
    await expect(dialog.getByRole('button', { name: 'Close User Profile' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'User Profiles', exact: true })).toBeFocused();
  });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 520 },
  ]) {
    test(`${theme} ${viewport.width}x${viewport.height} long identity and data entitlements remain reachable`, async ({
      page,
      portal,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await portal.open('profile', theme, true);
      const dialog = page.getByRole('dialog', { name: 'User Profile' });
      const bounds = await dialog.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
      await expect(dialog.getByText('Entitlement User Profile', { exact: true })).toBeVisible();
      await dialog.getByRole('button', { name: /RATAN::RATAN_DATA_ENTITLEMENT/ }).click();
      await dialog
        .getByRole('button', { name: 'LONG_CROSS_BORDER_ENTITLEMENT_SUBJECT_NAME' })
        .click();
      const action = dialog.getByText('F_View_Regional_Settlement_Data', { exact: true });
      await action.scrollIntoViewIfNeeded();
      await expect(action).toBeInViewport();
      const hierarchy = page.getByRole('region', { name: 'Profile entitlements' });
      expect(
        await hierarchy.evaluate((element) => element.scrollWidth <= element.clientWidth),
      ).toBe(true);
      const responsivePath = testInfo.outputPath('profile-responsive.png');
      await page.screenshot({ path: responsivePath });
      await testInfo.attach('profile-responsive.png', {
        path: responsivePath,
        contentType: 'image/png',
      });
      await dialog.getByRole('button', { name: 'Close User Profile' }).click();
      await expect(dialog).toBeHidden();
      await portal.open('avatar', theme, true);
      const menu = page.getByTestId('portal-prototype-avatar-menu');
      const menuBounds = await menu.boundingBox();
      expect(menuBounds!.x).toBeGreaterThanOrEqual(0);
      expect(menuBounds!.x + menuBounds!.width).toBeLessThanOrEqual(viewport.width);
      expect(await menu.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
        true,
      );
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
    });
  }
}

for (const reference of prototypeReferences.filter(
  (item) => item.owner === 'Avatar' || item.owner === 'Profile',
)) {
  test(`Frame ${reference.frame} ${reference.theme} ${reference.state} supplied-reference evidence`, async ({
    page,
    portal,
  }, testInfo) => {
    await page.setViewportSize(referenceViewport);
    await portal.open(reference.state, reference.theme);
    const sourcePath = fileURLToPath(
      new URL(
        `../../web/mfe-base-origin/docs/new-styles-prototypes/${reference.file}`,
        import.meta.url,
      ),
    );
    await testInfo.attach('supplied-prototype.png', { path: sourcePath, contentType: 'image/png' });
    const fullPath = testInfo.outputPath('current-prototype.png');
    const regionPath = testInfo.outputPath('current-base-region.png');
    const manifestPath = testInfo.outputPath('reference-manifest.json');
    await page.screenshot({ path: fullPath, animations: 'disabled' });
    await page.screenshot({ path: regionPath, clip: reference.region, animations: 'disabled' });
    await writeFile(manifestPath, JSON.stringify(reference, null, 2));
    await testInfo.attach('current-prototype.png', { path: fullPath, contentType: 'image/png' });
    await testInfo.attach('current-base-region.png', {
      path: regionPath,
      contentType: 'image/png',
    });
    await testInfo.attach('reference-manifest.json', {
      path: manifestPath,
      contentType: 'application/json',
    });
  });
}
