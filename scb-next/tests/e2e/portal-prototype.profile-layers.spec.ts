import { expect, test } from './portal-prototype.fixture';

for (const mode of ['light', 'dark'] as const) {
  for (const viewport of [
    { width: 1512, height: 982 },
    { width: 390, height: 844 },
    { width: 1280, height: 520 },
  ]) {
    test(`${mode} ${viewport.width}x${viewport.height} profile contains artwork and the portrait overlap`, async ({
      page,
      portal,
    }) => {
      await page.setViewportSize(viewport);
      await portal.open('profile', mode);
      const dialog = page.getByRole('dialog', { name: 'User Profile' });
      const portrait = dialog.locator('.MuiAvatar-root');
      expect(
        await portrait.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const upper = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + 12);
          return upper !== null && element.contains(upper);
        }),
      ).toBe(true);
      const banner = page.getByTestId('prototype-profile-banner');
      const artwork = banner.locator('img');
      await expect(artwork).toHaveCount(1);
      expect(await artwork.boundingBox()).toEqual(await banner.boundingBox());
      await expect(artwork).toHaveCSS('object-fit', 'cover');
      await expect(artwork).toHaveJSProperty('complete', true);
      expect(
        await artwork.evaluate((element: HTMLImageElement) => element.naturalWidth),
      ).toBeGreaterThan(0);
      const content = dialog.locator('.MuiDialogContent-root');
      await expect(content).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(content).toHaveCSS('background-image', 'none');
      const identity = page.getByTestId('prototype-profile-identity');
      await expect(identity).toHaveCSS(
        'background-color',
        mode === 'light' ? 'rgb(255, 255, 255)' : 'rgb(26, 26, 26)',
      );
      const title = dialog.getByRole('heading', { name: 'User Profile', exact: true });
      expect(
        await title.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return element.contains(document.elementFromPoint(bounds.x + 32, bounds.y + 28));
        }),
      ).toBe(true);
      await page.screenshot({
        path: test.info().outputPath('profile-layers.png'),
        animations: 'disabled',
      });
    });
  }

  test(`${mode} short profile keeps the complete banner above scrolled content`, async ({
    page,
    portal,
  }) => {
    await page.setViewportSize({ width: 1280, height: 520 });
    await portal.open('profile-actions', mode);
    const dialog = page.getByRole('dialog', { name: 'User Profile' });
    const banner = page.getByTestId('prototype-profile-banner');
    const bounds = await banner.boundingBox();
    const content = dialog.locator('.MuiDialogContent-root');
    await content.evaluate((element) => {
      element.scrollTop = 100;
    });
    expect(await content.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    expect(await banner.boundingBox()).toEqual(bounds);
    await expect
      .poll(() =>
        banner.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const lower = document.elementFromPoint(bounds.right - 32, bounds.bottom - 12);
          return lower !== null && element.contains(lower);
        }),
      )
      .toBe(true);
    await expect
      .poll(() =>
        banner.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const portrait = document.querySelector(
            '[data-testid="prototype-profile-identity"] .MuiAvatar-root',
          )!;
          const portraitBounds = portrait.getBoundingClientRect();
          const left = document.elementFromPoint(
            portraitBounds.x + portraitBounds.width / 2,
            bounds.y + 60,
          );
          return left !== null && element.contains(left);
        }),
      )
      .toBe(true);
    await page.screenshot({
      path: test.info().outputPath('profile-banner-scrolled.png'),
      animations: 'disabled',
    });
    await content.evaluate((element) => {
      element.scrollTop = 0;
    });
    await expect
      .poll(() =>
        dialog.locator('.MuiAvatar-root').evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const upper = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + 12);
          return upper !== null && element.contains(upper);
        }),
      )
      .toBe(true);
    await dialog.getByRole('button', { name: 'Close User Profile' }).click();
    await expect(dialog).toBeHidden();
  });
}
