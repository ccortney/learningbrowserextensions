const webpack = require('webpack'),
    path = require('path'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

// for now just production
process.env.NODE_ENV = 'production'

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
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }, {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: require.resolve('babel-loader')
                    },
                ],
                exclude: /node_modules/
            }, {
                test: /\.png$/,
                type: 'asset/resource',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css']
    },
    plugins: [
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: 'src/manifest.json',
                        to: path.join(__dirname, 'dist'),
                        force: true
                    },
                ]
            }
        ),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: 'src/assets',
                        to: path.join(__dirname, 'dist/assets'),
                        force: true
                    },
                ]
            }
        ),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: 'src/popup/popup.css',
                        to: path.join(__dirname, 'dist'),
                        force: true
                    },
                ]
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: path.join(__dirname, 'src', 'Popup', 'popup.html'),
                filename: 'popup.html',
                chunks: ['popup'],
                cache: false
            }
        ),
    ]
};

module.exports = options;
