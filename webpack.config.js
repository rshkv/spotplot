const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'client/src');
const DIST_DIR = path.resolve(__dirname, 'client/public');

module.exports = {
  entry: SRC_DIR + '/index.js',
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },

  // Adding source maps will slow down Webpack
  // devtool: 'source-map',
  resolve: {
    alias: { soundmanager2: 'soundmanager2/script/soundmanager2-nodebug-jsmin.js' },
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
      }, {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
};
