const UniversalHotReload = require('../../../lib').default;
UniversalHotReload(require('../../webpack.config.server.js'), require('../../webpack.config.client.js'));
