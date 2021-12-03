const path = require("path");
//生成一个 HTML5 文件， 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle
const HtmlWebpackPlugin = require("html-webpack-plugin");
//清除上一次的打包文件
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
//显示打包进度条
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')
module.exports = {
    //入口文件
    entry: "./src/index.js",
    //输出文件
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3030,
        compress: true,
        hot: true,
        // proxy: {
        //     // 开启代理
        //     '/sys': {
        //         target: 'http://test.com',
        //         changeOrigin: true
        //     },
        // }
    },
    plugins: [
        new HtmlWebpackPlugin({
            //需要在index.html配置<%= htmlWebpackPlugin.options.title %>
            title: "webpack学习",
            /**文件路径 */
            template: "./public/index.html",
            favicon: 'favicon.ico'
            /**生成的文件名 */
            // filename: "index.html"
        }),
        new CleanWebpackPlugin(),
        // new ProgressBarWebpackPlugin(),
        // new webpack.HotModuleReplacementPlugin()
    ],
    // development, production 或 none 之中的一个，来设置 mode 参数
    mode: "development",
    //cheap-module-source-map 显示错误在源文件第几行
    //cheap-module-eval-source-map 开发环境使用
    //nosources-source-map 生产环境使用 能看到报错的模块和行号
    //hidden-source-map 生产环境使用 只能看到编译后的代码
    //https://juejin.cn/post/6844904201311485966
    // devtool: "hidden-source-map"
}