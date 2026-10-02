import { defineConfig } from '@playwright/test';
import { join } from 'node:path';

export default defineConfig({
  testDir: './tests/e2e',
  snapshotPathTemplate: process.env.BASE_UI_PARITY_SNAPSHOT_DIR
    ? join(process.env.BASE_UI_PARITY_SNAPSHOT_DIR, '{testFilePath}/{arg}{ext}')
    : '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:8001',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
