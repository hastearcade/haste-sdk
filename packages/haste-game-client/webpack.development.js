/* eslint-disable */
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { join } = require('path');
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 3008,
    before: function (app, server, compiler) {
      app.get('/assets/images/:imageName', function (req, res) {
        res.sendFile(join(__dirname, `src/assets/images/${req.params['imageName']}`));
      });
      app.get('/assets/pack.json', function (req, res) {
        res.sendFile(join(__dirname, `src/assets/pack.json`));
      });
    },
    host: '0.0.0.0',
  },
  plugins: [
    new DefinePlugin({
      __API_HOST__: JSON.stringify('http://localhost:3007'),
    }),
  ],
});
