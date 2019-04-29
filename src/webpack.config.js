var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')
var autoprefixer = require('autoprefixer')

module.exports = {
    entry: path.join(__dirname, "js/app/index.js"),
    output: {
        path: path.join(__dirname, "../public/js"),
        filename: "index.js"
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "less-loader", "postcss-loader"]
            }) //把 css 抽离出来生成一个文件
        }]
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, "js/lib/jquery-3.4.0.min.js"),    //页面中可简写引入 require('jquery')
            mod: path.join(__dirname, "js/mod"),
            less: path.join(__dirname, "less")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({         //此插件自动将jQuery require到每个页面中
            $: "jquery"
        }),
        new ExtractTextPlugin("css/index.css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer(),
                ]
            }
        })
    ]
}