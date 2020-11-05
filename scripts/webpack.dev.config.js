/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-11-05 10:46:10
 */

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require("./webpack.base.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const os = require("os");
let selfIp;
try {
  // selfIp = os.networkInterfaces()['WLAN'][1].address
  selfIp = getIpAddress();
} catch (e) {
  selfIp = "localhost";
}

const PORT = 8888;
// 精确的获取本机ip地址
function getIpAddress() {
  const interfaces = require("os").networkInterfaces;
  for (let devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i += 1) {
      let alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}
const webpackConfigDev = {
  mode: "development",
  plugins: [
    // 定义环境变量为开发环境
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      IS_DEVELOPMENT: true,
    }),
    // 将打包后的资源注入到html文件内
    new HtmlWebpackPlugin({
      template: resolve("../app/index.html"),
      dlls: [
        // "./resource/dll/vendor.dll.js",
        //  "./resource/dll/redux.dll.js"
      ],
    }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require("../app/resource/dll/vendor.manifest.json"),
    // }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require("../app/resource/dll/redux.manifest.json"),
    // }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new ReactRefreshWebpackPlugin(),
  ],
  devtool: "source-map",
  devServer: {
    contentBase: resolve("../app"),
    historyApiFallback: false,
    open: true,
    hot: true,
    host: selfIp,
    port: PORT,
    proxy: {
      "/api/": {
        target: "http://127.0.0.1:80/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },
};

module.exports = merge(webpackConfigBase, webpackConfigDev);
