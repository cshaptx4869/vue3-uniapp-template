import { routes, removeQueryString } from "./index";

// 白名单路由
const whiteList = [];
routes.forEach((route) => {
  if (route.needLogin !== true) {
    whiteList.push(route.path);
  }
});

/**
 * 判断是否在白名单
 * @param {String} fullpath /开头带参数的路劲地址
 * @returns {Boolean}
 */
export function isWhiteList(fullpath) {
  return whiteList.includes(removeQueryString(fullpath));
}
