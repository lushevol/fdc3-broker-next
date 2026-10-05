import { expect, test } from './portal-prototype.fixture';
import { referenceViewport } from '../fixtures/portal-prototype';

test.use({ deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'Asia/Singapore' });

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} native drawer geometry, artwork, keyboard and close paths`, async ({
    page,
    portal,
  }, testInfo) => {
    await page.setViewportSize(referenceViewport);
    await portal.open('empty', theme);
    const trigger = page.getByRole('button', { name: 'Open new tile', exact: true });
    await portal.openDrawer();
    const drawer = page.getByRole('dialog', { name: 'Tile Option' });
    const bounds = await drawer.boundingBox();
    expect(bounds?.x).toBe(617);
    expect(bounds?.y).toBe(98);
    expect(bounds?.width).toBe(895);
    expect(bounds?.height).toBe(884);
    const cards = drawer.getByTestId('portal-prototype-tile');
    await expect(cards).toHaveCount(8);
    const first = await cards.first().boundingBox();
    expect(first?.y).toBe(230);
    expect(first?.height).toBe(125);
    expect(first?.width).toBeCloseTo(192.5, 0);
    const settlement = drawer.getByRole('region', { name: 'Settlement' });
    const settlementCards = settlement.getByTestId('portal-prototype-tile');
    const row = await Promise.all(
      [0, 1, 2, 3].map((index) => settlementCards.nth(index).boundingBox()),
    );
    expect(row[0]?.y).toBe(419);
    expect(
      (
        await drawer
          .getByRole('region', { name: 'Exception Management' })
          .getByTestId('portal-prototype-tile')
          .first()
          .boundingBox()
      )?.y,
    ).toBe(749);
    expect(row[0]?.y).toBe(row[1]?.y);
    expect(row[1]?.y).toBe(row[2]?.y);
    expect(row[3]?.y).toBe(row[0]?.y);
    expect((await settlementCards.nth(4).boundingBox())?.y).toBe(560);
    expect(
      await drawer
        .getByTestId('portal-prototype-tile-art')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
          ),
        ),
    ).toBe(true);
    await expect(drawer.getByRole('button', { name: /for Global|for Indonesia/ })).toHaveCount(0);
    const close = drawer.getByRole('button', { name: 'Close tile options', exact: true });
    await page.screenshot({
      path: testInfo.outputPath(`drawer-${theme}-native.png`),
      animations: 'disabled',
    });
    await testInfo.attach(`drawer-${theme}-native.png`, {
      path: testInfo.outputPath(`drawer-${theme}-native.png`),
      contentType: 'image/png',
    });
    await expect(close).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(
      drawer.getByRole('button', { name: 'Add Settlement Exceptions', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(drawer).toBeVisible();
    await close.click();
    await expect(drawer).toBeHidden();
    await trigger.click();
    await expect(drawer).toBeVisible();
    await trigger.click();
    await expect(drawer).toBeHidden();
    await trigger.click();
    await expect(drawer).toBeVisible();
    await page
      .getByTestId('portal-prototype-drawer-backdrop')
      .click({ position: { x: 10, y: 10 } });
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  for (const viewport of [
    { width: 390, height: 844, columns: 1 },
    { width: 768, height: 1024, columns: 2 },
    { width: 1280, height: 600, columns: 4 },
  ]) {
    test(`${theme} ${viewport.width}px drawer stays within the shell and scrolls with reduced motion`, async ({
      page,
      portal,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await portal.open('drawer', theme, true);
      const drawer = page.getByRole('dialog', { name: 'Tile Option' });
      const shell = await page.locator('.portal-shell-header').boundingBox();
      const bounds = await drawer.boundingBox();
      expect(bounds?.y).toBe((shell?.height ?? 0) + 4);
      expect(bounds?.x).toBeGreaterThanOrEqual(0);
      expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(viewport.width);
      expect((bounds?.y ?? 0) + (bounds?.height ?? 0)).toBe(viewport.height);
      await expect(drawer).toHaveCSS('transition-duration', '0s');
      const grid = drawer.getByRole('region', { name: 'Settlement' }).locator('.tile-grid');
      expect(
        (await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns)).split(
          ' ',
        ),
      ).toHaveLength(viewport.columns);
      const body = drawer.locator('main');
      expect(await body.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(
        true,
      );
      const last = drawer.getByRole('button', { name: 'Add Settlement Exceptions', exact: true });
      await last.focus();
      await expect(last).toBeInViewport();
      await page.keyboard.press('Tab');
      await expect(
        drawer.getByRole('button', { name: 'Close tile options', exact: true }),
      ).toBeFocused();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
      await testInfo.attach(`drawer-${theme}-${viewport.width}.png`, {
        body: await page.screenshot({
          path: testInfo.outputPath(`drawer-${theme}-${viewport.width}.png`),
          animations: 'disabled',
        }),
        contentType: 'image/png',
      });
    });
  }
}
