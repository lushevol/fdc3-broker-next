import { test, expect } from '@playwright/test';

test.describe('FDC3 Demo', () => {
  test('loads page with FDC3 controls', async ({ page }) => {
    await page.goto('http://localhost:8011');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page.locator('h1')).toContainText('FDC3 Demo Application');
    await expect(page.locator('text=Context Selection')).toBeVisible();
    await expect(page.locator('text=Actions')).toBeVisible();
    await expect(page.locator('text=Activity Log')).toBeVisible();
  });

  test('shows initial agent connection', async ({ page }) => {
    await page.goto('http://localhost:8011');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page.locator('.log-entry').first()).toContainText('FDC3');
  });

  test('gets FDC3 info', async ({ page }) => {
    await page.goto('http://localhost:8011');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.click('button:has-text("Get FDC3 Info")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.log-entry').first()).toContainText('FDC3');
  });

  test('can switch context type', async ({ page }) => {
    await page.goto('http://localhost:8011');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.click('button:has-text("Contact (John Doe)")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('button:has-text("Contact (John Doe)")')).toHaveClass(/active/);
  });
});
