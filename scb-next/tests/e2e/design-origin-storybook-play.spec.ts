import type { Page } from '@playwright/test';
import { expect, test } from './browser-test';

const storybookUrl = process.env.RATAN_DESIGN_STORYBOOK_URL;
test.skip(!storybookUrl, 'Requires the built ratan-design-origin Storybook');

// These assertions observe the completed Storybook play functions. Repeating
// their interactions here would hide an absent, skipped, or failing play runner.
const scenarios: { id: string; verify: (page: Page) => Promise<void> }[] = [
  {
    id: 'components-actions--interactive-loading-lifecycle',
    verify: async (page) => {
      await expect(page.getByRole('status')).toHaveText('Started: 1; completed: 1; state: idle');
      await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
      await expect(page.getByRole('button', { name: 'Save changes' })).not.toHaveAttribute(
        'aria-busy',
      );
      await expect(page.getByRole('button', { name: 'Complete operation' })).toBeDisabled();
    },
  },
  {
    id: 'components-actions--native-types-callbacks-and-ref',
    verify: async (page) => {
      await expect(page.getByRole('status')).toHaveText(
        'Submits: 1; resets: 1; submit received focus: true',
      );
      await expect(page.getByRole('button', { name: 'Reset form' })).toBeFocused();
    },
  },
  {
    id: 'components-actions--controlled-toggle-selections',
    verify: async (page) => {
      await expect(page.getByRole('status')).toHaveText(
        'View: cards; details: labels, descriptions; pinned: false',
      );
      await expect(page.getByRole('button', { name: 'Cards', exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.getByRole('button', { name: 'Descriptions', exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    },
  },
  {
    id: 'components-fields--input-refs-and-hidden-state',
    verify: async (page) => {
      await expect(page.getByRole('status')).toHaveText(
        'Root: DIV; native: INPUT; selected: Select this text',
      );
      await expect(page.getByRole('button', { name: 'Hide field' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Ref target' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Ref target' })).toHaveValue(
        'Select this text',
      );
    },
  },
  {
    id: 'components-fields--search-input-clear-and-availability',
    verify: async (page) => {
      await expect(page.getByRole('status')).toHaveText(
        'Query: New query; clears: 1; read-only: true',
      );
      await expect(page.getByRole('button', { name: 'Clear item query' })).toBeDisabled();
      await expect(page.getByRole('textbox', { name: 'Search items' })).toHaveAttribute('readonly');
    },
  },
  {
    id: 'patterns-search--criterion-playground',
    verify: async (page) => {
      await expect(page.getByRole('status')).toHaveText('Criterion: visible; restored: 1');
      await expect(page.getByRole('button', { name: 'Remove Status criterion' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Restore criterion' })).toBeDisabled();
    },
  },
  {
    id: 'patterns-search--expand-collapse-and-dismiss-criteria',
    verify: async (page) => {
      await expect(page.getByRole('status')).toHaveText('7 criteria. Removed Owner (click)');
      await expect(page.getByRole('button', { name: 'Expand search criteria' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      await expect(page.getByRole('button', { name: 'Expand search criteria' })).toBeFocused();
      await expect(
        page.getByRole('button', { name: 'Remove Owner criterion', includeHidden: true }),
      ).toHaveCount(0);
    },
  },
  {
    id: 'patterns-search--responsive-search-grid-apply-and-reset',
    verify: async (page) => {
      await expect(page.getByRole('status')).toHaveText('Search reset');
      await expect(page.getByRole('textbox', { name: 'Query', exact: true })).toHaveValue('');
      await expect(page.getByRole('textbox', { name: 'Owner', exact: true })).toHaveValue('');
      await expect(page.getByRole('button', { name: 'Remove Query filter' })).toHaveCount(0);
    },
  },
];

for (const generation of ['legacy', 'webkit']) {
  for (const mode of ['light', 'dark']) {
    test.describe(`${generation}/${mode} story play functions`, () => {
      for (const { id, verify } of scenarios) {
        test(id, async ({ page }) => {
          const query = new URLSearchParams({
            id,
            viewMode: 'story',
            globals: `mode:${mode};designGeneration:${generation}`,
          });
          await page.goto(`${storybookUrl}/iframe.html?${query}`);
          await expect(page.locator('#storybook-root > *').first()).toBeAttached();
          await verify(page);
          await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
        });
      }
    });
  }
}
