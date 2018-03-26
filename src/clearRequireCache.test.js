// import clearRequireCache from './clearRequireCache';

describe('clearRequireCache', () => {
  test('should delete cache entry if found', () => {
    // arrange
    // const testPackage = './getDevServerPort';
    require('./clearRequireCache'); //eslint-disable-line

    // Object.keys(require.cache).forEach(c => console.log(`found: ${c}`));

    const ab = Object.keys(require.cache);
    console.log(`ab: ${ab.length}`);
    // act
    // clearRequireCache(cachePath);

    // TODO: require.cache seems to ALWAYS be undefined for some reason..
    // assert
    expect(require.cache).toEqual({});
  });
});