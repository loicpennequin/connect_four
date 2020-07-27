const {
    override,
    useBabelRc,
    useEslintRc,
    addWebpackAlias,
    addWebpackModuleRule
} = require('customize-cra');
const path = require('path');
const fs = require('fs');

const srcPath = path.resolve(__dirname, 'src');
const alias = dirName => ({
    [`@${dirName}`]: path.resolve(srcPath, dirName)
});
const aliases = fs
    .readdirSync(srcPath)
    .filter(file => fs.lstatSync(path.resolve(srcPath, file)).isDirectory())
    .map(alias);

module.exports = override(
    // eslint-disable-next-line
    useBabelRc(),
    // eslint-disable-next-line
    useEslintRc(),
    addWebpackAlias(Object.assign({ '@root': srcPath }, ...aliases)),
    addWebpackModuleRule({ test: /\.worker\.js$/, use: 'worker-loader' })
);
