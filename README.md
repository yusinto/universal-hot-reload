# universal-hot-reload

[![npm version](https://img.shields.io/npm/v/universal-hot-reload.svg?style=flat-square)](https://www.npmjs.com/package/universal-hot-reload) [![npm downloads](https://img.shields.io/npm/dm/universal-hot-reload.svg?style=flat-square)](https://www.npmjs.com/package/universal-hot-reload) [![npm](https://img.shields.io/npm/dt/universal-hot-reload.svg?style=flat-square)](https://www.npmjs.com/package/universal-hot-reload) [![npm](https://img.shields.io/npm/l/universal-hot-reload.svg?style=flat-square)](https://www.npmjs.com/package/universal-hot-reload) 

> **Hot reload universally bundled webpack apps for the ultimate development experience** :clap:

<b>Update 26/3/18: Now works with webpack 4 and babel 7.</b>
<b>FOR DEVELOPMENT USE ONLY!</b>

If you universally bundle your app using webpack (i.e. you use webpack to bundle your server <b>AND</b> client side code) this package will set up hot reloading for both server and client side.  

What you get from this package:

 * Automatic re-bundle on server code changes so server side rendering always reflect the latest changes.
 * Automatic re-bundle on client code changes using webpack-serve.

## Installation

yarn add universal-hot-reload -D

## Quickstart
1. Setup your server bundle webpack config like below. The important parts are:
    * Set target to node.
    * Excluding node_modules from the server bundle by setting externals using webpack-node-externals.
    * Set libraryTarget to commonjs2 which adds module.exports to the beginning of the bundle, so universal-hot-reload can access your app.

    ```javascript
    const webpack = require('webpack');
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
2. Setup your client bundle webpack config like below. Important parts are:
    * In output, publicPath must be the full url to the bundle.

    ```javascript
    const webpack = require('webpack');
    const path = require('path');
    const webpackServeUrl = 'http://localhost:3002';
    
    module.exports = {
      mode: 'development',
      devtool: 'source-map',
      entry: './src/client/index',
      output: {
        path: path.resolve('dist'),
        publicPath: webpackServeUrl + '/dist/', // MUST BE FULL PATH!
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
3. In your server bootstrap, require universal-hot-reload and invoke it, passing it your server and client webpack config objects in that order:

    ```javascript
    const UniversalHotReload = require('universal-hot-reload').default;
   
    UniversalHotReload(require('path/to/webpack.server.config.js'),
                       require('path/to/webpack.client.config.js'));
    ```

4. In your server entry file (as specified in your webpack server config "entry" property):
    * In your html template for server rendering, the script reference to the client bundle should point to webpackServeUrl/dist/bundle.js.
    * You must export your express app so universal-hot-reload can access the http.server object

    ```javascript
    import express from 'express';
    
    const PORT = 3000;
    const app = express();
    app.use('/dist', express.static('dist', {maxAge: '1d'}));

    // ...your other express middleware
    
    // Important: reference webpack dev server for the client bundle
    const html = `<!DOCTYPE html>
                <html>
                  <body>
                    <div id="reactDiv">${reactString}</div>
                    <script src="http://localhost:3002/dist/bundle.js"></script>
                  </body>
                </html>`;
                
    // ... your other code
    
    // Important: the listen method returns a http.server object which must be exported
    const httpServer = app.listen(PORT, () => {
      log.info(`Listening at ${PORT}`);
    });
    
    // export http.server object so universal-hot-reload can access it
    module.exports = httpServer;
    ```

5. Run your app!
    
    ```javascript
    node src/server/index.js
    ```

## Example
Check the [example](https://github.com/yusinto/universal-hot-reload/tree/master/example) for a fully working spa with react, redux and react-router.
