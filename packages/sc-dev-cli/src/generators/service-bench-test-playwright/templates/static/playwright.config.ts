import { defineConfig, devices } from '@playwright/test';
import * as fs   from 'fs';
import * as path from 'path';

/**
 * <??= pluginDisplayName ??> — Playwright E2E Configuration
 * ITAM: <??= applicationId ??>
 *
 * Environment selection (priority order):
 *   1. E2E_BASE_URL  — explicit URL override (e.g. for SSO testing)
 *   2. E2E_ENV       — named environment key (see helpers/env.ts)
 *   3. default       — local → http://localhost:11001
 *
 * Common local runs:
 *   npm test
 *   E2E_ENV=sit TEST_ACCOUNT=x TEST_PWD=x npm run test:sit:smoke
 *   E2E_ENV=uat TEST_ACCOUNT=x TEST_PWD=x npm run test:uat:smoke
 */

import { ENV_URLS, type TargetEnv } from './helpers/env.ts';

const targetEnv = (process.env.E2E_ENV ?? 'local').toLowerCase() as TargetEnv;
const baseURL   = process.env.E2E_BASE_URL ?? ENV_URLS[targetEnv] ?? ENV_URLS.local;

const grepFilter = process.env.TEST_GREP ? new RegExp(process.env.TEST_GREP) : undefined;
const ciProject  = process.env.E2E_BROWSER ?? undefined;

const AUTH_FILE    = path.resolve('tests/auth/auth-state.json');
const storageState = fs.existsSync(AUTH_FILE)
  ? AUTH_FILE
  : { cookies: [] as [], origins: [] as [] };

export default defineConfig({
  testDir: 'tests',

  // NOTE: grep is NOT set here globally — it would filter out the setup
  // project's "authenticate" test (no tags), silently skipping SC-IDP login.
  // grepFilter is applied per browser project only (see below).

  timeout:       90_000,
  expect:        { timeout: 15_000 },
  globalTimeout: 30 * 60 * 1_000,

  fullyParallel: false,
  workers:       1,
  retries:       process.env.CI ? 2 : 0,

  reporter: process.env.CI
    ? [
        [
          'genie-playwright',
          {
            projectId:   '<??= applicationId ??>',
            releaseName: process.env.RELEASE_WORK_ITEM ?? '',
            displayName: '<??= pluginDisplayName ??> E2E Tests',
            labels:      ['playwright', 'e2e', targetEnv],
          },
        ],
        ['junit', { outputFile: 'report/e2e-junit-report.xml' }],
        ['html',  { outputFolder: 'playwright-report', open: 'never' }],
      ]
    : [
        ['html', { open: 'on-failure' }],
        ['list'],
      ],

  use: {
    baseURL,
    storageState,
    screenshot:        process.env.CI ? 'only-on-failure' : 'on',
    video:             'off',   // ffmpeg not available on sc-genie pool — use trace instead
    trace:             process.env.CI ? 'retain-on-failure' : 'on',
    actionTimeout:     15_000,
    navigationTimeout: 30_000,
    locale:            'en-GB',
    timezoneId:        'Asia/Hong_Kong',
  },

  projects: [
    // Step 1 — authenticate once, persist session to auth-state.json
    {
      name:      'setup',
      testMatch: /tests\/auth\/setup\.ts/,
      use: {
        channel:        'msedge',
        executablePath: process.env.CI ? undefined : '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        headless:       !!process.env.CI,
        storageState:   { cookies: [], origins: [] },
      },
    },

    // Step 2 — Microsoft Edge (pre-installed on sc-genie pool; local uses /Applications)
    ...(!ciProject || ciProject === 'edge' ? [{
      name: 'edge',
      grep: grepFilter,
      use:  {
        ...devices['Desktop Edge'],
        channel:           'msedge',
        executablePath:    process.env.CI ? undefined : '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        headless:          !!process.env.CI,
        viewport:          null           as null,
        deviceScaleFactor: undefined,
        launchOptions:     { args: ['--start-maximized'] },
      },
      dependencies: ['setup'],
    }] : []),
  ],

  outputDir: 'test-results',
});
