import { defineConfig } from '@playwright/test';

const isChatProtocolDemo = process.env.PLAYWRIGHT_CHAT_PROTOCOL_DEMO === '1';
const isChatbotReviewRegression = process.env.PLAYWRIGHT_CHATBOT_REVIEW_REGRESSION === '1';

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
  ...(isChatbotReviewRegression
    ? {
        webServer: [
          {
            command:
              'mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=18080 --chatbot.security.enabled=false --chatbot.security.allowed-origins=http://127.0.0.1:4173,http://localhost:4173 --chatbot.mock.enabled=true --chatbot.e2e-support.enabled=true"',
            cwd: 'services/chatbot-backend',
            url: 'http://127.0.0.1:18080/api/chat/e2e/question-batches/health',
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
      testIgnore: ['**/chat-protocol-demo*.spec.ts', '**/chatbot-review-regressions.spec.ts'],
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'chat-protocol-demo',
      testMatch: '**/chat-protocol-demo*.spec.ts',
      use: {
        browserName: 'chromium',
        baseURL: 'http://127.0.0.1:4173',
      },
    },
    {
      name: 'chatbot-review-regressions',
      testMatch: '**/chatbot-review-regressions.spec.ts',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        baseURL: 'http://127.0.0.1:4173',
      },
    },
  ],
});
