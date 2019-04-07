const BUCKET_URL = process.env.ASSET_URL || 'https://s3.amazonaws.com/nba-streams-bucket';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  target: 'serverless',
  assetPrefix: isProd ? BUCKET_URL : '',
  webpack: (config) => {
    const resConfig = Object.assign({}, config);
    // Fixes npm packages that depend on `fs` module
    resConfig.node = {
      fs: 'empty',
    };

    return resConfig;
  },
};
