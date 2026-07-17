export default {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: { '^.+\\.(j|t)sx?$': 'babel-jest' },
  transformIgnorePatterns: ['node_modules/(?!(@fm)/)'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '^@fm/platform-contracts-poc$': '<rootDir>/../../packages/platform-contracts-poc/src/index.ts',
    '^@fm/platform-sdk-poc$': '<rootDir>/../../packages/platform-sdk-poc/src/index.ts',
    '^@fm/ratan-sdk-poc$': '<rootDir>/../../packages/ratan-sdk-poc/src/index.ts',
    '^@fm/ratan-ui-poc$': '<rootDir>/../../packages/ratan-ui-poc/src/index.tsx'
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/index.tsx', '!src/test-setup.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: { global: { lines: 90, branches: 90, functions: 90, statements: 90 } },
};
