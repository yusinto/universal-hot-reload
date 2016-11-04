require('babel-polyfill');

const universalHotReload = require('../../../lib/index').default;
universalHotReload(require('../../webpack.config.server.js'), require('../../webpack.config.client.js'));