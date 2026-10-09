export default {
  rootDir: '.',
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'cobertura'],
  coverageThreshold: { global: { branches: 90, lines: 90 } },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/fileMock.js',
    'single-spa-react/parcel': 'single-spa-react/lib/cjs/parcel.cjs',
    '^@scdevkit/webkit/elements/(.*)$': '<rootDir>/../../../sc-dev-web/sc-dev-web/dist/elements/$1.js',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom', './jest.setup.tsx'],
  testEnvironment: 'jsdom',
  resolver: '<rootDir>/scripts/jest-package-resolver.cjs',
  transform: { '^.+\\.(j|t)sx?$': 'babel-jest' },
  transformIgnorePatterns: ['node_modules/(?!ratan-design-origin/|@mui/|@emotion/|@babel/runtime/)'],
  testPathIgnorePatterns: [
    '/node_modules/', '/src/new-styles/', '/prototype[^/]*\\.test\\.tsx$',
    '/compatibility\\.test\\.tsx$', '/mui5-compatibility\\.test\\.tsx$',
    '/Dialog/common/Draggable\\.test\\.tsx$', '/TableDetail/Field\\.console-contract\\.test\\.tsx$',
  ],
  reporters: [
    'default',
    ['jest-sonar', { outputDirectory: './coverage', outputName: 'sonar-test-report.xml', reportedFilePath: 'relative' }],
    ['jest-junit', { outputDirectory: './coverage', outputName: 'junit-test-report.xml', reportedFilePath: 'relative' }],
  ],
};
