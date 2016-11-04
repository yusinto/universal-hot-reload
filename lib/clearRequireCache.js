"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Clear bundled server cache
 * @param serverBundlePath Path to the server bundle file.
 */
var clearRequireCache = function clearRequireCache(serverBundlePath) {
  var cacheIds = Object.keys(require.cache);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = cacheIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var id = _step.value;

      if (id === serverBundlePath) {
        delete require.cache[id];
        return;
      }
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
};

exports.default = clearRequireCache;