const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  devtool: false,
  entry: [
    './app/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index[hash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.js(x)?$/,
      use: 'babel-loader',
      exclude: /(node_modules|bower_components)/,
    }, {
      test: /\.(css)$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }],
    }, {
      test: /\.(svg|jpg|png)$/,
      exclude: /(node_modules)/,
      use: 'file-loader',
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};
