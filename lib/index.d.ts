// Type definitions for universal-hot-reload 2.0.2
// Project: https://github.com/yusinto/universal-hot-reload
// Definitions by: Yusinto Ngadiman <https://reactjunkie.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.2.2

import { Configuration } from 'webpack';

export function getDevServerBundleUrl(clientConfig: Configuration): string;

export default function universalHotReload(serverConfig: Configuration, clientConfig: Configuration): void;
