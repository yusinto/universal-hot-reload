'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extract the port number on which webpack dev server is running from a given client config.
 * @param clientConfig This is the webpack client config which must have an entry array containing webpack-dev-server
 * configuration
 * @returns {Function|string} Port number on which webpack dev server is running on
 */
var getDevServerPort = function getDevServerPort(clientConfig) {
  var webpackClientConfigError = void 0;

  var devServerEntry = clientConfig.entry.find(function (entry) {
    return entry.startsWith('webpack-dev-server');
  });

  if (!devServerEntry) {
    webpackClientConfigError = 'webpack-dev-server has not been configured correctly in your client webpack config. In the "entry" array you need to add "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';
  } else {
    var entryTokens = devServerEntry.split('webpack-dev-server/client?');

    if (entryTokens.length < 2) {
      webpackClientConfigError = 'Your webpack-dev-server entry must be in the format of "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';
    } else {
      var devServerUrl = entryTokens.pop();
      var urlObject = _url2.default.parse(devServerUrl);
      var devServerPort = urlObject.port;

      if (!devServerPort) {
        webpackClientConfigError = 'You need to specify a port for webpack-dev-server. In the "entry" array, make sure there is an entry that looks like "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';
      } else {
        return devServerPort;
      }
    }
  }

  console.error(webpackClientConfigError);
  throw webpackClientConfigError;
};

exports.default = getDevServerPort;