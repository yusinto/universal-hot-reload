"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _clearRequireCache = _interopRequireDefault(require("./clearRequireCache"));

var _initHttpServer = _interopRequireDefault(require("./initHttpServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import url from 'url';

/**
 * Watches server for changes, recompile and restart express
 */
var watchServerChanges = function watchServerChanges(serverConfig) {
  var initialLoad = true;
  var httpServerInitObject; // contains the httpServer itself and socket references

  var bundlePath = (0, _path.join)(serverConfig.output.path, serverConfig.output.filename);
  var serverCompiler = (0, _webpack.default)(serverConfig);
  var compilerOptions = {
    aggregateTimeout: 300,
    // wait so long for more changes
    poll: true // use polling instead of native watchers,

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


var watchClientChanges = function watchClientChanges(clientConfig) {
  var port = 3002; // const basePath = clientConfig.output.publicPath;
  // const serverOptions = {
  //   quiet: false, // don’t output anything to the console.
  //   noInfo: true, // suppress boring information
  //   lazy: false, // no watching, compiles on request
  //   publicPath: basePath,
  //   stats: 'errors-only',
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //   },
  // };
  // const options = {
  //   contentBase: basePath,
  //   // dev: serverOptions,
  //   port,
  //   hot: true,
  //   clientLogLevel: 'none',
  //   noInfo: true,
  // };

  var options = {
    contentBase: '/dist/',
    hot: true,
    host: 'localhost',
    noInfo: true
  };

  _webpackDevServer.default.addDevServerEntrypoints(clientConfig, options);

  var compiler = (0, _webpack.default)(clientConfig);
  var server = new _webpackDevServer.default(compiler, options);
  server.listen(port, options.host, function () {
    console.log("Wepback dev server listening on ".concat(port));
  });
};

var main = function main(serverConfig, clientConfig) {
  // Watch changes on the server side, re-compile and restart.
  watchServerChanges(serverConfig); // Start webpack dev server separately on a different port to avoid issues with httpServer restarts

  watchClientChanges(clientConfig);
};

var _default = main;
exports.default = _default;