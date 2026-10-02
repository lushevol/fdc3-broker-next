import type { Page } from '@playwright/test';

export type BrowserIssue = {
  kind: 'pageerror' | 'console.error' | 'requestfailed';
  message: string;
};

export function collectBrowserIssues(page: Page) {
  const issues: BrowserIssue[] = [];

  page.on('pageerror', (error) => {
    issues.push({ kind: 'pageerror', message: error.message });
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const location = message.location();
      issues.push({
        kind: 'console.error',
        message: `${message.text()}${location.url ? ` (${location.url}:${location.lineNumber})` : ''}`,
      });
    }
  });
  page.on('requestfailed', (request) => {
    issues.push({
      kind: 'requestfailed',
      message: `${request.url()}: ${request.failure()?.errorText ?? 'unknown failure'}`,
    });
  });

  return {
    get issues() {
      return [...issues];
    },
    reset() {
      issues.length = 0;
    },
  };
}

export function formatBrowserIssues(issues: BrowserIssue[]) {
  return issues.map(({ kind, message }) => `[${kind}] ${message}`).join('\n');
}
