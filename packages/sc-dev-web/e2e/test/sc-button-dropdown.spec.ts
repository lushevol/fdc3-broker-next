import { test, expect } from '@playwright/test';
import { captureEvent } from '../util/event-listener.js';

const DEFAULT_STORY_URL =
  'iframe.html?globals=&args=&id=components-button-button-dropdown--default&viewMode=story';
const SLOT_STORY_URL =
  'iframe.html?globals=&args=&id=components-button-button-dropdown--slot&viewMode=story';

test.describe('sc-button-dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DEFAULT_STORY_URL);
  });

  test('opens dropdown, emits sc-select, and updates button text', async ({ page }) => {
    const dropdown = page.locator('sc-button-dropdown');
    const trigger = dropdown.locator('sc-button');

    // initial state
    await expect(dropdown).toBeVisible();
    await expect(trigger).toBeVisible();
    await expect(trigger).toContainText('Button');

    // register listener before triggering action
    const awaitSelect = await captureEvent<{ value: string }>(dropdown, 'sc-select');

    // open dropdown
    await trigger.click();
    const isOpen = await dropdown.evaluate((el: any) => el._open);
    expect(isOpen).toBe(true);

    // select first item — emits sc-select
    const menuItem = page.locator('sl-menu-item.dropdown-item').first();
    await menuItem.click();
    const detail = await awaitSelect();
    expect(detail).toBeDefined();
    expect(detail.value).toBe('value 1');

    // update-button-text reflects selected value
    await dropdown.evaluate(async (el: any) => {
      el.updateButtonText = true;
      await el.updateComplete;
    });
    await trigger.click();
    await menuItem.click({ force: true });
    const buttonText = await dropdown.evaluate((el: any) => el.buttonText);
    expect(buttonText).toBe('label 1');
  });

  test('disabled state prevents dropdown from opening', async ({ page }) => {
    const dropdown = page.locator('sc-button-dropdown');
    const trigger = dropdown.locator('sc-button');
    await expect(trigger).toBeVisible();

    await dropdown.evaluate(async (el: any) => {
      el.disabled = true;
      await el.updateComplete;
    });

    await trigger.click({ force: true });

    const isOpen = await dropdown.evaluate((el: any) => el._open);
    expect(isOpen).toBe(false);
  });

  test('loading spinner and left-icon render when set', async ({ page }) => {
    const dropdown = page.locator('sc-button-dropdown');
    const trigger = dropdown.locator('sc-button');
    await expect(trigger).toBeVisible();

    // loading shows spinner
    await dropdown.evaluate(async (el: any) => {
      el.loading = true;
      await el.updateComplete;
    });
    await expect(trigger.locator('sc-spinner')).toBeVisible();

    // left-icon renders when set
    await dropdown.evaluate(async (el: any) => {
      el.loading = false;
      el.leftIcon = 'upload';
      await el.updateComplete;
    });
    await expect(trigger.locator('sc-icon.sc-button-icon-left')).toBeVisible();
  });
});

test.describe('sc-button-dropdown — slot story', () => {
  test('renders slot options', async ({ page }) => {
    await page.goto(SLOT_STORY_URL);
    const dropdown = page.locator('sc-button-dropdown');
    const trigger = dropdown.locator('sc-button');
    await expect(trigger).toBeVisible();

    await trigger.click();

    await expect(page.locator('sl-menu-item.dropdown-item').first()).toBeVisible();
  });
});
