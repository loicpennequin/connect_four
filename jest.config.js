const fs = require('fs');
const path = require('path');

const packages = fs
  .readdirSync(path.join(__dirname, 'packages'))
  .filter(pkg =>
    fs.existsSync(path.join(__dirname, 'packages', pkg, 'jest.config.js'))
  )
  .map(pkg => require(path.join(__dirname, 'packages', pkg, 'jest.config.js')));

module.exports = {
  projects: packages,
  collectCoverageFrom: [
    '**/src/**/*.{js,vue,jsx,ts,tsx}',
    '!**/templates/**',  // exception for templates in cli package
    "!**/node_modules/**",
  ],
  rootDir: __dirname
};
