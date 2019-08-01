"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaultServerConfig = function defaultServerConfig() {
  var serverEntryPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './src/server.js';
  return {
    mode: 'development',
    devtool: 'source-map',
    entry: serverEntryPath,
    target: 'node',
    externals: [(0, _webpackNodeExternals["default"])()],
    output: {
      path: _path["default"].resolve('dist'),
      filename: 'serverBundle.js',
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }, {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }]
    }
  };
};

var _default = defaultServerConfig;
exports["default"] = _default;