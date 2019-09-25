"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _url = _interopRequireDefault(require("url"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  var devServerOptions = {
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
  };
  var server = new _webpackDevServer["default"](compiler, devServerOptions);
  server.listen(port, 'localhost', function () {
    console.log("Starting webpack-dev-server on ".concat(webpackDevServerUrl));
  });
};

var _default = watchClientChanges;
exports["default"] = _default;