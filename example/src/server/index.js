// const UniversalHotReload = require('universal-hot-reload').default;
const UniversalHotReload = require('../../../lib').default;
UniversalHotReload(require('../../webpack.config.server.js'), require('../../webpack.config.client.js'));