import { test, expect } from '@playwright/test';
import { captureEvent } from '../util/event-listener.js';

const STORY_URL =
  'iframe.html?globals=&args=&id=components-alert--default&viewMode=story';

test.describe('sc-alert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STORY_URL);
  });

  test('renders and is visible by default', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();
  });

  test('renders title text', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();
    // Default story has a title set via args
    const title = alert.locator('[slot="title"], slot[name="title"]').first();
    await expect(title).toBeVisible();
  });

  test('hides the alert when open is set to false', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();

    await page.evaluate(() => {
      const el = document.querySelector('sc-alert') as any;
      el.open = false;
    });

    // sl-alert with open=false collapses — the inner sl-alert base should be hidden
    await expect(alert.locator('sl-alert')).not.toBeVisible();
  });

  test('shows close icon when closable is true', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();

    await page.evaluate(() => {
      const el = document.querySelector('sc-alert') as any;
      el.closable = true;
    });

    await expect(alert.locator('.close-icon')).toBeVisible();
  });

  test('closes the alert when close icon is clicked', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();

    await page.evaluate(() => {
      const el = document.querySelector('sc-alert') as any;
      el.closable = true;
    });

    await alert.locator('.close-icon').click();

    await expect(alert.locator('sl-alert')).not.toBeVisible();
  });

  test('shows sl-details when title and content are both present (collapsible)', async ({
    page,
  }) => {
    await page.goto(
      'iframe.html?globals=&args=&id=components-alert--collapsible&viewMode=story'
    );

    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();
    await expect(alert.locator('sl-details')).toBeVisible();
  });

  test('renders info type with correct variant', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();

    const variant = await page.evaluate(() => {
      const el = document.querySelector('sc-alert') as any;
      return el.type;
    });
    expect(variant).toBe('info');
  });

  test('changes type to error correctly', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();

    await page.evaluate(() => {
      const el = document.querySelector('sc-alert') as any;
      el.type = 'error';
    });

    const type = await page.evaluate(() => {
      const el = document.querySelector('sc-alert') as any;
      return el.type;
    });
    expect(type).toBe('error');
  });

  test('renders banner mode', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();

    await page.evaluate(() => {
      const el = document.querySelector('sc-alert') as any;
      el.mode = 'banner';
    });

    const mode = await page.evaluate(() => {
      const el = document.querySelector('sc-alert') as any;
      return el.mode;
    });
    expect(mode).toBe('banner');
  });

  test('emits sc-hide event after close icon click', async ({ page }) => {
    const alert = page.locator('sc-alert');
    await expect(alert).toBeVisible();

    await page.evaluate(async () => {
      const el = document.querySelector('sc-alert') as any;
      el.closable = true;
      await el.updateComplete;
    });

    const awaitHide = await captureEvent(alert, 'sc-hide');
    await alert.locator('.close-icon').click();
    expect(await awaitHide()).toBeDefined();
  });
});
