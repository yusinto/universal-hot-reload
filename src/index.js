import {join} from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import url from 'url';
import clearRequireCache from './clearRequireCache';
import initHttpServer from './initHttpServer';

/**
 * Watches server for changes, recompile and restart express
 */
const watchServerChanges = (serverConfig) => {
  let initialLoad = true;
  let httpServerInitObject; // contains the httpServer itself and socket references

  const bundlePath = join(serverConfig.output.path, serverConfig.output.filename);
  const serverCompiler = webpack(serverConfig);
  const compilerOptions = {
    aggregateTimeout: 300, // wait so long for more changes
    poll: true, // use polling instead of native watchers
  };

  // compile server side code
  serverCompiler.watch(compilerOptions, (err) => {
    if (err) {
      console.log(`Server bundling error: ${JSON.stringify(err)}`);
      return;
    }

    clearRequireCache(bundlePath);

    if (!initialLoad) {
      httpServerInitObject.httpServer.close(() => {
        httpServerInitObject = initHttpServer(bundlePath);

        if (httpServerInitObject) {
          initialLoad = false;
          console.log(`Server bundled & restarted ${new Date()}`);
        } else {
          // server bundling error has occurred
          initialLoad = true;
        }
      });

      // Destroy all open sockets
      for (const socket of httpServerInitObject.sockets.values()) {
        socket.destroy();
      }
    } else {
      httpServerInitObject = initHttpServer(bundlePath);

      if (httpServerInitObject) {
        initialLoad = false;
        console.log('Server bundled successfully');
      } else {
        // server bundling error has occurred
        initialLoad = true;
      }
    }
  });
};

/**
 * Start webpack dev server for hmr
 */
const watchClientChanges = clientConfig => {
  const port = 3002;
  const basePath = clientConfig.output.publicPath;
  // const serverOptions = {
  //   quiet: false, // don’t output anything to the console.
  //   noInfo: true, // suppress boring information
  //   lazy: false, // no watching, compiles on request
  //   publicPath: basePath,
  //   stats: 'errors-only',
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //   },
  // };

  // const options = {
  //   contentBase: basePath,
  //   // dev: serverOptions,
  //   port,
  //   hot: true,
  //   clientLogLevel: 'none',
  //   noInfo: true,
  // };

  const options = {
    contentBase: basePath,
    hot: true,
    host: 'localhost',
  };

  WebpackDevServer.addDevServerEntrypoints(clientConfig, options);
  const compiler = webpack(clientConfig);
  const server = new WebpackDevServer(compiler, options);

  server.listen(port, options.host, () => {
    console.log(`Wepback dev server listening on ${port}`);
  });
};

const main = (serverConfig, clientConfig) => {
  // Watch changes on the server side, re-compile and restart.
  watchServerChanges(serverConfig);

  // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
  watchClientChanges(clientConfig);
};

export default main;
