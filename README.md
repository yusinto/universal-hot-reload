# universal-hot-reload

[![Circle CI](https://img.shields.io/circleci/project/github/yusinto/universal-hot-reload/master.svg?style=for-the-badge&logo=circleci)](https://circleci.com/gh/yusinto/universal-hot-reload)
[![npm version](https://img.shields.io/npm/v/universal-hot-reload.svg?style=for-the-badge)](https://www.npmjs.com/package/universal-hot-reload)
[![npm downloads](https://img.shields.io/npm/dm/universal-hot-reload.svg?style=for-the-badge)](https://www.npmjs.com/package/universal-hot-reload) 
[![npm](https://img.shields.io/npm/dt/universal-hot-reload.svg?style=for-the-badge)](https://www.npmjs.com/package/universal-hot-reload) 
[![npm](https://img.shields.io/npm/l/universal-hot-reload.svg?style=for-the-badge)](https://www.npmjs.com/package/universal-hot-reload) 

> **Easily hot reload your server, client or universal apps** :clap:

Why this package?
 * Setup hot reload for your app in four lines of code or less.
 * Supports server, client and universal hot reloads!
 * Works with react, typescript, graphql and nexus.

<b>This should be used in development only!</b>

## Installation

yarn add universal-hot-reload -D

## Quickstart: server only
To hot reload graphql servers and express servers without ssr, 
create index.js and server.js like below. For graphql, only `express-graphql` 
and `apollo-server` are supported for now.

#### index.js

```js
const { serverHotReload } = require('universal-hot-reload');

// server.js is where you export your http.server instance (see below) 
serverHotReload(require.resolve('./server.js'));
```

#### server.js
```js
// You'll need to export default an instance of http.server so universal-hot-reload
// can restart your server when changes are detected.

// For express or express-graphql
export default app.listen(PORT, () => console.log(`Listening at ${PORT}`));

// For apollo-server
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(() => console.log(`Listening at ${PORT}`));
export default server.httpServer;
```

Run your app:
```bash
node index.js
```

### Quickstart: universal apps
To hot reload a universal app, create index.js like below and follow the same 
steps as [Quickstart: server only](#quickstart-server-only).
 
#### index.js

```js
const UniversalHotReload = require('universal-hot-reload').default;

// supply your own webpack configs
const serverConfig = require('../webpack.config.server.js');
const clientConfig = require('../webpack.config.client.js');

// the configs are optional, you can supply either one or both.
// if you omit a config, then your app won't hot reload.
UniversalHotReload({ serverConfig, clientConfig });
```

## Advanced
If you use the `serverHotReload` function then you won't need to supply your own server webpack config. `universal-hot-reload`
uses a default server webpack config so you don't have to supply your own.

If you want to use your own custom server webpack config or if you want to hot reload your universal app,
then you'll need to supply your own webpack configs. Follow the lines marked `Important`.

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

      // other webpack config
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
3. Your `index.js`:

    ```javascript
    const UniversalHotReload = require('universal-hot-reload').default;

    // You can provide only a server or a client config or both. 
    const serverConfig = require('../webpack.config.server.js');
    const clientConfig = require('../webpack.config.client.js');
 
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
    node index.js
    ```

## Examples
For graphql, check this [example](https://github.com/yusinto/universal-hot-reload/tree/master/examples/ts) with nexus, 
apollo server and typescript. Only `express-graphql` and `apollo-server` are supported right now. `graphql-yoga`
does not expose its `http.server` instance and so it's not hot-reloadable this way for now.

For universal webpack apps, check the react [example](https://github.com/yusinto/universal-hot-reload/tree/master/examples/js)
for a fully working spa with react and react-router.
