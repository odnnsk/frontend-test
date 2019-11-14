const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

// const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = (PATHS, NODE_ENV) => {
    return [
        {
            test: /\.js$/,
            // exclude: /(node_modules|bower_components)/,
            include: PATHS.source,
            loader: 'babel-loader?cacheDirectory',
        },
        {
            test: /\.pug$/,
            loader: 'pug-loader',
            options: {
                pretty: NODE_ENV === 'development'
            }
        },
        // {
        //     test: /\.css$/,
        //     loader: 'style-loader!css-loader'
        // },
        // MiniCssExtractPlugin
        {
            test: /\.(scss|css)$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: NODE_ENV === 'development',
                        // if hmr does not work, this is a forceful method.
                        reloadAll: true,
                    },
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: NODE_ENV === 'development',
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        autoprefixer: {
                            browsers: ['last 2 versions']
                        },
                        sourceMap: NODE_ENV === 'development',
                        plugins: () => [
                            autoprefixer
                        ]
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: NODE_ENV === 'development'
                    }
                }
            ]
        },
        {
            test: /\.(jpe?g|png|gif|svg|eot|ttf|ico)$/i,
            loader: 'file-loader',
            include: /node_modules/,
            options: {
                regExp: /node_modules(.*)/,
                name: '[1]-[name].[ext]',
                outputPath: 'assets/img/'
            }
        },
        {
            test: /\.(jpe?g|png|gif|svg|eot|ttf|ico)$/i,
            loader: 'file-loader',
            exclude: /node_modules/,
            options: {
                name: '[name].[ext]',
                outputPath: 'assets/img/'
            }
        },
        {
            test: /\.(otf|woff|woff2)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/fonts/'
                    }
                },
            ]
        },
    ];
};
