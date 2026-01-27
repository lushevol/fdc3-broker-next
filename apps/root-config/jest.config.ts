/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // The root directory that Jest should scan for tests and modules within
  rootDir: '.',
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'cobertura'],
  moduleFileExtensions: ['js', 'ts'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
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
