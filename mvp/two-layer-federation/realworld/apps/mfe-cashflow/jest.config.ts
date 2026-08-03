export default {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: { '^.+\\.(j|t)sx?$': 'babel-jest' },
  transformIgnorePatterns: ['node_modules/(?!(@fm)/)'],
  moduleNameMapper: {
    '^@fm/ratan-design-webkit/react$': '<rootDir>/src/test/webkit-react-stub.tsx',
    '\\.(css)$': 'identity-obj-proxy',
    '^react$': '<rootDir>/node_modules/react',
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.tsx',
    '!src/test-setup.ts',
    '!src/test/**',
    '!src/webkit.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: { lines: 90, branches: 85, functions: 90, statements: 90 },
  },
};
