"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Clear bundled server cache
 * @param serverBundlePath Path to the server bundle file.
 */
var clearRequireCache = function clearRequireCache(serverBundlePath) {
  var cacheIds = Object.keys(require.cache);

  for (var _i = 0; _i < cacheIds.length; _i++) {
    var id = cacheIds[_i];

    if (id === serverBundlePath) {
      delete require.cache[id];
      return;
    }
  }
};

var _default = clearRequireCache;
exports.default = _default;