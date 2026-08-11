import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const rootNodeModules = fileURLToPath(new URL('../../../../../node_modules/', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['browser'],
    // Testing Library remains hoisted with the legacy product test stack.
    // Keep its renderer and all linked sources on one React copy; browser
    // verification exercises the portal's production React 19 runtime.
    dedupe: ['react', 'react-dom'],
    alias: {
      '@scdevkit/webkit/react': fileURLToPath(
        new URL(
          '../../../../../sc-dev-web/sc-dev-web/src/wrapper/ReactWrapper.ts',
          import.meta.url,
        ),
      ),
      '@scdevkit/webkit/elements': fileURLToPath(
        new URL('../../../../../sc-dev-web/sc-dev-web/elements/index.ts', import.meta.url),
      ),
      'react-dom': `${rootNodeModules}react-dom`,
      react: `${rootNodeModules}react`,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    maxWorkers: 1,
    setupFiles: ['./src/vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      // Federation's browser-only runtime initialization is exercised by the
      // Playwright portal suite; its contract helpers remain unit tested.
      exclude: [
        'src/index.tsx',
        'src/bootstrap.tsx',
        'src/test-setup.ts',
        'src/test-fixtures.ts',
        'src/remote.ts',
      ],
      thresholds: { lines: 90, branches: 80, functions: 90, statements: 90 },
    },
  },
});
