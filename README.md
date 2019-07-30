# universal-hot-reload

[![Circle CI](https://img.shields.io/circleci/project/github/yusinto/universal-hot-reload/master.svg?style=for-the-badge&logo=circleci)](https://circleci.com/gh/yusinto/universal-hot-reload)
[![npm version](https://img.shields.io/npm/v/universal-hot-reload.svg?style=for-the-badge)](https://www.npmjs.com/package/universal-hot-reload)
[![npm downloads](https://img.shields.io/npm/dm/universal-hot-reload.svg?style=for-the-badge)](https://www.npmjs.com/package/universal-hot-reload) 
[![npm](https://img.shields.io/npm/dt/universal-hot-reload.svg?style=for-the-badge)](https://www.npmjs.com/package/universal-hot-reload) 
[![npm](https://img.shields.io/npm/l/universal-hot-reload.svg?style=for-the-badge)](https://www.npmjs.com/package/universal-hot-reload) 

> **Hot reload universally bundled webpack apps for the ultimate development experience** :clap:

If you universally bundle your app using webpack (i.e. you use webpack to bundle your server <b>AND</b> client side code) 
this package will set up hot reloading for both server and client side.  

Why use this package?
 * Say goodbye to fumbling around with webpack watch/dev-server/hmr config.
 * Automatic re-bundle on server code changes so server side rendering always reflect the latest changes.
 * Automatic re-bundle on client code changes using webpack-dev-server.
 * Get rid of babel register from your server code!
 * Works with typescript, graphql and nexus.
 * Now supports hot reloading only server code, only client code and of course both client and server code.

<b>This should be used in development only!</b>

## Installation

yarn add universal-hot-reload -D

## Quickstart

In your server entry file, commonly src/server/index.js, do this:

```js
const UniversalHotReload = require('universal-hot-reload').default;
const serverConfig = require('../../webpack.config.server.js');
const clientConfig = require('../../webpack.config.client.js');

UniversalHotReload({ serverConfig, clientConfig });
```

Then run your app:

```json
node src/server/index.js
```

## Advanced
This is rough guide to set up your server and client webpack configs. Follow the lines marked `Important`.

1. Your server webpack config should look like this:
    
    ```js
    const path = require('path');
    const nodeExternals = require('webpack-node-externals');
    
    module.exports = {
      mode: 'development',
      devtool: 'source-map',
      entry: './src/server/server.js',
      target: 'node', // Important
      externals: [nodeExternals()], // Important
      output: {
        path: path.resolve('dist'),
        filename: 'serverBundle.js',
        libraryTarget: 'commonjs2' // Important
      },

      // other standard webpack config like loaders, plugins, etc...
    };
    ```
2. Your client webpack config should look like this:

    ```javascript
    const path = require('path');
    const webpackServeUrl = 'http://localhost:3002';
    
    module.exports = {
      mode: 'development',
      devtool: 'source-map',
      entry: './src/client/index',
      output: {
        path: path.resolve('dist'),
        publicPath: `${webpackServeUrl}/dist/`, // Important: must be full path with trailing slash
        filename: 'bundle.js'
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: path.resolve('src'),
            exclude: /node_modules/,
            options: {
              cacheDirectory: true,
            }
          }]
      },
    };
    ```
3. Your server bootstrap:

    ```javascript
    const UniversalHotReload = require('universal-hot-reload').default;

    // You can provide only a server or a client config or both. 
    const serverConfig = require('../../webpack.config.server.js');
    const clientConfig = require('../../webpack.config.client.js');
 
    UniversalHotReload({ serverConfig, clientConfig });
    ```

4. Lastly in your server entry file:

    ```javascript
    import { getDevServerBundleUrl } from 'universal-hot-reload';
    import webpackClientConfig from 'path/to/webpack.config.client';

    // Important: gets webpack-dev-server url from your client config 
    const devServerBundleUrl = getDevServerBundleUrl(webpackClientConfig);
 
    // Important: feed the url into script src
    const html = `<!DOCTYPE html>
                <html>
                  <body>
                    <div id="reactDiv">${reactString}</div>
                    <script src="${devServerBundleUrl}"></script>
                  </body>
                </html>`;
                
    // Important: the listen method returns a http.server object which must be default exported
    // so universal-hot-reload can access it
    export default app.listen(PORT, () => {
      log.info(`Listening at ${PORT}`);
    });
    ```

5. Run your app!
    
    ```javascript
    node src/server/index.js
    ```

## Example
Check the [example](https://github.com/yusinto/universal-hot-reload/tree/master/example)
for a fully working spa with react and react-router.
