export default {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  globals: {
    __DEV__: false,
    __TEST__: true,
  },
  testMatch: ['<rootDir>/test/**/*.(spec|test).(js|jsx|ts|tsx)'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(js|jsx|mjs)$': ['babel-jest'],
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './report',
        filename: 'unit-test-report.html',
        expand: true,
        openReport: false,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: './report',
        outputName: 'junit-report.xml',
        suiteName: 'Unit Tests',
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: './report',
        outputName: 'sonarqube-report.xml',
        reportedFilePath: 'absolute',
      },
    ],
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/**/__tests__/**',
    '!<rootDir>/**/__fixtures__/**',
    '!<rootDir>/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'cobertura', 'text', 'html'],
  moduleNameMapper: {
    '^.\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@\\/(.*)$': '<rootDir>/src/$1',
    '^test\\/(.*)$': '<rootDir>/test/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@babel/runtime/helpers/esm|@esm-bundle|lit|lit-html|@lit|@web|chai-a11y-axe|@open-wc|@shoelace-style|lodash-es|internmap|dayjs|@scdevkit|sinon)',
  ],
};
