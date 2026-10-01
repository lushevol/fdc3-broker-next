import { expect, type Page } from '@playwright/test';

export const storybookUrl = process.env.RATAN_DESIGN_STORYBOOK_URL;

export async function settleStory(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const animations = document
      .getAnimations()
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity);
    await Promise.allSettled(animations.map((animation) => animation.finished));
  });
}

export async function openStory(page: Page, id: string, appearance: string) {
  const query = new URLSearchParams({
    id,
    viewMode: 'story',
    // This suite runs axe explicitly after interactions; avoid two concurrent scans.
    globals: `${appearance};a11y.manual:!true`,
  });
  await page.goto(`${storybookUrl}/iframe.html?${query}`);
  await expect(page.locator('#storybook-root > *').first()).toBeAttached();
  await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
  await settleStory(page);
}
