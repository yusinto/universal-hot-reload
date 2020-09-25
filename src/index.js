import watchClientChanges from './client/watchClientChanges';
import watchServerChanges, { watchServerChangesWithDefaultConfig } from './server/watchServerChanges';
import getDevServerUrl from './utils/getDevServerBundleUrl';

export const getDevServerBundleUrl = getDevServerUrl;

const main = ({ serverConfig, clientConfig }) => {
  // Universal app
  if (clientConfig && serverConfig) {
    // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
    // Requires that the client completely fully started the dev server before starting the server
    watchClientChanges(clientConfig, () => {
      // Once the client has fully started, watch changes on the server side, re-compile and restart.
      watchServerChanges(serverConfig);
    });
  }

  // Non-universal app
  else {
    if (clientConfig) {
      // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
      watchClientChanges(clientConfig);
    } else if (serverConfig) {
      // Watch changes on the server side, re-compile and restart.
      watchServerChanges(serverConfig);
    }
  }
};

export const serverHotReload = (serverEntryPath) => {
  watchServerChangesWithDefaultConfig(serverEntryPath);
};

export default main;
