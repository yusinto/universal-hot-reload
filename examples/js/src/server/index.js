const UniversalHotReload = require('universal-hot-reload').default;
const serverConfig = require('../../webpack.config.server.js');
const clientConfig = require('../../webpack.config.client.js');

UniversalHotReload({ serverConfig, clientConfig });
