import { expect, test } from '@playwright/test';
import { expectNoActionableAxeViolations } from './accessibility';

import { openStory, settleStory, storybookUrl } from './storybook-helpers';

test.describe.configure({ mode: 'parallel' });
test.skip(!storybookUrl, 'Requires the built ratan-design-origin Storybook');

for (const generation of ['legacy', 'webkit']) {
  for (const mode of ['light', 'dark']) {
    test(`catalog renders accessibly: ${generation}/${mode}`, async ({ page, request }) => {
      test.setTimeout(600_000);
      const response = await request.get(`${storybookUrl}/index.json`);
      expect(response.ok()).toBe(true);
      const index = (await response.json()) as {
        entries: Record<string, { id: string; type: string }>;
      };
      const storyIds = Object.values(index.entries)
        .filter(({ type }) => type === 'story')
        .map(({ id }) => id)
        .sort();
      expect(storyIds.length).toBeGreaterThan(0);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const storyId of storyIds) {
        await test.step(storyId, async () => {
          errors.length = 0;
          await openStory(page, storyId, `mode:${mode};designGeneration:${generation}`);
          // Include content in examples that start with their modal or notification closed.
          const trigger = page.getByRole('button', { name: /^(Open dialog|Show notification)$/ });
          if ((await trigger.count()) === 1) await trigger.click();
          await settleStory(page);
          try {
            await expectNoActionableAxeViolations(page, `${storyId} (${generation}/${mode})`);
          } catch (error) {
            expect.soft(false, String(error)).toBe(true);
          }
          expect.soft(errors, `${storyId} threw a browser error`).toEqual([]);
        });
      }
    });
  }
}
