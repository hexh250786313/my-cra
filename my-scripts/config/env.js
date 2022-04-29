// @remove-on-eject-begin
"use strict";

const fs = require("fs");
const path = require("path");
// 是个对象, 里面有各种各样的路径属性, 包括本脚本项目的各个文件路径和 app 的各个文件路径
const paths = require("./paths");

const pathsPath = require.resolve("./paths"); // /home/user/my-cra/my-scripts/config/paths.js
// 删除缓存
// 翻译: 确保在 env.js 之后包含 paths.js 将读取 .env 变量
delete require.cache[pathsPath];

const NODE_ENV = process.env.NODE_ENV; // 默认 "development"
if (!NODE_ENV) {
  throw new Error(
    "The NODE_ENV environment variable is required but was not specified."
  );
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
// 读取各个 .env 文件, 并将其转换成一个对象
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== "test" && `${paths.dotenv}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  paths.dotenv,
].filter(Boolean);

// 翻译: 从 .env* 文件加载环境变量, 使用 silent 来禁止警告提示
// 如果没有这些文件的话, 则不修改已经设置的环境变量, .env 文件中支持可变拓展
// 插入 .env 文件中的环境变量
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    const dotenv = require("dotenv");
    const dotenvExpand = require("dotenv-expand");
    const myEnv = dotenv.config({
      path: dotenvFile,
    });
    dotenvExpand.expand(myEnv);
  }
});

console.log("================= env go ====================");

// 可以在启动命令里添加 NODE_PATH, 只支持相对路径, 用 ; 或 : 分隔不同的 node_modules 路径
// 环境变量 NODE_PATH, 就是环境中指定的 node_modules 文件夹的路径, 可能有多个目录, 多个时
// windows 环境下, 分号 ; 分隔, 否则是冒号 : 分隔
const appDirectory = fs.realpathSync(process.cwd()); // web app 的绝对路径
process.env.NODE_PATH = (process.env.NODE_PATH || "")
  .split(path.delimiter) // 先按照不同平台的分割规则分开
  .filter((folder) => folder && !path.isAbsolute(folder)) // 再过滤掉绝对路径
  .map((folder) => path.resolve(appDirectory, folder)) // 拼接到 web app 的路径上
  .join(path.delimiter); // 重新合成

// 正则, 匹配环境变量的名称, 约定使用 react-scripts 时的环境变量都是以 REACT_APP_ 开头, 无视大小写
// 例如: react_app_env=alpha
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key)) // 过滤出 REACT_APP_ 开头的环境变量
    .reduce(
      (env, key) => {
        env[key] = process.env[key]; // 有一份默认的环境变量, 把 REACT_APP_ 开头的环境变量都放到里面
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || "development",
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl,
        // We support configuring the sockjs pathname during development.
        // These settings let a developer run multiple simultaneous projects.
        // They are used as the connection `hostname`, `pathname` and `port`
        // in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
        // and `sockPort` options in webpack-dev-server.
        WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
        WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
        WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
        // Whether or not react-refresh is enabled.
        // It is defined here so it is available in the webpackHotDevClient.
        FAST_REFRESH: process.env.FAST_REFRESH !== "false",
      }
    );
  // 拷贝一份
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
