import { defineConfig, devices } from '@playwright/test';

const ENV_URLS = {
  local: 'http://localhost:6006/',
  // GDCE Non-Prod
  dev: 'https://servicebench-dev-stg.55313.app.standardchartered.com/sc-webkit/storybook/',
  sit: 'https://servicebench-sit.global.standardchartered.com/sc-webkit/storybook/',
  'sit-stg': 'https://servicebench-sit-stg.55313.app.standardchartered.com/sc-webkit/storybook/',
  uat: 'https://servicebench-uat.global.standardchartered.com/sc-webkit/storybook/',
  'uat-stg': 'https://servicebench-uat-stg.55313.app.standardchartered.com/sc-webkit/storybook/',
  qa: 'https://servicebench-qa.global.standardchartered.com/sc-webkit/storybook/',
  'qa-stg': 'https://servicebench-qa-stg.55313.app.standardchartered.com/sc-webkit/storybook/',
  pt: 'https://servicebench-pt.global.standardchartered.com/sc-webkit/storybook/',
} as const;
type Env = keyof typeof ENV_URLS;

const env = (process.env.TEST_ENV as Env) || (process.env.CI ? 'sit' : 'local');
const baseURL = ENV_URLS[env] || (process.env.CI ? ENV_URLS.sit : ENV_URLS.local);
console.log(`Running Playwright tests against ${env} environment: ${baseURL}`);
const isLocal = baseURL === ENV_URLS.local;


export default defineConfig({
  testDir: './e2e/test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI || !isLocal ? 2 : 1,
  workers: 1,
  reporter: [
    process.env.CI
      ? [
          'genie-playwright',
          {
            projectId: '55313',
            displayName: 'Playwright E2E Tests',
            labels: ['playwright', 'e2e'],
          },
        ]
      : ['html', { open: 'never' }],
  ],
  timeout: isLocal ? 10_000 : 30_000, // 10s local, 30s for remote environments
  globalTimeout: isLocal ? 30 * 60_000 : 60 * 60_000, // 30m local, 1h for remote environments
  use: {
    screenshot: 'only-on-failure',
    video: 'off', // ffmpeg not available on corporate network — screenshots used instead
    ignoreHTTPSErrors: true, // corporate internal CA — self-signed cert on IdP and API endpoints
    baseURL,
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        headless: !process.env.HEADED, // headless by default, headed only when HEADED=1
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: { args: ['--start-maximized'] },
      },
    },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //     headless: true,
    //     viewport: null,
    //     deviceScaleFactor: undefined,
    //     launchOptions: {
    //       args: ['--start-maximized'],
    //     },
    //   },
    // },
  ],
});
