"use strict";

var _getDevServerPort = _interopRequireDefault(require("./getDevServerPort"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('getDevServerPort', function () {
  it('should throw an exception if config entry does not contain webpack-dev-sever config', function () {
    // arrange
    var mockClientConfig = {
      devtool: 'cheap-module-inline-source-map',
      entry: ['babel-polyfill', './src/client/index']
    };
    var expectedErrorMessage = 'webpack-dev-server has not been configured correctly in your client webpack config. In the "entry" array you need to add "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT'; // act

    var act = function act() {
      return (0, _getDevServerPort.default)(mockClientConfig);
    }; // assert


    expect(act).toThrow(expectedErrorMessage);
  });
  it('should throw an exception if config entry is the wrong format', function () {
    // arrange
    var webpackDevServerUrl = 'http://localhost:8001';
    var mockClientConfig = {
      devtool: 'cheap-module-inline-source-map',
      entry: ['babel-polyfill', "webpack-dev-server/client".concat(webpackDevServerUrl), './src/client/index']
    };
    var expectedErrorMessage = 'Your webpack-dev-server entry must be in the format of "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT'; // act

    var act = function act() {
      return (0, _getDevServerPort.default)(mockClientConfig);
    }; // assert


    expect(act).toThrow(expectedErrorMessage);
  });
  it('should throw an exception if config entry is the wrong format', function () {
    // arrange
    var webpackDevServerUrl = 'http://localhost';
    var mockClientConfig = {
      devtool: 'cheap-module-inline-source-map',
      entry: ['babel-polyfill', "webpack-dev-server/client?".concat(webpackDevServerUrl), './src/client/index']
    };
    var expectedErrorMessage = 'You need to specify a port for webpack-dev-server. In the "entry" array, make sure there is an entry that looks like "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT'; // act

    var act = function act() {
      return (0, _getDevServerPort.default)(mockClientConfig);
    }; // assert


    expect(act).toThrow(expectedErrorMessage);
  });
  it('should return port if configured correctly', function () {
    // arrange
    var webpackDevServerUrl = 'http://localhost:8001';
    var mockClientConfig = {
      devtool: 'cheap-module-inline-source-map',
      entry: ['babel-polyfill', "webpack-dev-server/client?".concat(webpackDevServerUrl), './src/client/index']
    }; // act

    var port = (0, _getDevServerPort.default)(mockClientConfig); // assert

    expect(port).toEqual('8001');
  });
});