import clearRequireCache from '../src/clearRequireCache';

describe('clearRequireCache', () => {
  it('should delete cache entry if found', () => {
    // arrange
    const testPackage = '../src/getDevServerPort';
    require(testPackage); //eslint-disable-line
    const cachePath = Object.keys(require.cache).find(id => id.includes('getDevServerPort'));

    // act
    clearRequireCache(cachePath);

    // assert
    expect(require.cache[cachePath]).to.be.empty;
  });
});