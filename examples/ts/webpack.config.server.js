const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: ['./src/server.ts'],
  target: 'node', // tell webpack this bundle will be used in nodejs environment.
  externals: [nodeExternals()], // Omit node_modules code from the bundle. You don't want and don't need them in the bundle.
  output: {
    path: path.resolve('dist'),
    filename: 'serverBundle.js',
    libraryTarget: 'commonjs2', // IMPORTANT! Add module.exports to the beginning of the bundle, so universal-hot-reload can access your app.
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
  },
}
