module.exports = function main(serverConfigPath, clientConfigPath, devServerPort) {
  const webpack = require('webpack');
  const serverConfig = require(serverConfigPath);
  const clientConfig = require(clientConfigPath);

  if (typeof devServerPort === 'undefined' || !devServerPort) {
    devServerPort = 8001;
  }

  // Watch changes on the server side, re-compile and restart.
  watchServerChanges(serverConfig);

  // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
  watchClientChanges(clientConfig);

  /**
   * Clear bundled server cache
   * @param serverBundlePath Path to the server bundle file.
   */
  function clearCache(serverBundlePath) {
    Object.keys(require.cache).forEach(function (id) {
      if (id === serverBundlePath) {
        delete require.cache[id];
      }
    });
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

      socket.setTimeout(0);
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

    // compile server side code
    serverCompiler.watch({
      aggregateTimeout: 300, // wait so long for more changes
      poll: true // use polling instead of native watchers
    }, function (err, stats) {
      if (err) {
        console.log('Server bundling error:' + JSON.stringify(err));
        return;
      }

      clearCache(bundlePath);

      if (!initialLoad) {
        httpServerInitObject.httpServer.close(function () {
          httpServerInitObject = initHttpServer(bundlePath);
          console.log('Server restarted');
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
    const WebpackDevServer = require('webpack-dev-server');
    const serverOptions = {
      quiet: false, // don’t output anything to the console.
      noInfo: true, // suppress boring information
      hot: true, // switch the server to hot mode.
      inline: true, // embed th
      // e webpack-dev-server runtime into the bundle.
      lazy: false, // no watching, compiles on request
      contentBase: clientConfig.output.publicPath, // base path for the content.
      publicPath: clientConfig.output.publicPath, // `http://localhost:8001/dist`
      stats: true,
    };
    const devCompiler = webpack(clientConfig);
    const devServer = new WebpackDevServer(devCompiler, serverOptions);
    devServer.listen(devServerPort, 'localhost', console.log(`weback-dev-server listening at ${devServerPort}`));
  }
};
