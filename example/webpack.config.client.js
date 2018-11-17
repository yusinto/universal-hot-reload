const path = require('path');

const WebpackDevServerUrl = 'http://localhost:3002';

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/client/index',
  output: {
    path: path.resolve('dist'),
    publicPath: `${WebpackDevServerUrl}/dist/`, // MUST BE FULL PATH!
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('src'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
};
