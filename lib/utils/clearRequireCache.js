"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Clear bundled server cache
 * @param serverBundlePath Path to the server bundle file.
 */
var clearRequireCache = function clearRequireCache(serverBundlePath) {
  var cacheIds = Object.keys(require.cache); // eslint-disable-next-line no-restricted-syntax

  for (var _i = 0, _cacheIds = cacheIds; _i < _cacheIds.length; _i++) {
    var id = _cacheIds[_i];

    if (id === serverBundlePath) {
      delete require.cache[id];
      return;
    }
  }
};

var _default = clearRequireCache;
exports["default"] = _default;