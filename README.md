# universal-hot-reload

[![npm version](https://img.shields.io/npm/v/universal-hot-reload.svg?style=flat-square)](https://www.npmjs.com/package/universal-hot-reload) [![npm downloads](https://img.shields.io/npm/dm/universal-hot-reload.svg?style=flat-square)](https://www.npmjs.com/package/universal-hot-reload) [![npm](https://img.shields.io/npm/dt/universal-hot-reload.svg?style=flat-square)](https://www.npmjs.com/package/universal-hot-reload) [![npm](https://img.shields.io/npm/l/universal-hot-reload.svg?style=flat-square)](https://www.npmjs.com/package/universal-hot-reload) 

> **Hot reload server and client webpack bundles for the ultimate development experience** :clap:

<b>FOR DEVELOPMENT USE ONLY!</b>

If you use webpack to bundle your app <b>BOTH</b> on the server <b>AND</b> the client side, this package will set up hot reloading for both the server and the client side.  

What you get from this package:

 * Automatic re-bundle of server app on server changes
 * Automatic re-bundle of client app on client changes using webpack-dev-server and webpack HotModuleReplacementPlugin

## Installation

npm i --save universal-hot-reload

## Quickstart

1. In your server bootstrap, require universal-hot-reload and invoke it in development, passing it your server and client webpack config in that order. I use the config npm package to store all my app config:

    ```javascript
    require('babel-polyfill');
    const config = require('config');
    const universalHotReload = require('universal-hot-reload');
    
    if (config.appEnv === 'development') {
      universalHotReload('path/to/webpack.server.config.js', 'path/to/webpack.client.config.js');
    } else {
      // PROD
      require('/path/to/serverBundle.js'); // eslint-disable-line import/no-unresolved
    }

    ```

2. In your server entry file (as specified in your webpack server config "entry" property), you need to export your express app (in the form of a httpServer object):

    ```javascript
    import config from 'config';
    import express from 'express';
    
    const app = express();
    app.use('/dist', express.static('dist', {maxAge: '1d'}));

    // ...your other express middleware
    
    const httpServer = app.listen(config.port, () => {
      log.info(`Listening at ${config.port}`);
    });
    
    // export httpServer object so universal-hot-reload can access it
    if(config.appEnv === 'development') {
      module.exports = httpServer;
    }

    ```

3. Run your app:
    
    ```javascript
    node path/to/serverBootstrap.js
    ```

## Example
Coming soon 