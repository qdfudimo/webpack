const path = require("path");
//生成一个 HTML5 文件， 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle
const HtmlWebpackPlugin = require("html-webpack-plugin");
//清除上一次的打包文件
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
//显示打包进度条
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')
//css以文件形式导入 配置mini-css-extract-plugin插件和它的loader，这时我们不需要style-loader
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//压缩css代码
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const postcssPresetEnv = require('postcss-preset-env');
//在设置 node.js 环境变量   变成开发环境
process.env.NODE_ENV = "production"
// process.env.NODE_ENV = "development";
module.exports = {
    //入口文件
    entry: "./src/index.js",
    //输出文件
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        assetModuleFilename: 'images/[hash][ext][query]'
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
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        // 0 => no loaders (default);
                        // 1 => postcss-loader;
                        // 2 => postcss-loader, sass-loader
                        options: {
                            //处理@import引入的css文件
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [postcssPresetEnv()]
                            }
                        }

                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg|)$/i,
                // type: "asset/resource",//发送一个单独的文件并导出URL
                // type: "asset/inline",//导出一个资源的data URL
                type: 'asset',
                parser: {
                    //实现limit 超过4kb 自动使用asset/inline
                    dataUrlCondition: {
                        maxSize: 4 * 1024 // 4kb
                    }
                }
                // generator: {
                //   //自定义输出文件名的方式是，将某些资源发送到指定目录
                //     filename: 'image/[name][hash:6].[ext]'
                //   }
            },
            {
                test: /\.ttf|eot|woff?$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'font/[name][hash:6].[ext]'
                }
            },
            {
                //html文件中引入图片要是用html-loader
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    esModule: false,
                },
            },
        ]
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
        new ProgressBarWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name][chunkhash].css"
        }),
        // new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        minimizer: [
            //配置这个和importLoaders时 打包时mode要为production 否则会报错
            new CssMinimizerPlugin(),
        ],
    },
    // development, production 或 none 之中的一个，来设置 mode 参数
    mode: "development",
    //cheap-module-source-map 显示错误在源文件第几行
    //cheap-module-eval-source-map 开发环境使用
    //nosources-source-map 生产环境使用 能看到报错的模块和行号
    //hidden-source-map 生产环境使用 只能看到编译后的代码
    //https://juejin.cn/post/6844904201311485966
    // devtool: "hidden-source-map"
}