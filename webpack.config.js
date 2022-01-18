const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public"),

    },
    devServer: {
        port: 3004
    },
    plugins: [
        new HTMLPlugin({
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [{
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
        }, ],
    },
}