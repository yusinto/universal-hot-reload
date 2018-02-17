"use strict";

var _testdouble = _interopRequireDefault(require("testdouble"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('./index', function () {
  return {
    on: global.td.function('httpServer.on')
  };
});
var mockSocket1;
var mockSocket2;
var onSocket1Close;
var onConnectionHandler;
var initHttpServer;
describe('initHttpServer', function () {
  beforeEach(function () {
    mockSocket1 = {
      on: _testdouble.default.function('socket1.on')
    };

    _testdouble.default.when(mockSocket1.on('close', _testdouble.default.matchers.isA(Function))).thenDo(function (s, f) {
      return onSocket1Close = f;
    });

    mockSocket2 = {
      on: _testdouble.default.function('socket2.on')
    };

    _testdouble.default.when(_index.default.on('connection', _testdouble.default.matchers.isA(Function))).thenDo(function (s, f) {
      return onConnectionHandler = f;
    });

    initHttpServer = require('./initHttpServer').default;
  });
  afterEach(function () {
    _testdouble.default.reset();
  });
  test('should return an object containing http.Server and a map of socket references', function () {
    var result = initHttpServer('./index');
    expect(result.httpServer).toEqual(_index.default);
    expect(result.sockets).not.toBeNull();
  });
  it('should add socket references on connection', function () {
    var result = initHttpServer('./index');
    onConnectionHandler(mockSocket1);
    onConnectionHandler(mockSocket2);
    console.log("sockets0 = ".concat(JSON.stringify(result.sockets.get(0))));
    expect(result.sockets.has(0)).toBeTruthy();
    expect(result.sockets.get(0)).toEqual(mockSocket1);
    expect(result.sockets.has(1)).toBeTruthy();
    expect(result.sockets.get(1)).toEqual(mockSocket2);

    _testdouble.default.verify(mockSocket1.on('close', _testdouble.default.matchers.isA(Function)));

    _testdouble.default.verify(mockSocket2.on('close', _testdouble.default.matchers.isA(Function)));
  });
  it('should remove socket references on close', function () {
    var result = initHttpServer('./index');
    onConnectionHandler(mockSocket1);
    onConnectionHandler(mockSocket2);
    onSocket1Close();
    expect(result.sockets.has(0)).toBeFalsy();
    expect(result.sockets.has(1)).toBeTruthy();
    expect(result.sockets.get(1)).toEqual(mockSocket2);
    expect(result.sockets.size).toEqual(1);
  });
});