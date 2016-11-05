'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _clearRequireCache = require('./clearRequireCache');

var _clearRequireCache2 = _interopRequireDefault(_clearRequireCache);

var _getDevServerPort = require('./getDevServerPort');

var _getDevServerPort2 = _interopRequireDefault(_getDevServerPort);

var _initHttpServer = require('./initHttpServer');

var _initHttpServer2 = _interopRequireDefault(_initHttpServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Watches server for changes, recompile and restart express
 */
var watchServerChanges = function watchServerChanges(serverConfig) {
  var initialLoad = true;
  var httpServerInitObject = void 0; // contains the httpServer itself and socket references

  var bundlePath = serverConfig.output.path + '/' + serverConfig.output.filename;
  var serverCompiler = (0, _webpack2.default)(serverConfig);
  var compilerOptions = {
    aggregateTimeout: 300, // wait so long for more changes
    poll: true };

  // compile server side code
  serverCompiler.watch(compilerOptions, function (err) {
    if (err) {
      console.log('Server bundling error: ' + JSON.stringify(err));
      return;
    }

    (0, _clearRequireCache2.default)(bundlePath);

    if (!initialLoad) {
      httpServerInitObject.httpServer.close(function () {
        httpServerInitObject = (0, _initHttpServer2.default)(bundlePath);
        console.log('Server restarted ' + new Date());
      });

      // Destroy all open sockets
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
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      initialLoad = false;
      httpServerInitObject = (0, _initHttpServer2.default)(bundlePath);
      console.log('Server bundling done');
    }
  });
};

/**
 * Start webpack dev server for hmr
 */
var watchClientChanges = function watchClientChanges(clientConfig) {
  var devServerPort = (0, _getDevServerPort2.default)(clientConfig);
  var basePath = clientConfig.output.publicPath;

  var serverOptions = {
    quiet: false, // don’t output anything to the console.
    noInfo: true, // suppress boring information
    hot: true, // switch the server to hot mode.
    inline: true, // embed the webpack-dev-server runtime into the bundle.
    lazy: false, // no watching, compiles on request
    contentBase: basePath, // base path for the content
    publicPath: basePath,
    stats: true
  };
  var devCompiler = (0, _webpack2.default)(clientConfig);
  var devServer = new _webpackDevServer2.default(devCompiler, serverOptions);
  devServer.listen(devServerPort, 'localhost', console.log('weback-dev-server listening at ' + devServerPort));
};

var main = function main(serverConfig, clientConfig) {
  // Watch changes on the server side, re-compile and restart.
  watchServerChanges(serverConfig);

  // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
  watchClientChanges(clientConfig);
};

exports.default = main;