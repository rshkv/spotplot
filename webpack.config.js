const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'client/src');
const DIST_DIR = path.resolve(__dirname, 'client/public');

module.exports = {
  entry: SRC_DIR + '/index.js',
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: SRC_DIR,
        loader: 'babel-loader',
      }, {
        test: /\.scss$/,
        include: SRC_DIR,
        loader: 'style-loader!css-loader!sass-loader',
      },
    ],
  },
};
