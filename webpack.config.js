const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const DEV = process.env.NODE_ENV === 'development';

module.exports = {
  // mode: DEV ? 'development' : 'production',
  mode: 'production',
  // devtool: 'eval-source-map',
  // optimization: {
  //   minimize: false,
  //   // minimizer: [
  //   //   new UglifyJsPlugin({
  //   //     uglifyOptions: {
  //   //       mangle: false,
  //   //       compress: false,
  //   //       output: {
  //   //         comments: true,
  //   //         beautify: true,
  //   //       }
  //   //     }
  //   //   })
  //   // ],
  // },
  entry: {
    frontend: './src/js/frontend.js',
    admin: './src/js/admin.js',
    preview: './src/js/preview.js',
    preset: './src/js/preset.js',
    dashboard: './src/js/dashboard.js',
    welcome: './src/js/welcome.js',
    appearance: './src/js/appearance.js',
    integration: './src/js/integration.js',
    debug: './src/js/debug.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'groovy-menu/assets/js')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
