import { expect, test } from '@playwright/test';

test.describe('chatbot review regressions', () => {
  test('composer advertises only PDF upload types', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open Assistant' }).click();

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: 'Add Attachment' }).click(),
    ]);
    const accept = await fileChooser.element().evaluate((element) => element.getAttribute('accept'));

    expect(accept).toBe('.pdf,application/pdf');
  });

  test('question answers complete the requested batch only', async ({ page }) => {
    await page.goto('/?reviewRegression=1');
    await expect(page.getByRole('region', { name: 'Chatbot review regression panel' })).toBeVisible();

    await page.getByRole('button', { name: 'Start Question Batches' }).click();
    await expect(page.getByTestId('batch-a-status')).toHaveText('pending');
    await expect(page.getByTestId('batch-b-status')).toHaveText('pending');

    await page.getByRole('button', { name: 'Answer Batch B' }).click();
    await expect(page.getByTestId('batch-a-status')).toHaveText('pending');
    await expect(page.getByTestId('batch-b-status')).toHaveText('answered second');
  });

  test('question answers remain valid after the old callback timeout window', async ({ page }) => {
    test.setTimeout(45_000);

    await page.goto('/?reviewRegression=1');
    await page.getByRole('button', { name: 'Start Slow Question' }).click();
    await expect(page.getByTestId('slow-batch-status')).toHaveText('pending');

    await page.waitForTimeout(31_000);
    await page.getByRole('button', { name: 'Answer Slow Question' }).click();

    await expect(page.getByTestId('slow-batch-status')).toHaveText(
      'answered after-timeout-window',
    );
  });
});
