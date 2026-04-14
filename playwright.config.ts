import { defineConfig } from '@playwright/test';

const isChatProtocolDemo = process.env.PLAYWRIGHT_CHAT_PROTOCOL_DEMO === '1';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:8001',
    trace: 'on-first-retry',
  },
  ...(isChatProtocolDemo
    ? {
        webServer: [
          {
            command: 'npm --workspace apps/chat-protocol-demo-server run dev',
            url: 'http://127.0.0.1:4111/health',
            reuseExistingServer: true,
            timeout: 120_000,
          },
          {
            command: 'npm --workspace apps/chat-protocol-demo-web run dev',
            url: 'http://127.0.0.1:4173',
            reuseExistingServer: true,
            timeout: 120_000,
          },
        ],
      }
    : {}),
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/chat-protocol-demo.spec.ts',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'chat-protocol-demo',
      testMatch: '**/chat-protocol-demo.spec.ts',
      use: {
        browserName: 'chromium',
        baseURL: 'http://127.0.0.1:4173',
      },
    },
  ],
});
