const { VueLoaderPlugin } = require("vue-loader");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const path = require("path");
const webpack = require('webpack');
const dotenv = require('dotenv').config( {
    path: path.join(__dirname, '.env')
} );


module.exports = {
    entry: {
        main: "./src/main.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: "file-loader",
                options: {
                    name: "[name][contenthash:8].[ext]",
                },
            },
            {
                test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
                loader: "file-loader",
                options: {
                    outputPath: "assets",
                    esModule: false,
                },
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            //plugins: () => [autoprefixer()],
                            postcssOptions:  { plugins: () => [autoprefixer()] }
                        },
                    },
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html"),
            favicon: "./public/favicon.ico",
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin( {
            "process.env": dotenv.parsed
        } ),
    ],
    resolve: {
        alias: {
            vue$: "vue/dist/vue.runtime.esm.js",
        },
        extensions: ["*", ".js", ".vue", ".json"],
    },
};
