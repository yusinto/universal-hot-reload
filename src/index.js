import watchClientChanges from './client/watchClientChanges';
import watchServerChanges, { watchServerChangesWithDefaultConfig } from './server/watchServerChanges';
import getDevServerUrl from './utils/getDevServerBundleUrl';

export const getDevServerBundleUrl = getDevServerUrl;

const main = ({ serverConfig, clientConfig, devServerOptions = {}, verbose = true }) => {
  if (clientConfig) {
    // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
    watchClientChanges(clientConfig, devServerOptions, verbose);
  }

  if (serverConfig) {
    // Watch changes on the server side, re-compile and restart.
    watchServerChanges(serverConfig, verbose);
  }
};

export const serverHotReload = (serverEntryPath, verbose = true) => {
  watchServerChangesWithDefaultConfig(serverEntryPath, verbose);
};

export default main;
