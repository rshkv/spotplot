module.exports = {
  entry: `./client/src/index.tsx`,
  output: {
    filename: 'bundle.js',
    path: __dirname + '/client/dist',
  },

  // (SLOW) Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // TODO: Check if this is still necessary
    alias: { soundmanager2: 'soundmanager2/script/soundmanager2-nodebug-jsmin.js' },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   "react": "React",
  //   "react-dom": "ReactDOM"
  // },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
