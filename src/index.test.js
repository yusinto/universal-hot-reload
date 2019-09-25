jest.mock('webpack', () => jest.fn());
jest.mock('webpack-dev-server', () => jest.fn());
jest.mock('./utils/clearRequireCache', () => jest.fn());
jest.mock('./server/initHttpServer', () => jest.fn());

import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import clearRequireCache from './utils/clearRequireCache';
import initHttpServer from './server/initHttpServer';
import watchClientChanges from './client/watchClientChanges';
import watchServerChanges from './server/watchServerChanges';
import getDevServerBundleUrl from './utils/getDevServerBundleUrl';

const clientConfig = {
  entry: './app-entry.js',
  output: {
    publicPath: 'http://localhost:8001/dist/',
    filename: 'bundle.js',
  },
};

const serverConfig = {
  output: {
    path: 'path/to/server',
    filename: 'serverBundle.js',
  },
};

describe('index.js', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getDevServerBundleUrl', () => {
    const result = getDevServerBundleUrl(clientConfig);
    expect(result).toEqual('http://localhost:8001/dist/bundle.js');
  });

  describe('client', () => {
    let mockClientCompiler;
    let mockHmrPlugin;
    let wdsMockInstance;

    beforeEach(() => {
      mockClientCompiler = {
        watch: jest.fn(),
      };
      mockHmrPlugin = jest.fn();
      wdsMockInstance = {
        listen: jest.fn(),
      };
      webpack.mockImplementation(() => mockClientCompiler);
      webpack.HotModuleReplacementPlugin = () => mockHmrPlugin;
      webpackDevServer.mockImplementation(() => wdsMockInstance);
    });

    test('hmr entries and plugin are added to client config', () => {
      watchClientChanges({ ...clientConfig });

      const { entry, output, plugins } = webpack.mock.calls[0][0];
      expect(entry.length).toEqual(3);
      expect(entry[0]).toEqual(clientConfig.entry);
      expect(entry[1]).toEqual(expect.stringContaining('webpack-dev-server/client/index.js?http://localhost:8001'));
      expect(entry[2]).toEqual(expect.stringContaining('webpack/hot/dev-server.js'));
      expect(output).toEqual(clientConfig.output);
      expect(plugins).toEqual([mockHmrPlugin]);
    });

    test('hmr entries and plugin are appended to client config', () => {
      const clientConfigClone = { ...clientConfig, entry: ['./app1.js', './app2.js'], plugins: ['some-other-plugin'] };

      watchClientChanges(clientConfigClone);

      const { entry, output, plugins } = webpack.mock.calls[0][0];
      expect(entry.length).toEqual(4);
      expect(entry[0]).toEqual('./app1.js');
      expect(entry[1]).toEqual('./app2.js');
      expect(entry[2]).toEqual(expect.stringContaining('webpack-dev-server/client/index.js?http://localhost:8001'));
      expect(entry[3]).toEqual(expect.stringContaining('webpack/hot/dev-server.js'));
      expect(output).toEqual(clientConfig.output);
      expect(plugins).toEqual(['some-other-plugin', mockHmrPlugin]);
    });

    test('webpack-dev-server constructed with correct options', () => {
      watchClientChanges({ ...clientConfig });

      const options = webpackDevServer.mock.calls[0][1];

      expect(webpackDevServer).toBeCalledTimes(1);
      expect(options).toEqual({
        quiet: false,
        sockPort: '8001',
        noInfo: false,
        lazy: false,
        publicPath: 'http://localhost:8001/dist/',
        stats: 'errors-only',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        hot: true,
      });
    });

    test('listen gets called with the right port', () => {
      watchClientChanges({ ...clientConfig });

      const listenCall = wdsMockInstance.listen.mock.calls[0];
      expect(wdsMockInstance.listen).toBeCalledTimes(1);
      expect(listenCall[0]).toEqual('8001');
      expect(listenCall[1]).toEqual('localhost');
      expect(typeof listenCall[2]).toEqual('function');
    });
  });

  describe('server', () => {
    let mockServerCompiler;

    beforeEach(() => {
      mockServerCompiler = {
        watch: jest.fn(),
      };
      webpack.mockImplementation(() => mockServerCompiler);
      watchServerChanges(serverConfig);
    });

    test('compiler gets created', () => {
      expect(webpack.mock.calls[0][0]).toEqual(serverConfig);
    });

    test('watch options are correct', () => {
      expect(mockServerCompiler.watch.mock.calls[0][0]).toEqual({
        aggregateTimeout: 300,
        poll: true,
      });
    });

    describe('watch', () => {
      let watchCallback;
      let mockServerInitObject;
      let mockSocket;

      beforeEach(() => {
        [[, watchCallback]] = mockServerCompiler.watch.mock.calls;
        mockSocket = {
          destroy: jest.fn(),
        };
        mockServerInitObject = {
          httpServer: {
            close: jest.fn(),
          },
          sockets: {
            values: jest.fn(() => [mockSocket]),
          },
        };
        initHttpServer.mockImplementation(() => mockServerInitObject);
      });

      test('watch callback logs errors', () => {
        watchCallback('some webpack compile error');
        expect(clearRequireCache).not.toHaveBeenCalled();
      });

      test('watch callback clears require cache and initialise http server', () => {
        watchCallback();
        expect(clearRequireCache.mock.calls[0][0]).toEqual('path/to/server/serverBundle.js');
        expect(initHttpServer.mock.calls[0][0]).toEqual('path/to/server/serverBundle.js');
      });

      test('second callback', () => {
        watchCallback();
        watchCallback();

        const serverCloseCallback = mockServerInitObject.httpServer.close.mock.calls[0][0];
        serverCloseCallback();

        expect(initHttpServer).toBeCalledTimes(2);
        expect(mockServerInitObject.httpServer.close).toBeCalledTimes(1);
        expect(mockSocket.destroy).toBeCalledTimes(1);
      });
    });
  });
});
