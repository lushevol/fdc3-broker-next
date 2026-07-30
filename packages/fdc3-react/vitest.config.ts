import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'cobertura'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/index.ts', 'src/types.ts', 'test/**'],
      thresholds: {
        lines: 90,
        branches: 90,
      },
    },
    reporters: ['default'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
