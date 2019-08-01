/**
 * Clear bundled server cache
 * @param serverBundlePath Path to the server bundle file.
 */
const clearRequireCache = serverBundlePath => {
  const cacheIds = Object.keys(require.cache);

  // eslint-disable-next-line no-restricted-syntax
  for (const id of cacheIds) {
    if (id === serverBundlePath) {
      delete require.cache[id];
      return;
    }
  }
};

export default clearRequireCache;
