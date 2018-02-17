import clearRequireCache from './clearRequireCache';

describe('clearRequireCache', () => {
  it.skip('should delete cache entry if found', () => {
    // arrange
    const testPackage = './getDevServerPort';
    require(testPackage); //eslint-disable-line
    const cachePath = Object.keys(require.cache).find(id => id.includes('getDevServerPort'));

    // act
    clearRequireCache(cachePath);

    // TODO: require.cache seems to ALWAYS be undefined for some reason..
    // assert
    expect(require.cache[cachePath]).toEqual({});
  });
});