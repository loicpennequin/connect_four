const fs = require('fs');
const path = require('path');

const packages = fs
  .readdirSync(path.join(__dirname, 'packages'))

module.exports = {
  automock: false,
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  verbose: false,
  transform: {
    '^.+\\.(t|j)s$': 'babel-jest'
  },
  transformIgnorePatterns: [
    `/node_modules/(?!${packages.join('|')}).+\\.js$`,
    `/dist`,
    `/public`
  ],
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],
  setupFiles: ['<rootDir>/../../jest.init.js'],
  collectCoverageFrom: [
    'src/**/*.{js,vue,jsx,ts,tsx}',
  ]
};
