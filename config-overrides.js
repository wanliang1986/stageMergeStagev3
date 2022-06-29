const { override, addLessLoader } = require('customize-cra');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = override(
  addLessLoader({
    javascriptEnabled: true
    // modifyVars: { '@base-color': '#f44336', '@button-ripple': false }
  }),
  (config) => {
    return {
      ...config,
      optimization: {
        ...config.optimization,
        minimizer: [
          new TerserPlugin({ parallel: 2 }),
          config.optimization.minimizer[1]
        ],
        splitChunks: {
          chunks: 'all',
          name: false,
          minSize: 20000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }
    };
  }
);
