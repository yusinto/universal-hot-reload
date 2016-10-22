const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const url = require('url');

module.exports = function main(serverConfig, clientConfig) {
  // Watch changes on the server side, re-compile and restart.
  watchServerChanges(serverConfig);

  // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
  watchClientChanges(clientConfig);

  /**
   * Clear bundled server cache
   * @param serverBundlePath Path to the server bundle file.
   */
  function clearCache(serverBundlePath) {
    const cacheIds = Object.keys(require.cache);
    for(let id of cacheIds) {
      if (id === serverBundlePath) {
        delete require.cache[id];
        return;
      }
    }
  }

  function getDevServerPortNumber(clientConfig) {
    let webpackClientConfigError;

    const devServerEntry = clientConfig.entry.find(function (entry) {
      return entry.startsWith('webpack-dev-server');
    });

    if (!devServerEntry) {
      webpackClientConfigError = 'webpack-dev-server has not been configured correctly in your client webpack config. In the "entry" array you need to add "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';
    } else {
      const entryTokens = devServerEntry.split('webpack-dev-server/client?');

      if(entryTokens.length < 2) {
        webpackClientConfigError = 'Your webpack-dev-server entry must be in the format of "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';
      } else {
        const devServerUrl = entryTokens.pop();
        const urlObject = url.parse(devServerUrl);
        const devServerPort = urlObject.port;

        if(!devServerPort) {
          webpackClientConfigError = 'You need to specify a port for webpack-dev-server. In the "entry" array, make sure there is an entry that looks like "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';
        } else {
          return devServerPort;
        }
      }
    }

    console.error(webpackClientConfigError);
    throw webpackClientConfigError;
  }

  /**
   * Starts express, caches and deletes sockets. Returns the httpServer object and all sockets in a Map.
   * @param serverBundlePath Path to the server bundle file.
   * @returns {{httpServer: *, sockets: Map}}
   */
  function initHttpServer(serverBundlePath) {
    const httpServer = require(serverBundlePath);
    const sockets = new Map();
    let nextSocketId = 0;

    // http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately
    httpServer.on('connection', function (socket) {
      var socketId = nextSocketId++;
      sockets.set(socketId, socket);

      socket.on('close', function () {
        sockets.delete(socketId);
      });
    });

    return {httpServer, sockets};
  }

  /**
   * Watches server for changes, recompile and restart express
   */
  function watchServerChanges(serverConfig) {
    let initialLoad = true;
    let httpServerInitObject; // contains the httpServer itself and sockets

    const bundlePath = serverConfig.output.path + '/' + serverConfig.output.filename;
    const serverCompiler = webpack(serverConfig);
    const compilerOptions = {
      aggregateTimeout: 300, // wait so long for more changes
      poll: true // use polling instead of native watchers
    };

    // compile server side code
    serverCompiler.watch(compilerOptions, function onServerChange(err, stats) {
      if (err) {
        console.log('Server bundling error:' + JSON.stringify(err));
        return;
      }

      clearCache(bundlePath);

      if (!initialLoad) {
        httpServerInitObject.httpServer.close(function () {
          httpServerInitObject = initHttpServer(bundlePath);
          console.log('Server restarted ' + new Date());
        });

        // Destroy all open sockets
        for (var socket of httpServerInitObject.sockets.values()) {
          socket.destroy();
        }
      } else {
        initialLoad = false;
        httpServerInitObject = initHttpServer(bundlePath);
        console.log('Server bundling done');
      }
    });
  }

  /**
   * Start webpack dev server for hmr
   */
  function watchClientChanges(clientConfig) {
    const devServerPort = getDevServerPortNumber(clientConfig);
    const basePath = clientConfig.output.publicPath;

    const serverOptions = {
      quiet: false, // don’t output anything to the console.
      noInfo: true, // suppress boring information
      hot: true, // switch the server to hot mode.
      inline: true, // embed the webpack-dev-server runtime into the bundle.
      lazy: false, // no watching, compiles on request
      contentBase: basePath, // base path for the content
      publicPath: basePath,
      stats: true,
    };
    const devCompiler = webpack(clientConfig);
    const devServer = new WebpackDevServer(devCompiler, serverOptions);
    devServer.listen(devServerPort, 'localhost', console.log(`weback-dev-server listening at ${devServerPort}`));
  }
};
