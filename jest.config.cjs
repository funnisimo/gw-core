module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: [
      "jest-extended",
    ],
    coverageDirectory: "./coverage",
    moduleFileExtensions: ['js', 'json', 'ts', 'node', 'mjs']
  };
  