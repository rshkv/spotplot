const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'client/src');
const DIST_DIR = path.resolve(__dirname, 'client/public');

const config = {
  entry: SRC_DIR + '/index.js',
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { loader: 'babel', test: /\.js/, include: SRC_DIR, },
      { loader: 'style-loader!css-loader', test: /\.css/, include: SRC_DIR },
    ],
  },
};

module.exports = config;
