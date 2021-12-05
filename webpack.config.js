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
//压缩js代码
const TerserPlugin = require("terser-webpack-plugin");
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
        assetModuleFilename: 'images/[hash][ext][query]',
        chunkFilename:"js/[name][contenthash:10]_chunk.js"
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
                //配置 Babel 来转换高级的ES语法
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    //开启bable缓存，第二次构建时会读取之前的缓存
                    cacheDirectory: true
                }
            },
            {
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
    resolve: {
        //省略后缀名
        extensions: ['.js', '.json']
    },
    optimization: {
        //在开发模式下配置 tree shakeing
        usedExports: true,
        //压缩js
        minimize: true,
        minimizer: [
            //配置这个和importLoaders时 打包时mode要为production 否则会报错
            new CssMinimizerPlugin(),
            new TerserPlugin({
                parallel: true, // 是否并行打包
            })
        ],
        splitChunks: {
            chunks: 'all',
            //生成 chunk 的最小体积
            minSize: 30*1024,
            //最大限制*1024
            maxSize: 50*1024,
            //拆分前必须共享模块的最小 chunks 数。
            minChunks: 1,
            //按需加载时的最大并行请求数
            maxAsyncRequests: 5,
            //入口点的最大并行请求数。
            maxInitialRequests: 30,
            //强制执行拆分的体积阈值和其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
            // enforceSizeThreshold: 50000,
            //webpack 将使用 chunk 的来源和名称生成名称（例如 vendors~main.js）
            automaticNameDelimiter:"~",
            // name:true,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    //优先级
                    priority: -10,
                    reuseExistingChunk: true,
                    // filename: '[name].bundle.js',
                },
                // commons: {
                //     name: 'commons',
                //     chunks: 'initial',
                //     minChunks: 2,
                //   },
                //将当前模块记录其他模块的hash单独打包为一个文件 runtime
                //解决：修改a文件导致b文件contentHash变化
                // runtimeChunk: {
                //     name: (entrypoint) => `runtimechunk~${entrypoint.name}`,
                //   },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },

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