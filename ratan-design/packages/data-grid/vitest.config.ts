import { defineConfig, mergeConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import sharedConfig from '../vitest/config.mjs';

export default mergeConfig(sharedConfig, defineConfig({
  resolve: { alias: { '@fm/ratan-design-foundation': fileURLToPath(new URL('../foundation/src/index.ts', import.meta.url)) } },
  test: { setupFiles: ['./tests/setup.ts'] },
}));
