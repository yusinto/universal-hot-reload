const universalHotReload = require('universal-hot-reload').default;
universalHotReload(require('../../webpack.config.server.js'), require('../../webpack.config.client.js'));