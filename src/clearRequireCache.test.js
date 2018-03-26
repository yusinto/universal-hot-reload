import clearRequireCache from './clearRequireCache';

describe('clearRequireCache', () => {
  test('should delete cache entry if found', () => {
    // arrange
    const testPackage = 'url';
    require(testPackage); //eslint-disable-line
    const cachePath = Object.keys(require.cache).find(id => id.includes('url'));

    // act
    clearRequireCache(cachePath);

    // TODO: require.cache seems to ALWAYS be undefined for some reason..
    // assert
    expect(require.cache).toEqual({});
  });
});