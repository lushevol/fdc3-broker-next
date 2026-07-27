import { expect, test } from '@playwright/test';

test('mounts the React 18 Cashflow remote into an independent portal root', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill('test');
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 'Open Cashflow' }).click();
  const boundary = page.locator('[data-composition-boundary="independent-react-root"]');
  await expect(boundary).toHaveAttribute('data-mounted', 'true');
  await page.waitForTimeout(100);
  expect(pageErrors).toEqual([]);
  await expect(boundary.getByRole('heading', { name: 'Cashflow blotter' })).toBeVisible();
});
