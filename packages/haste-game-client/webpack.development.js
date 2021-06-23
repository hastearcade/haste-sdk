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
    before: function (app, server, compiler) {
      app.get('/auth_config.json', function (req, res) {
        res.sendFile(join(__dirname, 'auth_config.json'));
      });
    },
  },
});
