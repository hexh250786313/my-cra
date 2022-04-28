"use strict";

const { URL } = require("url");

module.exports = getPublicUrlOrPath;

/**
 * 根据是否开发环境返回需要的路径
 * 做如下路径处理:
 *   1. 将给定路径的末尾加 /
 *   2. 然后根据给定路径解析成分为两种路径
 *     1) 一种是相对路径
 *       a. 如果给定路径是完整的 url: //yinxiaobao.net/home, 则加 / 后解析出 pathname, 得到相对路径 /home/
 *       b. 如果给定路径是相对路径, 如 /home, 则加 / 变为 /home/
 *       c. 如果给定路径是 . 开头的, 则直接返回 /
 *     2) 一种是绝对路径, 也就是给定路径直接末尾加 / (不管头部有无 .)
 *   3. 开发环境返回 1) 相对路径, 生产环境返回 2) 绝对路径
 *
 * @param {boolean} 是否开发环境
 * @param {(string|undefined)} package.json 里配置的 homepage
 * @param {(string|undefined)} 参数 PUBLIC_URL
 * @returns {string}
 */
function getPublicUrlOrPath(isEnvDevelopment, homepage, envPublicUrl) {
  const stubDomain = "https://create-react-app.dev";

  // 如果配置了 PUBLIC_URL
  if (envPublicUrl) {
    // 判断尾巴是否有 /, 没有的话加上, 例如 PUBLIC_URL 是 ./home, 则变为 ./home/
    envPublicUrl = envPublicUrl.endsWith("/")
      ? envPublicUrl
      : envPublicUrl + "/";

    // new URL(url, base) url 是相对路径, base 是基础路径, 返回一个 URL 实例
    // URL 实例: https://developer.mozilla.org/zh-CN/docs/Web/API/URL
    // 返回 url 对象, 或者拼接 url + base 再返回对象
    // 如果最终的结果不是一个合理的 url 路径, 则报错
    // 这里相当于把 stubDomain 再拼上 envPublicUrl
    // 例如 const urlObj = new URL("./home", "https://create-react-app.dev")
    // 则 urlObj = {
    //      href: 'https://create-react-app.dev/home',
    //      origin: 'https://create-react-app.dev',
    //      protocol: 'https:',
    //      username: '',
    //      password: '',
    //      host: 'create-react-app.dev',
    //      hostname: 'create-react-app.dev',
    //      port: '',
    //      pathname: '/home', // origin 之后, search 和 hash 之前, 也就是真正的相对路径
    //      search: '',
    //      searchParams: URLSearchParams {},
    //      hash: ''
    //    }
    const validPublicUrl = new URL(envPublicUrl, stubDomain);
    // 假如 PUBLIC_URL 是 ./home, 则这里 validPublicUrl.pathname 变为 /home/

    // 判断是否开发环境
    // - 是的话, 要求 PUBLIC_URL 是一个相对路径
    //   - 判断是否 "." 开头
    //     - 是的话, 返回 / (不是很明白为什么是这样的, 例如 ./home 会返回 /, 可能是认为开发者会直接配置一个 . 作为 ./)
    //     - 不是的话, 返回真正的相对路径, 例如 /home 会返回 /home/
    // - 不是的话, 要求配置的 PUBLIC_URL 是一个完整的资源地址, 直接返回以 / 结尾的 PUBLIC_URL
    const path = isEnvDevelopment
      ? envPublicUrl.startsWith(".")
        ? "/"
        : validPublicUrl.pathname
      : envPublicUrl;

    return path;
  }

  // 逻辑
  if (homepage) {
    homepage = homepage.endsWith("/") ? homepage : homepage + "/";

    const validHomepagePathname = new URL(homepage, stubDomain).pathname;
    return isEnvDevelopment
      ? homepage.startsWith(".")
        ? "/"
        : validHomepagePathname
      : homepage.startsWith(".")
      ? homepage
      : validHomepagePathname;
  }

  return "/";
}
