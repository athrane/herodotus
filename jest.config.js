export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.test.js', '**/test/**/*.test.ts'],
  // Prefer TypeScript over JavaScript when resolving modules without extensions
  moduleFileExtensions: ['ts', 'js'],
};
