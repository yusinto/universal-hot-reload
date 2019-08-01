const getDevServerBundleUrl = clientConfig => {
  const {
    output: { publicPath, filename },
  } = clientConfig;
  return `${publicPath}${filename}`;
};

export default getDevServerBundleUrl;
