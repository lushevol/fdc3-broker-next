import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['production-deployment.spec.ts'],
  timeout: 30_000,
  expect: { timeout: 15_000 },
  use: {
    browserName: 'chromium',
    channel: 'chrome',
    baseURL: process.env.REALWORLD_DEPLOY_URL ?? 'https://localhost:9443',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
});
