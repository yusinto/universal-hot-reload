require('babel-polyfill');

const universalHotReload = require('../../../index');
universalHotReload(require('../../webpack.config.server.js'), require('../../webpack.config.client.js'));
