/* eslint-disable */
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { DefinePlugin } = require('webpack');

console.log(process.env);
const envKeys = Object.keys(process.env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
  return prev;
}, {});

module.exports = merge(common, {
  mode: 'production',
  plugins: [new DefinePlugin(envKeys)],
});
