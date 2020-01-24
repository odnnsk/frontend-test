'use strict';

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const rules = require('./webpack.config.rules');

const NODE_ENV = process.env.NODE_ENV || 'development';

const PATHS = {
    source: path.join(__dirname, 'source'),
    build: path.join(__dirname, 'dist')
};

const conf = {
    // context: path.join(__dirname, 'source'),
    devServer: {
        // index: 'index.html',
        host: 'localhost',
        contentBase: PATHS.build,
        port: 3000,
        compress: true
    },
    entry: {
        app: `${PATHS.source}/js/app`,
        // home: '.home'//second entry point
    },
    output: {
        path: PATHS.build,
        publicPath: '/',
        filename: NODE_ENV === 'development' ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js', // different js for each entry point
        library: '[name]'// different library for each entry point
    },
    // watch: NODE_ENV === 'development',
    // watchOptions: {
    //     aggregateTimeout: 100
    // },
    devtool: NODE_ENV === 'development' ? 'inline-cheap-module-source-map' : false, // eval by default in development mode
    module: {
        rules: rules(PATHS, NODE_ENV),
        noParse: /jquery|lodash/, // boost build. parse libs no needed if no dependencies
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: NODE_ENV === 'development' ? 'assets/css/[name].css' : 'assets/css/[name].[hash].css',
            chunkFilename: 'assets/css/[name].css'
        }),
        new HtmlPlugin({
            alwaysWriteToDisk: true,
            title: 'Webpack App',
            template: path.join(PATHS.source, 'pages', 'index.html'),
            filename: 'index.html',
            minify: NODE_ENV === 'development' ? false : {
                collapseWhitespace: false,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
            // chunks: ['main'],
        }),
        new HtmlWebpackHarddiskPlugin(),
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        NODE_ENV !== 'development' ? new CleanWebpackPlugin() : () => {},
        new CopyWebpackPlugin([
            {
                from: `${PATHS.source}/fonts`,
                to: `${PATHS.build}/assets/fonts`
            },
            {
                from: `${PATHS.source}/images`,
                to: `${PATHS.build}/assets/img`
            }
        ]),
        NODE_ENV !== 'development' ? new ImageminPlugin(
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/i,
                pngquant: {
                    quality: '90'
                },
                // optipng: {
                //     optimizationLevel: 7
                // },
                plugins: [
                    imageminMozjpeg({
                        quality: 90,
                        progressive: true
                    })
                ]
            }
        ) : () => {},
        // new webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                // sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
        ],
        splitChunks: {
            // chunks: "all",
            // minSize: 1,
            // minChunks: 2,
            // automaticNameDelimiter: '~',
            // name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: -10
                },
                // default: {
                //     minChunks: 2,
                //     priority: -20,
                //     reuseExistingChunk: true
                // }
            }
        }
    },
};

module.exports = conf;