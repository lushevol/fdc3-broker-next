import { expect, test } from '@playwright/test';

for (const appearance of ['legacy', 'layout-preview', 'prototype'] as const) {
  test(`${appearance} retains document-wide package tokens and fonts`, async ({ page }) => {
    const query = new URLSearchParams({ show_normal_login: 'Y', survey: 'no' });
    if (appearance === 'prototype') query.set('new-styles', 'true');
    if (appearance === 'layout-preview') query.set('new-layout', 'true');
    await page.goto(`/?${query}`);
    await expect(page.getByRole('button', { name: /^(Sign In|Login)$/i })).toBeVisible();
    const root = page.locator('html');
    const tokens = await root.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        font: style.getPropertyValue('--sc-font-family').trim(),
        primary: style.getPropertyValue('--sc-button-primary-background-color').trim(),
      };
    });
    expect(tokens.font).toContain('SC Prosper Sans');
    expect(tokens.primary).not.toBe('');
    if (appearance === 'prototype') {
      await expect(root).toContainClass('ratan-design-root');
      await expect(root).toHaveAttribute('data-generation', 'webkit');
      await expect(root).toHaveAttribute('data-mode', 'light');
    } else {
      await expect(root).not.toContainClass('ratan-design-root');
      await expect(root).not.toHaveAttribute('data-generation');
      await expect(root).not.toHaveAttribute('data-mode');
    }
  });
}
