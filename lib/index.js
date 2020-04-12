"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.serverHotReload = exports.getDevServerBundleUrl = void 0;

var _watchClientChanges = _interopRequireDefault(require("./client/watchClientChanges"));

var _watchServerChanges = _interopRequireWildcard(require("./server/watchServerChanges"));

var _getDevServerBundleUrl = _interopRequireDefault(require("./utils/getDevServerBundleUrl"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getDevServerBundleUrl = _getDevServerBundleUrl["default"];
exports.getDevServerBundleUrl = getDevServerBundleUrl;

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

var serverHotReload = function serverHotReload(serverEntryPath) {
  (0, _watchServerChanges.watchServerChangesWithDefaultConfig)(serverEntryPath);
};

exports.serverHotReload = serverHotReload;
var _default = main;
exports["default"] = _default;