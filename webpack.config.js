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
            "react-dom": "preact-compat",
            'create-react-class': 'preact-compat/lib/create-react-class',
            'react-dom-factories': 'preact-compat/lib/react-dom-factories'
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
                        presets: [ "env" , "flow" ],
                        plugins: [
                            [ "transform-react-jsx" ],
                            ["module-resolver", {
                                "root": ["."],
                                "alias": {
                                    "react": "preact-compat",
                                    "react-dom": "preact-compat",
                                    "create-react-class": "preact-compat/lib/create-react-class",
                                    "react-dom-factories": "preact-compat/lib/react-dom-factories"
                                }
                            }],
                            [ "react-flow-props-to-prop-types" ],
                            [ "transform-class-properties" ],
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