import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

const testReact = fileURLToPath(new URL('../../../../../node_modules/react', import.meta.url));
const testReactDom = fileURLToPath(new URL('../../../../../node_modules/react-dom', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      react: testReact,
      'react-dom': testReactDom,
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8', reporter: ['text', 'lcov'], include: ['src/**/*.{ts,tsx}'],
      thresholds: { lines: 95, branches: 90, functions: 95, statements: 95 },
    },
  },
});
