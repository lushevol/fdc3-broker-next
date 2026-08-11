import { defineConfig, mergeConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import sharedConfig from '../vitest/config.mjs';

export default mergeConfig(sharedConfig, defineConfig({
  resolve: {
    alias: {
      '@fm/ratan-design-data-grid': fileURLToPath(
        new URL('../data-grid/src/index.ts', import.meta.url),
      ),
      '@fm/ratan-design-foundation': fileURLToPath(
        new URL('../foundation/src/index.ts', import.meta.url),
      ),
      '@fm/ratan-design-vitest': fileURLToPath(
        new URL('../vitest/src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    coverage: {
      exclude: ['src/index.ts', 'src/button.ts', 'src/tokens.ts'],
      include: ['src/**/*.{ts,tsx}', '../data-grid/src/**/*.{ts,tsx}'],
    },
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
}));
