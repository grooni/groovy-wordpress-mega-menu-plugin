const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const DEV = process.env.NODE_ENV === 'development';

module.exports = {
  // mode: DEV ? 'development' : 'production',
  mode: 'production',
  devtool: DEV ? 'eval-source-map' : false,
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
    admin: './src/js/admin.js',
    appearance: './src/js/appearance.js',
    dashboard: './src/js/dashboard.js',
    //welcome: './src/js/welcome.js',
    debug: './src/js/debug.js',
    frontend: './src/js/frontend.js',
    integration: './src/js/integration.js',
    preset: './src/js/preset.js',
    preview: './src/js/preview.js',
    styleupdate: './src/js/styleupdate.js',
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
