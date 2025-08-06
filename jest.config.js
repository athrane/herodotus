export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.test.js', '**/test/**/*.test.ts'],
  moduleFileExtensions: ['js', 'ts'],
};
