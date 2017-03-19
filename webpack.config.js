const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'client/src');
const DIST_DIR = path.resolve(__dirname, 'client/public');

module.exports = {
  entry: SRC_DIR + '/index.js',
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    alias: { soundmanager2: 'soundmanager2/script/soundmanager2-nodebug-jsmin.js' },
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
