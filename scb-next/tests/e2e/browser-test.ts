import { expect, test as base } from '@playwright/test';
import { collectBrowserIssues, formatBrowserIssues } from './browser-issues';

export { expect } from '@playwright/test';

export const test = base.extend<{
  browserIssues: ReturnType<typeof collectBrowserIssues>;
}>({
  browserIssues: [
    async ({ page }, use, testInfo) => {
      const browserIssues = collectBrowserIssues(page);
      await use(browserIssues);
      expect(
        browserIssues.issues,
        `Browser issues in "${testInfo.title}" at ${page.url()}:\n${formatBrowserIssues(browserIssues.issues)}`,
      ).toEqual([]);
    },
    { auto: true },
  ],
});
