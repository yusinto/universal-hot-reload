"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getDevServerBundleUrl", {
  enumerable: true,
  get: function get() {
    return _getDevServerBundleUrl["default"];
  }
});
exports["default"] = void 0;

var _watchClientChanges = _interopRequireDefault(require("./client/watchClientChanges"));

var _watchServerChanges = _interopRequireDefault(require("./server/watchServerChanges"));

var _getDevServerBundleUrl = _interopRequireDefault(require("./utils/getDevServerBundleUrl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var main = function main(_ref) {
  var serverConfig = _ref.serverConfig,
      clientConfig = _ref.clientConfig;

  if (clientConfig) {
    // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
    (0, _watchClientChanges["default"])(clientConfig);
  }

  if (serverConfig) {
    // Watch changes on the server side, re-compile and restart.
    (0, _watchServerChanges["default"])(serverConfig);
  }
};

var _default = main;
exports["default"] = _default;