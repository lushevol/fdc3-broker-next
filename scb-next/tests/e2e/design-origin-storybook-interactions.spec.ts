import { expect, test } from '@playwright/test';
import { expectNoActionableAxeViolations } from './accessibility';

import { openStory, settleStory, storybookUrl } from './storybook-helpers';

test.skip(!storybookUrl, 'Requires the built ratan-design-origin Storybook');

for (const generation of ['legacy', 'webkit']) {
  for (const mode of ['light', 'dark']) {
    test.describe(`${generation}/${mode}`, () => {
      const appearance = `mode:${mode};designGeneration:${generation}`;
      test('form validation, submission and reset', async ({ page }) => {
        await openStory(
          page,
          'components-fields--controlled-form-validation-and-reset',
          appearance,
        );
        await page.getByRole('button', { name: 'Submit values' }).click();
        await expect(page.getByRole('textbox', { name: 'Item name' })).toHaveAttribute(
          'aria-invalid',
          'true',
        );
        await page.getByRole('textbox', { name: 'Item name' }).fill('Example');
        await page.getByRole('combobox', { name: 'Item category' }).click();
        await page.getByRole('option').nth(1).click();
        await page.getByRole('button', { name: 'Submit values' }).click();
        await expect(page.getByRole('status')).toContainText('Submitted: Example');
        await page.getByRole('button', { name: 'Reset values' }).click();
        await expect(page.getByRole('textbox', { name: 'Item name' })).toHaveValue('');
        await expectNoActionableAxeViolations(page, 'form after reset');
      });
      test('builder retains inactive panel drafts and reports apply', async ({ page }) => {
        await openStory(page, 'search-builder-scenarios--table', appearance);
        await page.getByRole('button', { name: 'Table', exact: true }).click();
        await page.getByRole('tab', { name: 'Order', exact: true }).click();
        await page.getByRole('textbox', { name: 'Order note' }).fill('Keep this draft');
        await page.getByRole('tab', { name: 'Columns', exact: true }).click();
        await expect(page.getByRole('textbox', { name: 'Order note' })).toBeHidden();
        await page.getByRole('tab', { name: 'Order', exact: true }).click();
        await expect(page.getByRole('textbox', { name: 'Order note' })).toHaveValue(
          'Keep this draft',
        );
        await expectNoActionableAxeViolations(page, 'opened builder');
        await page.getByRole('button', { name: 'Apply', exact: true }).click();
        await expect(page.getByRole('status')).toContainText('Last action: apply');
        await expect(page.getByRole('button', { name: 'Table', exact: true })).toBeFocused();
      });
      test('dialog keyboard dismissal returns focus and save validates', async ({ page }) => {
        await openStory(page, 'feedback-dialog-scenarios--playground', appearance);
        const trigger = page.getByRole('button', { name: 'Open dialog' });
        await trigger.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(trigger).toBeFocused();
        await expect(page.getByRole('status')).toContainText('escapeKeyDown');
        await openStory(page, 'feedback-dialog-scenarios--validation-and-saving', appearance);
        await page.getByRole('button', { name: 'Edit saved view' }).click();
        await page.getByRole('textbox', { name: 'View name' }).fill('');
        await page.getByRole('button', { name: 'Save', exact: true }).click();
        await expect(page.getByRole('textbox', { name: 'View name' })).toHaveAttribute(
          'aria-invalid',
          'true',
        );
        await page.getByRole('textbox', { name: 'View name' }).fill('My example');
        await page.getByRole('button', { name: 'Save', exact: true }).click();
        await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.getByRole('button', { name: 'Complete save' }).click();
        await expect(page.getByRole('status')).toHaveText('Saved: My example');
      });
      test('notification undo and progress completion', async ({ page }) => {
        await openStory(
          page,
          'feedback-notification-and-progress-scenarios--error-with-undo',
          appearance,
        );
        await page.getByRole('button', { name: 'Show notification' }).click();
        await expect(page.getByRole('alert')).toContainText('could not be applied');
        await page.getByRole('button', { name: 'Undo' }).click();
        await expect(page.getByRole('alert')).toBeHidden();
        await expect(page.getByRole('status')).toHaveText('Last event: undo');
        await openStory(
          page,
          'feedback-notification-and-progress-scenarios--spinner-progress',
          appearance,
        );
        for (let i = 0; i < 3; i += 1)
          await page.getByRole('button', { name: 'Advance progress' }).click();
        await expect(page.getByRole('progressbar', { name: 'Import progress' })).toHaveAttribute(
          'aria-valuenow',
          '100',
        );
        await expect(page.getByRole('button', { name: 'Advance progress' })).toBeDisabled();
      });
      test('empty/error recovery and loading overlay releases input', async ({ page }) => {
        await openStory(page, 'feedback-state-scenarios--empty-search-recovery', appearance);
        await page.getByRole('button', { name: 'Clear filters' }).click();
        await expect(page.getByRole('status')).toHaveText('3 results');
        await openStory(page, 'feedback-state-scenarios--error-retry-recovery', appearance);
        await page.getByRole('button', { name: 'Retry', exact: true }).click();
        await page.getByRole('button', { name: 'Complete retry' }).click();
        await expect(page.getByRole('status')).toHaveText('Section loaded successfully');
        await openStory(page, 'feedback-state-scenarios--scoped-loading-and-release', appearance);
        await page.getByRole('button', { name: 'Start loading section' }).click();
        await expect(page.getByRole('button', { name: 'Underlying action' })).toBeDisabled();
        await settleStory(page);
        await expectNoActionableAxeViolations(page, 'loading overlay');
        await page.getByRole('button', { name: 'Finish loading' }).click();
        await page.getByRole('button', { name: 'Underlying action' }).click();
        await expect(page.getByRole('status')).toHaveText('Underlying action count: 1');
      });
      test('date limits, clearing and retained hidden values', async ({ page }) => {
        await openStory(page, 'inputs-date-scenarios--date-limits-and-weekdays', appearance);
        await page.getByRole('button', { name: /choose date/i }).click();
        await expect(page.getByRole('gridcell', { name: '4', exact: true })).toBeDisabled();
        await page.getByRole('gridcell', { name: '13', exact: true }).click();
        await page.getByRole('button', { name: 'OK', exact: true }).click();
        await expect(page.getByRole('status')).toContainText('2026-10-13');
        await page.getByRole('button', { name: 'Clear value' }).click();
        await expect(page.getByRole('status')).toContainText('Value: Empty');
        await openStory(page, 'inputs-date-scenarios--hidden-field-retains-value', appearance);
        const input = page.getByTestId('hidden-date-field');
        const value = await input.inputValue();
        await page.getByRole('button', { name: 'Hide date field' }).click();
        await expect(input).toBeHidden();
        await page.getByRole('button', { name: 'Show date field' }).click();
        await expect(input).toHaveValue(value);
        await openStory(page, 'inputs-date-scenarios--range-partial', appearance);
        await expect(page.getByRole('status')).toContainText('2026-10-12 → Empty');
        await page.getByRole('button', { name: 'Clear range' }).click();
        await expect(page.getByRole('status')).toContainText('Empty → Empty');
      });
      test('compatibility defaults, loading and close callbacks', async ({ page }) => {
        await openStory(page, 'migration-compatibility--button-namespaces', appearance);
        await expect(page.getByRole('button', { name: 'Legacy primary' })).toHaveAttribute(
          'type',
          'button',
        );
        await page.getByRole('button', { name: 'Start loading' }).click();
        await expect(page.getByRole('button', { name: 'Save example' })).toBeDisabled();
        await expect(page.getByRole('button', { name: 'Save example' })).toHaveAttribute(
          'aria-busy',
          'true',
        );
        await page.getByRole('button', { name: 'Stop loading' }).click();
        await expect(page.getByRole('button', { name: 'Save example' })).toBeEnabled();
        await openStory(page, 'migration-compatibility--default-open-dialog', appearance);
        const trigger = page.getByRole('button', { name: 'Mount default-open legacy dialog' });
        await trigger.click();
        await expect(page.getByRole('dialog', { name: 'Legacy namespace dialog' })).toBeVisible();
        await settleStory(page);
        await expectNoActionableAxeViolations(page, 'legacy default-open dialog');
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(page.getByRole('status')).toHaveText(
          'Legacy no-argument close callback fired',
        );
        await expect(trigger).toBeFocused();
      });
      test('grid filtering, selection and editing', async ({ page }) => {
        await openStory(page, 'integration-data-grid--selection-and-export', appearance);
        await page.getByRole('textbox', { name: 'Search example rows' }).fill('item 01');
        await expect(page.getByRole('row').filter({ hasText: 'Example item 01' })).toBeVisible();
        await page.getByRole('checkbox', { name: 'Select row', exact: true }).click();
        await expect(
          page.getByRole('checkbox', { name: 'Unselect row', exact: true }),
        ).toBeChecked();
        await expect(page.getByRole('status')).toHaveText('Selected IDs: 1');
        await page.getByRole('button', { name: /export/i }).click();
        const download = page.waitForEvent('download');
        await page.getByRole('menuitem', { name: /download as csv/i }).click();
        expect((await download).suggestedFilename()).toContain('storybook-example-items');
        await openStory(page, 'integration-data-grid--editable-cells', appearance);
        await page.getByRole('gridcell', { name: 'Example item 01', exact: true }).dblclick();
        const editor = page.getByRole('gridcell').getByRole('textbox');
        await editor.fill('Edited example');
        await editor.press('Enter');
        await expect(
          page.getByRole('gridcell', { name: 'Edited example', exact: true }),
        ).toBeVisible();
      });
    });
  }
}

for (const width of [390, 768, 1440]) {
  test(`representative catalog layouts fit ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    for (const id of [
      'start-here-catalog--overview',
      'components-fields--playground',
      'patterns-search--responsive-search-grid-apply-and-reset',
      'inputs-date-scenarios--styled-roots',
      'integration-data-grid--selection-and-export',
      'feedback-dialog-scenarios--playground',
    ]) {
      await openStory(page, id, 'mode:light;designGeneration:webkit');
      if (id === 'feedback-dialog-scenarios--playground')
        await page.getByRole('button', { name: 'Open dialog' }).click();
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), {
          message: `${id} overflows ${width}px viewport`,
        })
        .toBeLessThanOrEqual(1);
      await page.screenshot({
        path: testInfo.outputPath(`${id}-${width}.png`),
        fullPage: true,
        animations: 'disabled',
      });
    }
  });
}
