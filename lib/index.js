"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.watchClientChanges = exports.watchServerChanges = exports.getDevServerBundleUrl = void 0;

var _path = require("path");

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _url = _interopRequireDefault(require("url"));

var _clearRequireCache = _interopRequireDefault(require("./clearRequireCache"));

var _initHttpServer = _interopRequireDefault(require("./initHttpServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDevServerBundleUrl = function getDevServerBundleUrl(clientConfig) {
  var _clientConfig$output = clientConfig.output,
      publicPath = _clientConfig$output.publicPath,
      filename = _clientConfig$output.filename;
  return "".concat(publicPath).concat(filename);
};
/**
 * Watches server for changes, recompile and restart express
 */


exports.getDevServerBundleUrl = getDevServerBundleUrl;

var watchServerChanges = function watchServerChanges(serverConfig) {
  var initialLoad = true;
  var httpServerInitObject; // contains the httpServer itself and socket references

  var bundlePath = (0, _path.join)(serverConfig.output.path, serverConfig.output.filename);
  var serverCompiler = (0, _webpack.default)(serverConfig);
  var compilerOptions = {
    aggregateTimeout: 300,
    // wait so long for more changes
    poll: true // use polling instead of native watchers

  }; // compile server side code

  serverCompiler.watch(compilerOptions, function (err) {
    if (err) {
      console.log("Server bundling error: ".concat(JSON.stringify(err)));
      return;
    }

    (0, _clearRequireCache.default)(bundlePath);

    if (!initialLoad) {
      httpServerInitObject.httpServer.close(function () {
        httpServerInitObject = (0, _initHttpServer.default)(bundlePath);

        if (httpServerInitObject) {
          initialLoad = false;
          console.log("Server bundled & restarted ".concat(new Date()));
        } else {
          // server bundling error has occurred
          initialLoad = true;
        }
      }); // Destroy all open sockets

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = httpServerInitObject.sockets.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var socket = _step.value;
          socket.destroy();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      httpServerInitObject = (0, _initHttpServer.default)(bundlePath);

      if (httpServerInitObject) {
        initialLoad = false;
        console.log('Server bundled successfully');
      } else {
        // server bundling error has occurred
        initialLoad = true;
      }
    }
  });
};
/**
 * Start webpack dev server for hmr
 */


exports.watchServerChanges = watchServerChanges;

var watchClientChanges = function watchClientChanges(clientConfig) {
  var publicPath = clientConfig.output.publicPath;

  var _url$parse = _url.default.parse(publicPath),
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

  var hmrPlugin = new _webpack.default.HotModuleReplacementPlugin();

  if (!plugins) {
    clientConfig.plugins = [hmrPlugin]; // eslint-disable-line
  } else {
    plugins.push(hmrPlugin);
  }

  var compiler = (0, _webpack.default)(clientConfig);
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
    hot: true
  };
  var server = new _webpackDevServer.default(compiler, devServerOptions);
  server.listen(port, 'localhost', function () {
    console.log("Starting webpack-dev-server on ".concat(webpackDevServerUrl));
  });
};

exports.watchClientChanges = watchClientChanges;

var main = function main(serverConfig, clientConfig) {
  // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
  watchClientChanges(clientConfig); // Watch changes on the server side, re-compile and restart.

  watchServerChanges(serverConfig);
};

var _default = main;
exports.default = _default;