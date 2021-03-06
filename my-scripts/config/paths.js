// @remove-on-eject-begin
"use strict";

const path = require("path");
const fs = require("fs");
const getPublicUrlOrPath = require("../../react-dev-utils/getPublicUrlOrPath");

// 项目根目录的绝对路径: /home/user/my-cra
const appDirectory = fs.realpathSync(process.cwd());

// 根据相对路径获取绝对路径
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const packageJsonPath = resolveApp("package.json");

// publicUrlOrPath: 公共资源路径
// 翻译: 我们用 PUBLIC_URL 环境变量或 homepage 属性来推断项目运行时的公共路径,
// webpack 需要知道这个公共路径来正确地把 <script> hrefs 放入 HTML 中
// 即使是在单页面程序里, 也可能为 /todos/42/static/js/bundle.7289d.js 等嵌套 url 提供 index.html
// 我们需要知道根目录路径
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === "development", // NODE_ENV 默认为 "development"
  require(packageJsonPath).homepage,
  process.env.PUBLIC_URL
);

// 打包输出目录, 默认为 "build" 目录
const buildPath = process.env.BUILD_PATH || "build";

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

// 解析文件路径的函数, 如果 filePath 的文件拓展名符合且存在该文件, 则返回路径, 否则默认返回为 js 文件路径
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp(".env"), // 获取 .env 的绝对路径: /home/user/my-cra/.env
  appPath: resolveApp("."), // /home/user/my-cra/.
  appBuild: resolveApp(buildPath), // /home/user/my-cra/build
  appPublic: resolveApp("public"), // /home/user/my-cra/public
  appHtml: resolveApp("public/index.html"), // /home/user/my-cra/public/index.html
  appIndexJs: resolveModule(resolveApp, "src/index"), // /home/user/my-cra/src/index.js
  appPackageJson: resolveApp("package.json"), // /home/user/my-cra/package.json
  appSrc: resolveApp("src"), // /home/user/my-cra/src
  appTsConfig: resolveApp("tsconfig.json"), // /home/user/my-cra/tsconfig.json
  appJsConfig: resolveApp("jsconfig.json"), // /home/user/my-cra/jsconfig.json
  yarnLockFile: resolveApp("yarn.lock"), // /home/user/my-cra/yarn.lock
  testsSetup: resolveModule(resolveApp, "src/setupTests"), // /home/user/my-cra/src/setupTests.js
  proxySetup: resolveApp("src/setupProxy.js"), // /home/user/my-cra/src/setupProxy.js
  appNodeModules: resolveApp("node_modules"), // /home/user/my-cra/node_modules
  appWebpackCache: resolveApp("node_modules/.cache"), // /home/user/my-cra/node_modules/.cache
  appTsBuildInfoFile: resolveApp("node_modules/.cache/tsconfig.tsbuildinfo"), // /home/user/my-cra/node_modules/.cache/tsconfig.tsbuildinfo
  swSrc: resolveModule(resolveApp, "src/service-worker"), // /home/user/my-cra/src/service-worker.js
  publicUrlOrPath,
};

// @remove-on-eject-begin
const resolveOwn = (relativePath) =>
  path.resolve(__dirname, "..", relativePath);

// config before eject: we're in ./node_modules/react-scripts/config/
module.exports = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveModule(resolveApp, "src/index"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  appTsConfig: resolveApp("tsconfig.json"),
  appJsConfig: resolveApp("jsconfig.json"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveModule(resolveApp, "src/setupTests"),
  proxySetup: resolveApp("src/setupProxy.js"),
  appNodeModules: resolveApp("node_modules"),
  appWebpackCache: resolveApp("node_modules/.cache"),
  appTsBuildInfoFile: resolveApp("node_modules/.cache/tsconfig.tsbuildinfo"),
  swSrc: resolveModule(resolveApp, "src/service-worker"),
  publicUrlOrPath,
  // These properties only exist before ejecting:
  ownPath: resolveOwn("."), // /home/user/my-cra/my-scripts
  ownNodeModules: resolveOwn("node_modules"), // /home/user/my-cra/my-scripts/node_modules
  appTypeDeclarations: resolveApp("src/react-app-env.d.ts"), // /home/user/my-cra/src/react-app-env.d.ts
  ownTypeDeclarations: resolveOwn("lib/react-app.d.ts"), // /home/user/my-cra/lib/react-app.d.ts
};

// 本脚本项目的 package.json 文件路径
const ownPackageJson = require("../../package.json");
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// config before publish: we're in ./packages/react-scripts/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join("packages", "react-scripts", "config")) !== -1
) {
  const templatePath = "../cra-template/template";
  module.exports = {
    dotenv: resolveOwn(`${templatePath}/.env`),
    appPath: resolveApp("."),
    appBuild: resolveOwn(path.join("../..", buildPath)),
    appPublic: resolveOwn(`${templatePath}/public`),
    appHtml: resolveOwn(`${templatePath}/public/index.html`),
    appIndexJs: resolveModule(resolveOwn, `${templatePath}/src/index`),
    appPackageJson: resolveOwn("package.json"),
    appSrc: resolveOwn(`${templatePath}/src`),
    appTsConfig: resolveOwn(`${templatePath}/tsconfig.json`),
    appJsConfig: resolveOwn(`${templatePath}/jsconfig.json`),
    yarnLockFile: resolveOwn(`${templatePath}/yarn.lock`),
    testsSetup: resolveModule(resolveOwn, `${templatePath}/src/setupTests`),
    proxySetup: resolveOwn(`${templatePath}/src/setupProxy.js`),
    appNodeModules: resolveOwn("node_modules"),
    appWebpackCache: resolveOwn("node_modules/.cache"),
    appTsBuildInfoFile: resolveOwn("node_modules/.cache/tsconfig.tsbuildinfo"),
    swSrc: resolveModule(resolveOwn, `${templatePath}/src/service-worker`),
    publicUrlOrPath,
    // These properties only exist before ejecting:
    ownPath: resolveOwn("."),
    ownNodeModules: resolveOwn("node_modules"),
    appTypeDeclarations: resolveOwn(`${templatePath}/src/react-app-env.d.ts`),
    ownTypeDeclarations: resolveOwn("lib/react-app.d.ts"),
  };
}
// @remove-on-eject-end

module.exports.moduleFileExtensions = moduleFileExtensions;
