import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^react-dom(?=\/|$)/,
        replacement: fileURLToPath(
          new URL('../../../../../node_modules/react-dom', import.meta.url),
        ),
      },
      {
        find: /^react(?=\/|$)/,
        replacement: fileURLToPath(
          new URL('../../../../../node_modules/react', import.meta.url),
        ),
      },
    ],
    dedupe: ['react', 'react-dom'],
  },
  // Configure Vitest (https://vitest.dev/config/)
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'test/**'],
      thresholds: { lines: 90, branches: 90, functions: 90, statements: 90 },
    },
    reporters: ['default', 'junit', 'vitest-sonar-reporter'],
    outputFile: {
      junit: './coverage/junit-test-report.xml',
      'vitest-sonar-reporter': './coverage/sonar-test-report.xml',
    },
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
