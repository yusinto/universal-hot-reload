const webpack = require('webpack');
const path = require('path');

const webpackDevServerUrl = 'http://localhost:3002';

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-inline-source-map',
  entry: [
    'babel-polyfill',
    `webpack-dev-server/client?${webpackDevServerUrl}`,
    './src/client/index',
  ],
  output: {
    path: path.resolve('dist'),
    publicPath: `${webpackDevServerUrl}/dist/`, // MUST BE FULL PATH!
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['react-hot'],
          cacheDirectory: true,
        },
      }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable webpack hot module replacement
  ],
};