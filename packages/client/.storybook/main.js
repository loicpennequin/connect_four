const path = require('path');
const fs = require('fs');

module.exports = {
    webpackFinal: (config, { configType }) => {
        const srcPath = path.resolve(__dirname, '../src');
        const alias = dirName => ({
            [`@${dirName}`]: path.resolve(srcPath, dirName)
        });
        const aliases = fs
            .readdirSync(srcPath)
            .filter(file =>
                fs.lstatSync(path.resolve(srcPath, file)).isDirectory()
            )
            .map(alias);

        config.resolve.alias = Object.assign({ '@root': srcPath }, ...aliases);
        return config;
    },
    stories: ['../src/**/*.stories.js'],
    addons: [
        '@storybook/preset-create-react-app',
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-docs',
        '@storybook/addon-a11y/register',
        '@storybook/addon-knobs',
        '@storybook/addon-storysource',
        '@storybook/addon-viewport',
        'storybook-addon-jsx'
    ]
};
