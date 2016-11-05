import proxyquire from 'proxyquire';
import td from 'testdouble';

let universalHotReload,
  mockWebpack,
  mockWebpackCompiler,
  mockClearRequireCache,
  mockWebpackDevServer,
  mockGetDevServerPort,
  mockInitHttpServer,
  onServerChange,
  mockHttpServer,
  mockHttpServerInitObject,
  mockSockets,
  socket0,
  socket1,
  mockHttpServerCloseHandler;

describe('index', () => {
  beforeEach(() => {
    mockWebpackCompiler = td.object('webpackCompiler');
    mockWebpackCompiler.watch = td.function('webpackCompiler.watch');
    td.when(mockWebpackCompiler.watch(td.matchers.contains({
      aggregateTimeout: 300,
      poll: true,
    }), td.matchers.isA(Function))).thenDo((o, f) => onServerChange = f);

    mockWebpack = td.function('webpack');
    td.when(mockWebpack(td.matchers.anything())).thenReturn(mockWebpackCompiler);

    mockSockets = new Map();
    socket0 = td.object('socket0');
    socket0.destroy = td.function('socket0-destroy');
    socket1 = td.object('socket1');
    socket1.destroy = td.function('socket1-destroy');
    mockSockets.set(0, socket0);
    mockSockets.set(1, socket1);

    mockHttpServer = td.object('http.Server');
    mockHttpServer.close = td.function('http.Server.close');
    td.when(mockHttpServer.close(td.matchers.anything())).thenDo(f => mockHttpServerCloseHandler = f);
    mockHttpServerInitObject = {
      httpServer: mockHttpServer,
      sockets: mockSockets,
    };
    mockClearRequireCache = td.function('clearRequireCache');
    mockInitHttpServer = td.function('initHttpServer');
    td.when(mockInitHttpServer(td.matchers.anything())).thenReturn(mockHttpServerInitObject);

    mockGetDevServerPort = td.function('getDevServerPort');
    td.when(mockGetDevServerPort(td.matchers.anything())).thenReturn('8001');

    mockWebpackDevServer = td.function('webpack-dev-server');
    mockWebpackDevServer.prototype.listen = td.function('webpack-dev-server.listen');

    universalHotReload = proxyquire('../src/index', {
      'webpack': mockWebpack,
      'webpack-dev-server': mockWebpackDevServer,
      './clearRequireCache': mockClearRequireCache,
      './getDevServerPort': mockGetDevServerPort,
      './initHttpServer': mockInitHttpServer,
    }).default;
  });

  afterEach(() => {
    td.reset();
  });

  it('should clear require cache and initialise http.Server on initial load', () => {
    // arrange
    const serverBundlePath = 'path/to/server/serverBundle.js';
    const serverConfig = {
      output: {
        path: 'path/to/server',
        filename: 'serverBundle.js',
      },
    };
    const clientConfig = {
      output: {
        publicPath: 'http://localhost:8001/dist/',
      },
    };

    // act
    universalHotReload(serverConfig, clientConfig);
    onServerChange();

    // assert
    td.verify(mockWebpackCompiler.watch(td.matchers.contains({
      aggregateTimeout: 300,
      poll: true,
    }), td.matchers.isA(Function)));
    td.verify(mockClearRequireCache(serverBundlePath));
    td.verify(mockInitHttpServer(serverBundlePath));
    td.verify(mockWebpackDevServer.prototype.listen('8001', 'localhost', td.matchers.anything()));
  });

  it('should clear require cache, close http.Server and destroy all sockets on subsequent loads', () => {
    // arrange
    const serverBundlePath = 'path/to/server/serverBundle.js';
    const serverConfig = {
      output: {
        path: 'path/to/server',
        filename: 'serverBundle.js',
      },
    };
    const clientConfig = {
      output: {
        publicPath: 'http://localhost:8001/dist/',
      },
    };

    // act
    universalHotReload(serverConfig, clientConfig);
    onServerChange(); // initial load
    onServerChange(); // second load
    mockHttpServerCloseHandler(); // simulate http.Server.close callback

    // assert
    td.verify(mockClearRequireCache(serverBundlePath), {times: 2});
    td.verify(mockHttpServer.close(td.matchers.anything()));
    td.verify(socket0.destroy());
    td.verify(socket1.destroy());
    td.verify(mockInitHttpServer(serverBundlePath), {times: 2});
  });
});