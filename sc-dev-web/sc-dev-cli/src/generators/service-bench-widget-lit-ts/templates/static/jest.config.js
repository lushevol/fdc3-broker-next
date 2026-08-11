class IntersectionObserver {
  observe() {}
  unobserve() {}
}

class ResizeObserver {
  observe() {}
  unobserve() {}
}

export default {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  globals: {
    __DEV__: false,
    __TEST__: true,
    ResizeObserver,
    IntersectionObserver,
  },
  testMatch: ['<rootDir>/test/**/*.(spec|test).+(js|jsx|ts|tsx)'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(js|jsx|mjs)$': [
      'babel-jest',
      { configFile: './babel.test.config.cjs' },
    ],
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
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^@\\/(.*)$': '<rootDir>/src/$1',
    '^test\\/(.*)$': '<rootDir>/test/$1',
    '^@scdevkit\\/webkit\\/localization(.js)*$':
      '<rootDir>/node_modules/@scdevkit/webkit/dist/src/i18n/localization.js',
    '^@scdevkit\\/webkit\\/(.*)$':
      '<rootDir>/node_modules/@scdevkit/webkit/dist/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!lit|lit-html|@lit|@esm-bundle|@web|chai-a11y-axe|@open-wc|@shoelace-style|dayjs|@scdevkit)',
  ],
};
