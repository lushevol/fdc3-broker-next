import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    conditions: ['browser'],
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
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/wrapper/ReactWrapper.ts',
      ],
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90
      },
    },
  },
});
