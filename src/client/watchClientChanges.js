import url from 'url';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';

/**
 * Start webpack dev server for hmr
 */
const watchClientChanges = (clientConfig) => {
  const clonedClientConfig = { ...clientConfig };
  const { devServer = {} } = clonedClientConfig;

  const { publicPath } = clonedClientConfig.output;
  const { protocol, host, port } = url.parse(publicPath);
  const webpackDevServerUrl = `${protocol}//${host}`;

  const devServerOptions = {
    quiet: true, // don’t output anything to the console.
    noInfo: true, // suppress boring information
    lazy: false, // no watching, compiles on request
    publicPath,
    stats: 'errors-only',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    sockPort: port,
    ...devServer, // Add any overrides here
  };

  webpackDevServer.addDevServerEntrypoints(clonedClientConfig, devServerOptions);
  const compiler = webpack(clonedClientConfig);

  const server = new webpackDevServer(compiler, devServerOptions);
  server.listen(port, 'localhost', () => {
    console.log(`Starting webpack-dev-server on ${webpackDevServerUrl}`);
  });
};

export default watchClientChanges;
