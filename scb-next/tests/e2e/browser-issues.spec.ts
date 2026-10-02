import { expect, test } from '@playwright/test';
import { collectBrowserIssues, formatBrowserIssues } from './browser-issues';

test('records console errors, uncaught exceptions and failed requests with useful context', async ({
  page,
}) => {
  const browserIssues = collectBrowserIssues(page);
  await page.setContent('<button>Healthy page</button>');
  await page.route('https://browser-gate.invalid/missing.js', (route) => route.abort('failed'));

  const pageError = page.waitForEvent('pageerror');
  await page.evaluate(() => {
    console.warn('Expected warning');
    console.error('Expected console failure');
    setTimeout(() => {
      throw new Error('Expected page failure');
    }, 0);
  });
  await pageError;
  const failedRequest = page.waitForEvent('requestfailed');
  await page.evaluate(async () => {
    await fetch('https://browser-gate.invalid/missing.js').catch(() => {});
  });
  await failedRequest;

  expect(browserIssues.issues).toEqual(
    expect.arrayContaining([
      { kind: 'console.error', message: expect.stringContaining('Expected console failure') },
      { kind: 'pageerror', message: 'Expected page failure' },
      {
        kind: 'requestfailed',
        message: expect.stringContaining('https://browser-gate.invalid/missing.js:'),
      },
    ]),
  );
  expect(formatBrowserIssues(browserIssues.issues)).toContain('[requestfailed]');
  expect(browserIssues.issues.some(({ message }) => message.includes('Expected warning'))).toBe(false);
});

test('a story reset retains recorded evidence and starts a fresh collection', async ({ page }) => {
  const browserIssues = collectBrowserIssues(page);
  const consoleMessage = page.waitForEvent('console');
  await page.evaluate(() => console.error('Previous story failure'));
  await consoleMessage;
  const previousStory = browserIssues.issues;
  browserIssues.reset();
  expect(previousStory).toHaveLength(1);
  expect(browserIssues.issues).toEqual([]);
});
