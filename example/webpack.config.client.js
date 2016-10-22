const webpack = require('webpack');
const path = require('path');
const webpackDevServerUrl = 'http://localhost:3002';

module.exports = {
  devtool: 'cheap-module-inline-source-map',
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?' + webpackDevServerUrl,
    'webpack/hot/only-dev-server',
    './src/client/index'
  ],
  output: {
    path: path.resolve('dist'),
    publicPath: webpackDevServerUrl + '/dist/', // MUST BE FULL PATH!
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.resolve('src'),
        query: {
          presets: ['react-hmre'],
        }
      }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // enable webpack hot module replacement
  ]
};