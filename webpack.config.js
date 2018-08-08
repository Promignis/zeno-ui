const path = require("path")
const webpack = require('webpack')

const config = {
    devtool: "source-map",
    entry: "./entry.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [ ".js", ".jsx" ],
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat"
        }
    },
    module: {
        rules: [
            // {
            //     enforce: "pre",
            //     test: /\.jsx?/i,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: "eslint-loader"
            //     }
            // },
            {
                test: /\.css/i,
                use: [ "style-loader", "css-loader" ]
            },
            {
                test: /\.jsx?/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ "env" ],
                        plugins: [
                            ['transform-react-jsx', { pragma: 'h' }]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port: 5555,
        contentBase: path.resolve(__dirname, "dist"),
        hot: true,
        compress: true,
        historyApiFallback: true
    }
}

module.exports = config