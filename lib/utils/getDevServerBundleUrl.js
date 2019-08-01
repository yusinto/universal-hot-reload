"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var getDevServerBundleUrl = function getDevServerBundleUrl(clientConfig) {
  var _clientConfig$output = clientConfig.output,
      publicPath = _clientConfig$output.publicPath,
      filename = _clientConfig$output.filename;
  return "".concat(publicPath).concat(filename);
};

var _default = getDevServerBundleUrl;
exports["default"] = _default;