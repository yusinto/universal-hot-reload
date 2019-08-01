"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = require("path");

var _index = _interopRequireDefault(require("../index"));

var _clearRequireCache = _interopRequireDefault(require("../utils/clearRequireCache"));

var _initHttpServer = _interopRequireDefault(require("./initHttpServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Watches server for changes, recompile and restart express
 */
var watchServerChanges = function watchServerChanges(serverConfig) {
  var initialLoad = true;
  var httpServerInitObject; // contains the httpServer itself and socket references

  var bundlePath = (0, _path.join)(serverConfig.output.path, serverConfig.output.filename);
  var serverCompiler = (0, _index["default"])(serverConfig);
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

    (0, _clearRequireCache["default"])(bundlePath);

    if (!initialLoad) {
      httpServerInitObject.httpServer.close(function () {
        httpServerInitObject = (0, _initHttpServer["default"])(bundlePath);

        if (httpServerInitObject) {
          initialLoad = false;
          console.log("Server bundled & restarted ".concat(new Date()));
        } else {
          // server bundling error has occurred
          initialLoad = true;
        }
      }); // Destroy all open sockets
      // eslint-disable-next-line no-restricted-syntax

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
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      httpServerInitObject = (0, _initHttpServer["default"])(bundlePath);

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

var _default = watchServerChanges;
exports["default"] = _default;