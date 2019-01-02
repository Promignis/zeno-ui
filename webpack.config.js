const path = require("path")
const webpack = require('webpack')

const config = {
    devtool: "source-map",
    entry: ['babel-polyfill', "./entry.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [ ".js", ".jsx" ],
        alias: {
            "react": "preact-compat",
            "react-dom": "preact-compat",
            "Components": path.resolve(__dirname, "src/components")
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
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        limit: 8000
                    }
                  }
                ]
            },
            {
                test: /\.jsx?/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ "env" ],
                        plugins: [
                            ['transform-react-jsx', { pragma: 'h' }, '@babel/plugin-transform-async-to-generator']
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
