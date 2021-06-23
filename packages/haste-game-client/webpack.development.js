/* eslint-disable */
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { join } = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 3008,
    host: '0.0.0.0',
  },
});
