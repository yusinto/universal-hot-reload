"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _url = _interopRequireDefault(require("url"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Start webpack dev server for hmr
 */
var watchClientChanges = function watchClientChanges(clientConfig) {
  var publicPath = clientConfig.output.publicPath;

  var _url$parse = _url["default"].parse(publicPath),
      protocol = _url$parse.protocol,
      host = _url$parse.host,
      port = _url$parse.port;

  var webpackDevServerUrl = "".concat(protocol, "//").concat(host);
  var entry = clientConfig.entry,
      plugins = clientConfig.plugins;
  var hmrEntries = ["".concat(require.resolve('webpack-dev-server/client/'), "?").concat(webpackDevServerUrl), require.resolve('webpack/hot/dev-server')];

  if (entry.push) {
    clientConfig.entry = entry.concat(hmrEntries); // eslint-disable-line
  } else {
    clientConfig.entry = [entry].concat(hmrEntries); // eslint-disable-line
  }

  var hmrPlugin = new _webpack["default"].HotModuleReplacementPlugin();

  if (!plugins) {
    clientConfig.plugins = [hmrPlugin]; // eslint-disable-line
  } else {
    plugins.push(hmrPlugin);
  }

  var compiler = (0, _webpack["default"])(clientConfig);

  var devServerOptions = _objectSpread({
    quiet: false,
    // don’t output anything to the console.
    noInfo: false,
    // suppress boring information
    lazy: false,
    // no watching, compiles on request
    publicPath: publicPath,
    stats: 'errors-only',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hot: true,
    sockPort: port
  }, clientConfig.devServer);

  var server = new _webpackDevServer["default"](compiler, devServerOptions);
  server.listen(port, 'localhost', function () {
    console.log("Starting webpack-dev-server on ".concat(webpackDevServerUrl));
  });
};

var _default = watchClientChanges;
exports["default"] = _default;