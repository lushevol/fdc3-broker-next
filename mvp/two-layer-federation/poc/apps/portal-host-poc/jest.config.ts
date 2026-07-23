export default {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: { '^.+\\.(j|t)sx?$': 'babel-jest' },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '^@fm/platform-contracts-poc$': '<rootDir>/../../packages/platform-contracts-poc/src/index.ts',
    '^@fm/ratan-design-poc$': '<rootDir>/../../packages/ratan-design-poc/src/index.tsx',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.tsx',
    '!src/bootstrap.tsx',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: { lines: 90, branches: 90, functions: 90, statements: 90 },
  },
};
