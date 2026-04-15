import { expect, test } from '@playwright/test';

test('streams the weather protocol flow end to end', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Message input').fill('What is the weather in San Francisco yesterday?');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByTestId('reasoning-summary')).toContainText('resolve the date first');
  await expect(page.getByTestId('plan-summary')).toContainText('Resolve the time and location');
  await expect(page.getByTestId('tool-call-datetime.resolve_relative_date')).toContainText(
    'yesterday',
  );
  await expect(page.getByTestId('tool-call-location.resolve')).toContainText('San Francisco');
  await expect(page.getByTestId('tool-call-weather.history')).toContainText('37.7749');
  await expect(page.getByTestId('weather-card')).toContainText('San Francisco, CA');
  await expect(page.getByText(/San Francisco, CA on 2026-04-14:/)).toBeVisible();
});
