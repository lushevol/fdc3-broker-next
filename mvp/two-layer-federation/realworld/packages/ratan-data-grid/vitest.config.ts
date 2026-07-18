import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8', reporter: ['text', 'lcov'], include: ['src/**/*.{ts,tsx}'],
      thresholds: { lines: 95, branches: 90, functions: 95, statements: 95 },
    },
  },
});
