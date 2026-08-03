import { expect, test, type Page } from '@playwright/test';

const STORY_URL =
  'iframe.html?globals=&args=&id=components-scrollbar--scrollable-selector&viewMode=story';

async function gotoStory(page: Page) {
  await page.goto(STORY_URL, { waitUntil: 'networkidle' });

  const scrollbar = page.locator('sc-scrollbar');
  await scrollbar.waitFor({ state: 'attached', timeout: 4_000 });

  await page.evaluate(async () => {
    const el = document.querySelector('sc-scrollbar') as any;
    if (el?.updateComplete) await el.updateComplete;
  });

  await expect(page.locator('#scrollable')).toHaveClass(/-sc-scroll-target/);
  await expect(scrollbar.locator('[part="y"]')).toHaveClass(/has-y/);
  await expect(scrollbar.locator('[part="x"]')).toHaveClass(/has-x/);
}

test.describe('sc-scrollbar', () => {
  test.beforeEach(async ({ page }) => {
    await gotoStory(page);
  });

  test('attaches to the slotted scrollable child and exposes both tracks', async ({ page }) => {
    const scrollbar = page.locator('sc-scrollbar');

    await expect(scrollbar.locator('[part="container"]')).not.toHaveClass(/hide/);
    await expect(page.locator('#scrollable')).toContainText('ScScrollbar is a decorator component');
  });

  test('keeps the internal scroller synced with the target scroll position', async ({ page }) => {
    const scrollbar = page.locator('sc-scrollbar');
    const target = page.locator('#scrollable');
    const yScroller = scrollbar.locator('[part="y"] .scroller');

    const scrollToBottom = async () => {
      await target.evaluate(element => {
        const targetElement = element as HTMLElement;
        targetElement.scrollTop = targetElement.scrollHeight;
        targetElement.dispatchEvent(new Event('scroll', { bubbles: true }));
      });
    };

    await scrollToBottom();

    await expect
      .poll(async () => yScroller.evaluate(element => (element as HTMLElement).scrollTop))
      .toBeGreaterThan(0);

    await target.evaluate(element => {
      const targetElement = element as HTMLElement;
      targetElement.scrollTop = 0;
      targetElement.dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    await expect.poll(async () => yScroller.evaluate(element => (element as HTMLElement).scrollTop)).toBe(0);
  });
});