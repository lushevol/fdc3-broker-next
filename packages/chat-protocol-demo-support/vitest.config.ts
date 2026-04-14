import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
    },
    reporters: ['default', 'junit', 'vitest-sonar-reporter'],
    outputFile: {
      junit: './coverage/junit-test-report.xml',
      'vitest-sonar-reporter': './coverage/sonar-test-report.xml',
    },
  },
});
