import { test, expect } from '@playwright/test';

const PRIMARY_STORY_URL =
  'iframe.html?globals=&args=&id=components-button-button--primary&viewMode=story';
const SECONDARY_STORY_URL =
  'iframe.html?globals=&args=&id=components-button-button--secondary-button&viewMode=story';
const ERROR_STORY_URL =
  'iframe.html?globals=&args=&id=components-button-button--primary-error-with-icon&viewMode=story';

test.describe('sc-button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRIMARY_STORY_URL, { waitUntil: 'networkidle' });
  });

  test('disabled button reflects attribute and prevents click', async ({ page }) => {
    const button = page.locator('sc-button');
    // initial state
    await expect(button).toBeVisible();
    await expect(button).toContainText('Default');
    // disable and verify
    await page.evaluate(() => {
      const el = document.querySelector('sc-button') as any;
      el.disabled = true;
      el.addEventListener('click', () => {
        (window as any).__buttonClicked = true;
      });
    });

    expect(await page.evaluate(() => (document.querySelector('sc-button') as any).disabled)).toBe(true);

    await button.click({ force: true });
    expect(await page.evaluate(() => (window as any).__buttonClicked)).toBeUndefined();
  });

  test('shows spinner when loading is true', async ({ page }) => {
    const button = page.locator('sc-button');
    await page.evaluate(() => {
      (document.querySelector('sc-button') as any).loading = true;
    });
    await expect(button.locator('sc-spinner')).toBeVisible();
  });

  test('renders left and right icons', async ({ page }) => {
    const button = page.locator('sc-button');
    await page.evaluate(() => {
      const el = document.querySelector('sc-button') as any;
      el.leftIcon = 'upload';
      el.rightIcon = 'arrow-ios-forward';
    });
    await expect(button.locator('sc-icon.sc-button-icon-left')).toBeVisible();
    await expect(button.locator('sc-icon.sc-button-icon-right')).toBeVisible();
  });

  test('selectable=toggle toggles selected on each click and emits click event', async ({ page }) => {
    const button = page.locator('sc-button');
    await page.evaluate(() => {
      (document.querySelector('sc-button') as any).selectable = 'toggle';
      (window as any).__clickFired = false;
      document.querySelector('sc-button')!.addEventListener('click', () => {
        (window as any).__clickFired = true;
      });
    });

    // select + verify click event fires
    await button.click();
    expect(await page.evaluate(() => (document.querySelector('sc-button') as any).selected)).toBe(true);
    expect(await page.evaluate(() => (window as any).__clickFired)).toBe(true);

    // deselect
    await button.click();
    expect(await page.evaluate(() => (document.querySelector('sc-button') as any).selected)).toBe(false);
  });
});

test.describe('sc-button — secondary', () => {
  test('renders visible button with secondary label', async ({ page }) => {
    await page.goto(SECONDARY_STORY_URL, { waitUntil: 'networkidle' });
    const button = page.locator('sc-button');
    await expect(button).toBeVisible();
    await expect(button).toContainText('Secondary');
  });
});

test.describe('sc-button — error', () => {
  test('has error state', async ({ page }) => {
    await page.goto(ERROR_STORY_URL, { waitUntil: 'networkidle' });
    const button = page.locator('sc-button');
    await expect(button).toBeVisible();
    const state = await page.evaluate(() => (document.querySelector('sc-button') as any).state);
    expect(state).toBe('error');
  });
});
