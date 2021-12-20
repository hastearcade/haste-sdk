const path = require('path');

// Simply configure those 4 variables:
const JS_SOURCE_FILES = ['./lib/index.js'];
const OUTPUT_FILENAME = 'index';
const DEST_FOLDER = 'dist';

const OUTPUT_FILE = `${OUTPUT_FILENAME}.js`;
const OUTPUT_FILE_MIN = `${OUTPUT_FILENAME}.min.js`;

const { plugins, outputfile, mode } = {
  outputfile: OUTPUT_FILE_MIN,
  mode: 'production',
};

module.exports = {
  mode,
  entry: JS_SOURCE_FILES,
  output: {
    path: path.join(__dirname, DEST_FOLDER),
    filename: outputfile,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        // Only run `.js` files through Babel
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  devtool: 'source-map',
  plugins: plugins,
  resolve: {
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      os: false,
      'crypto-browserify': require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
    },
  },
};
