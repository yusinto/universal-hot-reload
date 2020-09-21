import watchClientChanges from './client/watchClientChanges';
import watchServerChanges, { watchServerChangesWithDefaultConfig } from './server/watchServerChanges';
import getDevServerUrl from './utils/getDevServerBundleUrl';

export const getDevServerBundleUrl = getDevServerUrl;

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

export const serverHotReload = (serverEntryPath) => {
  watchServerChangesWithDefaultConfig(serverEntryPath);
};

export default main;
