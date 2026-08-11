export default {
  roots: ["<rootDir>/src", "<rootDir>/test"],
  globals: {
    __DEV__: false,
    __TEST__: true,
  },
  testMatch: ["<rootDir>/test/**/*.(spec|test).+(js|mjs)"],
  testEnvironment: "node",
  moduleFileExtensions: ["mjs", "js"],
  transform: {},
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./report",
        filename: "unit-test-report.html",
        expand: true,
        openReport: false,
      },
    ],
    [
      "jest-junit",
      {
        outputDirectory: "./report",
        outputName: "junit-report.xml",
        suiteName: "Unit Tests",
      },
    ],
    [
      "jest-sonar",
      {
        outputDirectory: "./report",
        outputName: "sonarqube-report.xml",
        reportedFilePath: "absolute",
      },
    ],
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{js,mjs}",
    "!<rootDir>/**/__tests__/**",
    "!<rootDir>/**/__fixtures__/**",
    "!<rootDir>/**/*.(test|spec).{js,mjs}",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["clover", "json", "lcov", "cobertura", "text", "html"],
};
