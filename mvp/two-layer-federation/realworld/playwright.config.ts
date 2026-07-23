import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 15_000 },
  use: {
    browserName: 'chromium',
    channel: 'chrome',
    baseURL: 'http://127.0.0.1:9200',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'node_modules/.bin/serve -s mvp/two-layer-federation/realworld/apps/mfe-cashflow/dist -l tcp://127.0.0.1:9201 -C -n --no-port-switching',
      cwd: '../../..',
      url: 'http://127.0.0.1:9201/mf-manifest.json',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'node_modules/.bin/serve -s mvp/two-layer-federation/realworld/apps/portal-host/dist -l tcp://127.0.0.1:9200 -C -n --no-port-switching',
      cwd: '../../..',
      url: 'http://127.0.0.1:9200/registry.json',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
