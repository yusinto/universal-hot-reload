import { join } from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import url from 'url';
import clearRequireCache from './clearRequireCache';
import initHttpServer from './initHttpServer';

export const getDevServerBundleUrl = clientConfig => {
  const {
    output: { publicPath, filename },
  } = clientConfig;
  return `${publicPath}${filename}`;
};

/**
 * Watches server for changes, recompile and restart express
 */
export const watchServerChanges = serverConfig => {
  let initialLoad = true;
  let httpServerInitObject; // contains the httpServer itself and socket references

  const bundlePath = join(serverConfig.output.path, serverConfig.output.filename);
  const serverCompiler = webpack(serverConfig);
  const compilerOptions = {
    aggregateTimeout: 300, // wait so long for more changes
    poll: true, // use polling instead of native watchers
  };

  // compile server side code
  serverCompiler.watch(compilerOptions, err => {
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
      // eslint-disable-next-line no-restricted-syntax
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
export const watchClientChanges = clientConfig => {
  const { publicPath } = clientConfig.output;
  const { protocol, host, port } = url.parse(publicPath);
  const webpackDevServerUrl = `${protocol}//${host}`;

  const { entry, plugins } = clientConfig;
  const hmrEntries = [
    `${require.resolve('webpack-dev-server/client/')}?${webpackDevServerUrl}`,
    require.resolve('webpack/hot/dev-server'),
  ];
  if (entry.push) {
    clientConfig.entry = entry.concat(hmrEntries); // eslint-disable-line
  } else {
    clientConfig.entry = [entry, ...hmrEntries]; // eslint-disable-line
  }

  const hmrPlugin = new webpack.HotModuleReplacementPlugin();
  if (!plugins) {
    clientConfig.plugins = [hmrPlugin]; // eslint-disable-line
  } else {
    plugins.push(hmrPlugin);
  }

  const compiler = webpack(clientConfig);
  const devServerOptions = {
    quiet: false, // don’t output anything to the console.
    noInfo: false, // suppress boring information
    lazy: false, // no watching, compiles on request
    publicPath,
    stats: 'errors-only',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
  };

  const server = new webpackDevServer(compiler, devServerOptions);
  server.listen(port, 'localhost', () => {
    console.log(`Starting webpack-dev-server on ${webpackDevServerUrl}`);
  });
};

const main = ({ serverConfig, clientConfig }) => {
  if (clientConfig) {
    // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
    watchClientChanges(clientConfig);
  }

  if (serverConfig) {
    // Watch changes on the server side, re-compile and restart.
    watchServerChanges(serverConfig);
  }
};

export default main;
