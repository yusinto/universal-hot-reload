import { join } from 'path';
import webpack from 'webpack';
import clearRequireCache from '../utils/clearRequireCache';
import initHttpServer from './initHttpServer';
import generateDefaultConfig from './generateDefaultConfig';

/**
 * Watches server for changes, recompile and restart express
 */
const watchServerChanges = serverConfig => {
  let initialLoad = true;
  let httpServerInitObject; // contains the httpServer itself and socket references

  const bundlePath = join(serverConfig.output.path, serverConfig.output.filename);
  const serverCompiler = webpack(serverConfig);

  // use this to debug
  // const serverCompiler = webpack(serverConfig, (err, stats) => {
  //   if (err || stats.hasErrors()) {
  //     if (err) {
  //       console.error(err.stack || err);
  //       if (err.details) {
  //         console.error(err.details);
  //       }
  //       return;
  //     }
  //     const info = stats.toJson();
  //     if (stats.hasErrors()) {
  //       console.error(info.errors);
  //     }
  //
  //     if (stats.hasWarnings()) {
  //       console.warn(info.warnings);
  //     }
  //   }
  // });

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

export const watchServerChangesWithDefaultConfig = serverEntryPath => {
  const defaultConfig = generateDefaultConfig(serverEntryPath);
  watchServerChanges(defaultConfig);
};

export default watchServerChanges;
