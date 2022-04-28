#!/usr/bin/env node
"use strict";

// 翻译: 脚本出错时抛出错误，而不是静默忽略。以后 unhandledRejection 将用 non-zero exit code 来终止 Node.js 进程
process.on("unhandledRejection", (err) => {
  throw err;
});

const spawn = require("cross-spawn"); // spawn 可以用来执行命令, 产生一个新进程
const args = process.argv.slice(2); // 除去 node 和当前脚本的其他参数
// process.argv: [
//   '/home/user/.nvm/versions/node/v16.13.0/bin/node', // process.execPath
//   '/home/user/my-cra/my-scripts/bin/my-scripts.js', // process.scriptPath
//   '--inspect', // 第一个参数
//   'start', // 第二个参数
//   'hello', // 第三个参数
// ]
// args: ['--inspect', 'start', 'hello']
//
// process.argv 是一个数组, 第一个元素是环境中的 node 的绝对路径, 第二个元素是当前执行的文件的绝对路径, 后面的元素是脚本的参数
// 参考: https://nodejs.org/api/process.html#process_process_argv
// args: ['--inspect', 'start', 'hello']
//
// process.argv 之前的参数属于环境参数 process.env, 例如:
// PUBLIC_URL=/ SENTRY=alpha ./my-scripts/bin/my-scripts.js --inspect start hello
// 则 PUBLIC_URL 和 SENTRY 参数会被设置为 process.env 中的值
//

// 找到启动参数位置 start 或者 eject 或者 build 或者 test
const scriptIndex = args.findIndex(
  (x) => x === "build" || x === "eject" || x === "start" || x === "test"
);
// 启动参数, 找不到默认取第一个参数
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
// 找 node 参数 (node 和 启动参数 "start" | "build" | "eject" | "test" 之间的参数)
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

// spawn(command[, args][, options]) 可以用来执行命令, 产生一个新进程
// 参考: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
if (["build", "eject", "start", "test"].includes(script)) {
  // require.resolve 绝对路径解析, 根据启动参数找到对应的脚本, 如 yarn start 则找到 my-scripts/scripts/start.js
  const scriptPath = require.resolve("../scripts/" + script);
  // 启动脚本的参数
  const lauchArgs = args.slice(scriptIndex + 1);
  // 拼接参数, 和 args 的区别是, fullArgs 中的启动参数变为了绝对路径
  // fullArgs = [ '--inspect', '/home/user/my-cra/my-scripts/scripts/start.js', 'hello' ]
  const fullArgs = [...nodeArgs, scriptPath, ...lauchArgs];
  // 这个 spawn.sync 相当于执行命令:
  // /home/user/.nvm/versions/node/v16.13.0/bin/node --inspect /home/user/my-cra/my-scripts/scripts/start.js hello
  const result = spawn.sync(process.execPath, fullArgs, { stdio: "inherit" });

  if (result.signal) {
    if (result.signal === "SIGKILL") {
      console.log(
        "The build failed because the process exited too early. " +
          "This probably means the system ran out of memory or someone called " +
          "`kill -9` on the process."
      );
    } else if (result.signal === "SIGTERM") {
      console.log(
        "The build failed because the process exited too early. " +
          "Someone might have called `kill` or `killall`, or the system could " +
          "be shutting down."
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.log('Unknown script "' + script + '".');
  console.log("Perhaps you need to update react-scripts?");
  console.log(
    "See: https://facebook.github.io/create-react-app/docs/updating-to-new-releases"
  );
}
