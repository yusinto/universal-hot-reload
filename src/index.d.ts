// Type definitions for universal-hot-reload 2.0.2
// Project: https://github.com/yusinto/universal-hot-reload
// Definitions by: Yusinto Ngadiman <https://reactjunkie.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.2.2

import { Configuration } from 'webpack';

/**
 * Gets the full webpack dev server url from the supplied client webpack config.
 * The url is constructed from clientConfig.output.publicPath/filename
 *
 * @param clientConfig - The webpack client config containing output path to webpack dev server
 */
export function getDevServerBundleUrl(clientConfig: Configuration): string;

interface UniversalHotReloadConfig {
  serverConfig?: Configuration;
  clientConfig?: Configuration;
}
/**
 * Call this method with your webpack server and client configs in a ts file and run it to get
 * hot reload.
 *
 * @param serverConfig - Your webpack config for the server
 * @param clientConfig - Your webpack config for the client
 */

export default function universalHotReload({ serverConfig, clientConfig }: UniversalHotReloadConfig): void;
