// Type definitions for universal-hot-reload 2.0.2
// Project: https://github.com/yusinto/universal-hot-reload
// Definitions by: Yusinto Ngadiman <https://reactjunkie.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.2.2

import { Configuration } from 'webpack';
import { Server } from 'net';

/**
 * Gets the full webpack dev server url from the supplied client webpack config.
 * The url is constructed from clientConfig.output.publicPath/filename
 *
 * @param clientConfig - The webpack client config containing output path to webpack dev server
 */
export function getDevServerBundleUrl(clientConfig: Configuration): string;

/**
 * Use this if you only have server code and don't want to mess around with webpack config.
 * This uses an internal default webpack config to bundle your server code and watch it.
 * Works best for graphql servers or node servers without ssr.
 *
 * @param serverEntryPath - this is the path to your server file where you start your server i.e. app.listen
 */
export function serverHotReload(serverEntryPath: string): void;

interface UniversalHotReloadConfig {
  serverConfig?: Configuration;
  clientConfig?: Configuration;
}

interface UniversalHotReloadHandles {
  server?: Promise<Server>;
  client?: Server;
}
/**
 * Call this method with your webpack server and client configs in a ts file and run it to get
 * hot reload.
 *
 * @param serverConfig - Your webpack config for the server
 * @param clientConfig - Your webpack config for the client
 */

export default function universalHotReload({
  serverConfig,
  clientConfig,
}: UniversalHotReloadConfig): UniversalHotReloadHandles;
