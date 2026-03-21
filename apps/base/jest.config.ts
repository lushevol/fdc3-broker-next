/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // The root directory that Jest should scan for tests and modules within
  rootDir: '.',
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'cobertura'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/fileMock.js',
    'single-spa-react/parcel': 'single-spa-react/lib/cjs/parcel.cjs',
    '^@assistant-ui/react$': '<rootDir>/__mocks__/@assistant-ui/react.tsx',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom', './jest.setup.tsx'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(@assistant-ui|ai|zustand|nanoid|assistant-stream)/)'],
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: './coverage',
        outputName: 'sonar-test-report.xml',
        reportedFilePath: 'relative',
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: './coverage',
        outputName: 'junit-test-report.xml',
        reportedFilePath: 'relative',
      },
    ],
  ],
};
