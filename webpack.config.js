module.exports = {
  entry: `./client/src/index.tsx`,
  output: {
    filename: 'bundle.js',
    path: __dirname + '/client/dist',
  },

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
