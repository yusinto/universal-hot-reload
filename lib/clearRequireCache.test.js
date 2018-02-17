"use strict";

var _clearRequireCache = _interopRequireDefault(require("./clearRequireCache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('clearRequireCache', function () {
  it.skip('should delete cache entry if found', function () {
    // arrange
    var testPackage = './getDevServerPort';

    require(testPackage); //eslint-disable-line


    var cachePath = Object.keys(require.cache).find(function (id) {
      return id.includes('getDevServerPort');
    }); // act

    (0, _clearRequireCache.default)(cachePath); // TODO: require.cache seems to ALWAYS be undefined for some reason..
    // assert

    expect(require.cache[cachePath]).toEqual({});
  });
});