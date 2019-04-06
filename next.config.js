module.exports = {
  target: 'serverless',
  webpack: (config) => {
    const resConfig = Object.assign({}, config);
    // Fixes npm packages that depend on `fs` module
    resConfig.node = {
      fs: 'empty',
    };

    return resConfig;
  },
};
