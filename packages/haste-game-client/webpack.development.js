/* eslint-disable */
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { join } = require('path');
const { DefinePlugin } = require('webpack');
const fs = require('fs');
const path = __dirname + '/.env';

console.log('building development');

if (fs.existsSync(path)) {
  const dotenv = require('dotenv').config({ path });
  const env = dotenv.parsed;

  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

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
    plugins: [new DefinePlugin(envKeys)],
  });
} else {
  console.log(`No .env file was found.`);
  // this is needed for deploys so they do not fail in heroku,
  // but ultimately is overwritten by the heroku-postbuild npm script
  module.exports = common;
}