const UniversalHotReload = require('../../../lib').default;
const serverConfig = require('../../webpack.config.server.js');
const clientConfig = require('../../webpack.config.client.js');
UniversalHotReload({ serverConfig, clientConfig });
