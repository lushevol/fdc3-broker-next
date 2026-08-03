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
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
        'src/index.ts',
        'src/types.ts',
        'src/fdc3-log/index.ts',
        'test/**',
      ],
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90,
      },
    },
    reporters: ['junit', 'vitest-sonar-reporter'],
    outputFile: {
      junit: './coverage/junit-test-report.xml',
      'vitest-sonar-reporter': './coverage/sonar-test-report.xml',
    },
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
