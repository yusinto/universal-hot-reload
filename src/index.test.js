jest.mock('webpack', () => jest.fn());
jest.mock('./clearRequireCache', () => jest.fn());
jest.mock('./initHttpServer', () => jest.fn());

import webpack from 'webpack';
import clearRequireCache from './clearRequireCache';
import { getDevServerBundleUrl, watchServerChanges } from './index';
import initHttpServer from './initHttpServer';

const clientConfig = {
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
  let mockServerCompiler;
  beforeEach(() => {
    mockServerCompiler = {
      watch: jest.fn(),
    };
    webpack.mockImplementation(() => mockServerCompiler);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getDevServerBundleUrl', () => {
    const result = getDevServerBundleUrl(clientConfig);
    expect(result).toEqual('http://localhost:8001/dist/bundle.js');
  });

  describe('server', () => {
    beforeEach(() => {
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
        watchCallback = mockServerCompiler.watch.mock.calls[0][1];
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
