const base = require('../../jest.config.base.js');
const pkgJson = require('./package.json');

const config = {
  ...base,
  rootDir: __dirname,
  name: pkgJson.name,
  displayName: pkgJson.name,
  testMatch: [`<rootDir>/**/*.test.js`],
  moduleNameMapper: {
    '@root(.*)$': '<rootDir>/src/$1'
  }
};

delete config.testRegex;

module.exports = config;
