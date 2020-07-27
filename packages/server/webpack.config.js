const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const nodeModules = Object.fromEntries(
  fs
    .readdirSync('node_modules')
    .filter(dir => !dir.startsWith('.bin'))
    .map(mod => [mod, 'commonjs ' + mod])
);

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: ['./src/index.js'],

  target: 'node',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [new CleanWebpackPlugin()],

  externals: nodeModules,

  resolve: {
    alias: {
      '@root': path.join(__dirname, 'src')
    }
  },
  
  node: {
    __dirname: false
  },

  stats: 'minimal'
};
