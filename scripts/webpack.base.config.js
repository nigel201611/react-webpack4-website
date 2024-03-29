/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2021-07-17 23:20:53
 */

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require("happypack");
// const CopyPlugin = require("copy-webpack-plugin");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const devMode = process.env.NODE_ENV !== "production";
function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

const webpackConfigBase = {
  entry: {
    client: resolve("../app/client.js"),
  },
  output: {
    path: resolve("../dist"),
    filename: devMode
      ? "static/official/js/[name].[hash].js"
      : "static/official/js/[name].[contenthash].js",
    chunkFilename: devMode
      ? "static/official/chunks/[name].[hash:4].js"
      : "static/official/chunks/[name].[contenthash].js",
    publicPath: "/",
  },
  resolve: {
    // 减少后缀
    extensions: [".js", ".jsx", ".json"],
    // modules: [ // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
    //   resolve('app'),
    //   resolve('node_modules'),
    // ],
    alias: {
      // 减少使用别名提高编译速速
      "@app": path.join(__dirname, "../app"),
      "@actions": path.join(__dirname, "../app/redux/actions"),
      "@reducers": path.join(__dirname, "../app/redux/reducers"),
      "@apis": path.join(__dirname, "../app/apis"),
      "@components": path.join(__dirname, "../app/components"),
      "@configs": path.join(__dirname, "../app/configs"),
      "@config": path.join(__dirname, "../app/configs/config.js"),
      "@ajax": path.join(__dirname, "../app/configs/ajax.js"),
      "@reg": path.join(__dirname, "../app/configs/regular.config.js"),
      "@images": path.join(__dirname, "../static/official/images"),
      "@utils": path.join(__dirname, "../app/utils"),
      "@locales": path.join(__dirname, "../app/locales"),
      "@middleware": path.join(__dirname, "../app/middleware"),
      "@pages": path.join(__dirname, "../app/pages"),
      "@styles": path.join(__dirname, "../app/styles"),
      "react-dom": devMode ? "@hot-loader/react-dom" : "react-dom", // react-hot-loader需要
    },
  },
  optimization: {
    usedExports: true,
    runtimeChunk: {
      name: "runtime",
    },
    splitChunks: {
      chunks: "all", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 30000, // 模块超过30k自动被抽离成公共模块
      minChunks: 1, // 模块被引用>=1次，便分割
      name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
      automaticNameDelimiter: "~", // 命名分隔符
      cacheGroups: {
        default: {
          // 模块缓存规则，设置为false，默认缓存组将禁用
          minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
          priority: -20, // 优先级
          reuseExistingChunk: true, // 默认使用已有的模块
        },
        vendor: {
          // 过滤需要打入的模块
          // test: module => {
          //   if (module.resource) {
          //     const include = [/[\\/]node_modules[\\/]/].every(reg => {
          //       return reg.test(module.resource);
          //     });
          //     const exclude = [/[\\/]node_modules[\\/](react|redux|antd|react-dom|react-router)/].some(reg => {
          //       return reg.test(module.resource);
          //     });
          //     return include && !exclude;
          //   }
          //   return false;
          // },
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          // minChunks: 1,
          priority: -10, // 确定模块打入的优先级
          reuseExistingChunk: true, // 使用复用已经存在的模块
          enforce: true,
        },
        //  antd: {
        //    test: /[\\/]node_modules[\\/]antd/,
        //    name: 'antd',
        //    priority: 15,
        //    reuseExistingChunk: true,
        //  },
        echarts: {
          test: /[\\/]node_modules[\\/]echarts/,
          name: "echarts",
          priority: 16,
          reuseExistingChunk: true,
        },
        "draft-js": {
          test: /[\\/]node_modules[\\/]draft-js/,
          name: "draft-js",
          priority: 18,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    // noParse: /lodash/,
    rules: [
      // {
      //   enforce: "pre",
      //   test: /\.(js|jsx)$/,
      //   include: [resolve("../app")],
      //   exclude: /node_modules/,
      //   loader: "eslint-loader",
      //   options: {
      //     // cache: true,
      //     fix: true,
      //     formatter: require("eslint-friendly-formatter"),
      //     // failOnError Will cause the module build to fail if there are any errors, if option is set to true.
      //     failOnError: true,
      //   },
      // },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        include: [resolve("../app")],
        // loader: 'babel',
        //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: "happypack/loader?id=happyBabel",
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
              reloadAll: devMode,
            },
          },
          "happypack/loader?id=happyStyle",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        include: [
          resolve("../app/images"),
          resolve("../static/official/images"),
        ],
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "static/official/images/[name].[ext]",
          // outputPath: '/img'
        },
      },
      {
        test: /\.(woff|eot|ttf|svg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "static/official/font/[name].[hash:4].[ext]",
        },
      },
      {
        test: /\.(mp4)$/,
        loader: "file-loader",
        include: [
          resolve("../static/videos"),
        ],
        options: {
          name: "static/videos/[name].[ext]",
        },
      },
    ],
  },
  performance: false,
  plugins: [
    // 去除moment的语言包
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|fr|hu/),

    new MiniCssExtractPlugin({
      filename: devMode
        ? "static/official/css/style.css"
        : "static/official/css/style.[contenthash].css",
      chunkFilename: devMode
        ? "static/official/css/style.[id].css"
        : "static/official/css/style.[contenthash].[id].css",
    }),

    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: "happyBabel",
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: "babel-loader",
          options: {
            // babelrc: true,
            cacheDirectory: true, // 启用缓存
          },
        },
      ],
      //代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: false,
    }),
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: "happyStyle",
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: "css-loader",
          options: {
            importLoaders: 2, // 之前有2个loaders
            // modules: true, // 启用cssModules
            sourceMap: true,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true, //为true,在样式追溯时，显示的是编写时的样式，为false，则为编译后的样式
          },
        },
        {
          loader: "less-loader",
          options: {
            sourceMap: true,
          },
        },
      ],
      //代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: false,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new CopyPlugin([
    //   {
    //     from: "../videos",
    //     to: "../static/videos",
    //   },
    // ]),
  ],
};

module.exports = webpackConfigBase;
