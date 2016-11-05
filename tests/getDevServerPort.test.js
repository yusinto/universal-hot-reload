import getDevServerPort from '../src/getDevServerPort';

describe('getDevServerPort', () => {
  it('should throw an exception if config entry does not contain webpack-dev-sever config', () => {
    // arrange
    const mockClientConfig = {
      devtool: 'cheap-module-inline-source-map',
      entry: [
        'babel-polyfill',
        './src/client/index'
      ],
    };
    const expectedErrorMessage = 'webpack-dev-server has not been configured correctly in your client webpack config. In the "entry" array you need to add "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';

    // act
    const act = () => getDevServerPort(mockClientConfig);

    // assert
    expect(act).to.throw(expectedErrorMessage);
  });

  it('should throw an exception if config entry is the wrong format', () => {
    // arrange
    const webpackDevServerUrl = 'http://localhost:8001';
    const mockClientConfig = {
      devtool: 'cheap-module-inline-source-map',
      entry: [
        'babel-polyfill',
        'webpack-dev-server/client' + webpackDevServerUrl,
        './src/client/index'
      ],
    };
    const expectedErrorMessage = 'Your webpack-dev-server entry must be in the format of "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';

    // act
    const act = () => getDevServerPort(mockClientConfig);

    // assert
    expect(act).to.throw(expectedErrorMessage);
  });

  it('should throw an exception if config entry is the wrong format', () => {
    // arrange
    const webpackDevServerUrl = 'http://localhost';
    const mockClientConfig = {
      devtool: 'cheap-module-inline-source-map',
      entry: [
        'babel-polyfill',
        'webpack-dev-server/client?' + webpackDevServerUrl,
        './src/client/index'
      ],
    };
    const expectedErrorMessage = 'You need to specify a port for webpack-dev-server. In the "entry" array, make sure there is an entry that looks like "webpack-dev-server/client?DEV_SERVER_URL" where DEV_SERVER_URL is in the format of http://localhost:PORT';

    // act
    const act = () => getDevServerPort(mockClientConfig);

    // assert
    expect(act).to.throw(expectedErrorMessage);
  });

  it('should return port if configured correctly', () => {
    // arrange
    const webpackDevServerUrl = 'http://localhost:8001';
    const mockClientConfig = {
      devtool: 'cheap-module-inline-source-map',
      entry: [
        'babel-polyfill',
        'webpack-dev-server/client?' + webpackDevServerUrl,
        './src/client/index'
      ],
    };

    // act
    const port = getDevServerPort(mockClientConfig);

    // assert
    expect(port).to.eq('8001');
  });
});