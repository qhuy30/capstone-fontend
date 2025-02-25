const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

var config = {

};
var frameCofig = Object.assign({}, config, {
    name: "frame",
    mode: 'production',
    entry: "./webpack/frame.js",
    output: {
        path: __dirname + "/public/",
        filename: "frame.min.js"
    },
    watch: true
});

var style_config = Object.assign({}, config, {
    name: "style",
    mode: 'production',
    entry: "./webpack/style.js",
    output: {
        path: __dirname + "/public/datasources/css/",
        filename: "style.min.js"
    },
    module: {
        rules: [
            {
                test: /\.(css|eot|woff|woff2|ttf|svg|png|jpg|scss|sass)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader","resolve-url-loader","sass-loader"]
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new MiniCssExtractPlugin({ filename: "style.min.css" }),
        new FixStyleOnlyEntriesPlugin(),
        new OptimizeCSSAssetsPlugin({})
    ],
    watch: true
});
var style_Part1_Cofig = Object.assign({}, config, {
    name: "style1",
    mode: 'production',
    entry: "./webpack/style_part1.js",
    output: {
        path: __dirname + "/public/datasources/css/",
        filename: "style_part1.min.js"
    },
    module: {
        rules: [
            {
                test: /\.(css|eot|woff|woff2|ttf|svg|png|jpg)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader","resolve-url-loader"]
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new MiniCssExtractPlugin({ filename: "style_part1.min.css" }),
        new FixStyleOnlyEntriesPlugin(),
        new OptimizeCSSAssetsPlugin({})
    ],
    watch: true
});

var style_Part2_Cofig = Object.assign({}, config, {
    name: "style2",
    mode: 'production',
    entry: "./webpack/style_part2.js",
    output: {
        path: __dirname + "/public/datasources/css/",
        filename: "style_part2.min.js"
    },
    module: {
        rules: [
            {
                test: /\.(css|eot|woff|woff2|ttf|svg|png|jpg)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader","resolve-url-loader"]
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new MiniCssExtractPlugin({ filename: "style_part2.min.css" }),
        new FixStyleOnlyEntriesPlugin(),
        new OptimizeCSSAssetsPlugin({})
    ],
    watch: true
});

var style_Part3_Cofig = Object.assign({}, config, {
    name: "style3",
    mode: 'production',
    entry: "./webpack/style_part3.js",
    output: {
        path: __dirname + "/public/datasources/css/",
        filename: "style_part3.min.js"
    },
    module: {
        rules: [
            {
                test: /\.(css|eot|woff|woff2|ttf|svg|png|jpg)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader","resolve-url-loader"]
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new MiniCssExtractPlugin({ filename: "style_part3.min.css" }),
        new FixStyleOnlyEntriesPlugin(),
        new OptimizeCSSAssetsPlugin({})
    ],
    watch: true
});

module.exports = [
    frameCofig, style_Part1_Cofig, style_Part2_Cofig, style_Part3_Cofig,style_config
];