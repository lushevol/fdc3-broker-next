import { expect, test } from '@playwright/test';

test('SystemJS imports base, container, and tile without runtime errors', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  await page.goto('http://127.0.0.1:8001/systemjs-smoke.html');

  await expect(page.locator('#status')).toHaveText('ready');
  await expect(page.locator('#status')).toHaveAttribute('data-base-loaded', 'true');
  await expect(page.locator('#status')).toHaveAttribute('data-container-loaded', 'true');
  await expect(page.locator('#status')).toHaveAttribute('data-tile-loaded', 'true');
  expect(errors).toEqual([]);
});
