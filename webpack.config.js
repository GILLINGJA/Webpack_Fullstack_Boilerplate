const path = require('path');
// Loads template at public/index.html and injects the output webpack bundle
const HtmlWebpackPlugin = require('html-webpack-plugin');
// removes build folder(s) before building
const CleanWebpackPlugin = require('clean-webpack-plugin');
// Used to extract css from being bundled with js files (for production only as it slows build process)
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const outputDirectory = 'dist';

module.exports = {
  entry: ['babel-polyfill', 'src/client/index.js'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: isDevelopment ? 'bundle.js' : 'bundle.[hash].js'
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }),
    // hashing production files allows cache busting (telling the browser to replace outdated cached bundles with the newer bundles)
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
    })
  ],
  module: {
    rules: [
      // for js/jsx files - babel-loader for transpiling ES6 > ES5
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // for module sass/scss files
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
              camelCase: true,
              sourceMap: isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      // for global sass/scss files
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module\.s(a|c)ss$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      }
    ]
  },
  // allow webpack to resolve imports of the following filetypes without having to specify extensions
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },
  // configuration for webpack-dev-server
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api' : 'http://localhost:8080'
    }
  }
};