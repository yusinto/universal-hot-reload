"use strict";

var _testdouble = _interopRequireDefault(require("testdouble"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _clearRequireCache = _interopRequireDefault(require("./clearRequireCache"));

var _getDevServerPort = _interopRequireDefault(require("./getDevServerPort"));

var _initHttpServer = _interopRequireDefault(require("./initHttpServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('webpack', function () {
  return global.td.function('webpack');
});
jest.mock('webpack-dev-server', function () {
  return global.td.function('webpack-dev-server');
});
jest.mock('./clearRequireCache', function () {
  return global.td.function('clearRequireCache');
});
jest.mock('./getDevServerPort', function () {
  return global.td.function('getDevServerPort');
});
jest.mock('./initHttpServer', function () {
  return global.td.function('initHttpServer');
});
var universalHotReload, mockWebpackCompiler, onServerChange, mockHttpServer, mockHttpServerInitObject, mockSockets, socket0, socket1, mockHttpServerCloseHandler;
describe('index', function () {
  beforeEach(function () {
    mockWebpackCompiler = _testdouble.default.object('webpackCompiler');
    mockWebpackCompiler.watch = _testdouble.default.function('webpackCompiler.watch');

    _testdouble.default.when(mockWebpackCompiler.watch(_testdouble.default.matchers.contains({
      aggregateTimeout: 300,
      poll: true
    }), _testdouble.default.matchers.isA(Function))).thenDo(function (o, f) {
      return onServerChange = f;
    });

    _testdouble.default.when((0, _webpack.default)(_testdouble.default.matchers.anything())).thenReturn(mockWebpackCompiler);

    mockSockets = new Map();
    socket0 = _testdouble.default.object('socket0');
    socket0.destroy = _testdouble.default.function('socket0-destroy');
    socket1 = _testdouble.default.object('socket1');
    socket1.destroy = _testdouble.default.function('socket1-destroy');
    mockSockets.set(0, socket0);
    mockSockets.set(1, socket1);
    mockHttpServer = _testdouble.default.object('http.Server');
    mockHttpServer.close = _testdouble.default.function('http.Server.close');

    _testdouble.default.when(mockHttpServer.close(_testdouble.default.matchers.anything())).thenDo(function (f) {
      return mockHttpServerCloseHandler = f;
    });

    mockHttpServerInitObject = {
      httpServer: mockHttpServer,
      sockets: mockSockets
    };

    _testdouble.default.when((0, _initHttpServer.default)(_testdouble.default.matchers.anything())).thenReturn(mockHttpServerInitObject);

    _testdouble.default.when((0, _getDevServerPort.default)(_testdouble.default.matchers.anything())).thenReturn('8001');

    _webpackDevServer.default.prototype.listen = _testdouble.default.function('webpack-dev-server.listen');
    universalHotReload = require('../src/index').default;
  });
  afterEach(function () {
    _testdouble.default.reset();
  });
  it('should clear require cache and initialise http.Server on initial load', function () {
    // arrange
    var serverBundlePath = 'path/to/server/serverBundle.js';
    var serverConfig = {
      output: {
        path: 'path/to/server',
        filename: 'serverBundle.js'
      }
    };
    var clientConfig = {
      output: {
        publicPath: 'http://localhost:8001/dist/'
      }
    }; // act

    universalHotReload(serverConfig, clientConfig);
    onServerChange(); // assert

    _testdouble.default.verify(mockWebpackCompiler.watch(_testdouble.default.matchers.contains({
      aggregateTimeout: 300,
      poll: true
    }), _testdouble.default.matchers.isA(Function)));

    _testdouble.default.verify((0, _clearRequireCache.default)(serverBundlePath));

    _testdouble.default.verify((0, _initHttpServer.default)(serverBundlePath));

    _testdouble.default.verify(_webpackDevServer.default.prototype.listen('8001', 'localhost', _testdouble.default.matchers.anything()));
  });
  it('should clear require cache, close http.Server and destroy all sockets on subsequent loads', function () {
    // arrange
    var serverBundlePath = 'path/to/server/serverBundle.js';
    var serverConfig = {
      output: {
        path: 'path/to/server',
        filename: 'serverBundle.js'
      }
    };
    var clientConfig = {
      output: {
        publicPath: 'http://localhost:8001/dist/'
      }
    }; // act

    universalHotReload(serverConfig, clientConfig);
    onServerChange(); // initial load

    onServerChange(); // second load

    mockHttpServerCloseHandler(); // simulate http.Server.close callback
    // assert

    _testdouble.default.verify((0, _clearRequireCache.default)(serverBundlePath), {
      times: 2
    });

    _testdouble.default.verify(mockHttpServer.close(_testdouble.default.matchers.anything()));

    _testdouble.default.verify(socket0.destroy());

    _testdouble.default.verify(socket1.destroy());

    _testdouble.default.verify((0, _initHttpServer.default)(serverBundlePath), {
      times: 2
    });
  });
});