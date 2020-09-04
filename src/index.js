import watchClientChanges from './client/watchClientChanges';
import watchServerChanges, { watchServerChangesWithDefaultConfig } from './server/watchServerChanges';
import getDevServerUrl from './utils/getDevServerBundleUrl';

export const getDevServerBundleUrl = getDevServerUrl;

const main = ({ serverConfig, clientConfig }) => {
  const handles = {};

  if (clientConfig) {
    // Start webpack dev server separately on a different port to avoid issues with httpServer restarts
    handles.client = watchClientChanges(clientConfig);
  }

  if (serverConfig) {
    // Watch changes on the server side, re-compile and restart.
    handles.server = watchServerChanges(serverConfig);
  }

  return handles;
};

export const serverHotReload = serverEntryPath => {
  return watchServerChangesWithDefaultConfig(serverEntryPath);
};

export default main;
