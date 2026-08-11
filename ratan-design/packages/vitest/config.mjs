import { defineConfig } from 'vitest/config';

export const ratanVitestConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    environment: 'jsdom',
  },
});

export default ratanVitestConfig;
