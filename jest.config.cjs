module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: [
      "jest-extended/all"
    ],
    coverageDirectory: "./coverage",
    collectCoverageFrom: ['ts/**'],
    moduleFileExtensions: ['js', 'json', 'ts', 'node', 'mjs']
  };
  