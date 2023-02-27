const webpack = require('webpack'),
  path = require('path'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';
process.env.NODE_ENV =  'production'

const options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: path.join(__dirname, 'src', 'popup', 'popup.js'),
    background: path.join(__dirname, 'src', 'background', 'background.js'),
    firebase_app: path.join(__dirname, 'src', 'firebase', 'firebase-app.js'),
    firebase_firestore: path.join(__dirname, 'src', 'firebase', 'firebase-firestore.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.css'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'dist'),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'Popup', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false,
    }),
  ].filter(Boolean),
  infrastructureLogging: {
    level: 'info',
  },
};

module.exports = options;