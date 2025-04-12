// webpack.config.js
module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      
      // Your before middleware logic
      // ...
      
      // Then push your custom middlewares
      middlewares.push({
        name: 'custom-middleware',
        path: '/api',
        middleware: (req, res) => {
          // your middleware logic
        }
      });
      
      return middlewares;
    }
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      "react/jsx-runtime": require.resolve("react/jsx-runtime"),
    },
  },
  
  // Find the source-map-loader rule and modify it:
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  enforce: 'pre',
  use: [
    {
      options: {
        filterSourceMappingUrl: (url, resourcePath) => {
          // Exclude stylis-plugin-rtl from source map processing
          if (resourcePath.includes('stylis-plugin-rtl')) {
            return false;
          }
          return true;
        }
      },
      loader: require.resolve('source-map-loader'),
    },
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader",
        exclude: [/node_modules\/stylis-plugin-rtl/],
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/, /stylis-plugin-rtl/],
};
