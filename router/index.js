import pagesJson from "@/pages.json";

// 路径常量
export const HOME_PATH = "/pages/index/index";
export const LOGIN_PATH = "/pages/login/login";
export const ERROR404_PATH = "/pages/404/404";

// 路由对象数组
export const routes = parseRoutes(pagesJson);

/**
 * 解析路由地址
 * @param {Object} pagesJson 页面配置
 * @returns [{"path": "/pages/index/index", "route": "pages/index/index", "needLogin": false, "isTabBar": false}]
 */
export function parseRoutes(pagesJson = {}) {
  if (!pagesJson.pages) {
    pagesJson.pages = [];
  }
  if (!pagesJson.subPackages) {
    pagesJson.subPackages = [];
  }

  function parsePages(pages = [], rootPath = "") {
    const routes = [];
    for (let i = 0; i < pages.length; i++) {
      const absolutePath = rootPath ? `/${rootPath}/${pages[i].path}` : `/${pages[i].path}`;
      const route = {
        path: absolutePath,
        route: absolutePath.slice(1),
        needLogin: pages[i].needLogin === true,
        isTabBar: pagesJson?.tabBar?.list?.some((item) => `/${item.pagePath}` === absolutePath) === true,
      };
      // H5 应用的第一个页面地址会匹配 /
      // #ifdef H5
      if (rootPath === "" && i === 0) {
        routes.push({ ...route, path: "/" });
      }
      // #endif
      routes.push(route);
    }
    return routes;
  }

  function parseSubPackages(subPackages = []) {
    const routes = [];
    for (let i = 0; i < subPackages.length; i++) {
      routes.push(...parsePages(subPackages[i].pages, subPackages[i].root));
    }
    return routes;
  }

  return [...parsePages(pagesJson.pages), ...parseSubPackages(pagesJson.subPackages)];
}

/**
 * 当前路由
 * @returns {String} 以/开头的路劲地址
 */
export function currentPath() {
  const pages = getCurrentPages();
  if (pages.length === 0) {
    return;
  }
  const currentPage = pages[pages.length - 1];
  // $page还有path(/开头不带参数的路劲地址)、route(非/开头不带参数的路径地址)等属性
  // fullPath是/开头带参数的路劲地址; route是非/开头不带参数的路径地址
  return currentPage?.$page?.fullPath || `/${currentPage.route}`;
}

/**
 * 路径是否存在
 * @param {String} fullpath
 * @returns {Boolean}
 */
export function isPathExists(fullpath) {
  const cleanPath = removeQueryString(fullpath);
  return routes.some((item) => item.path === cleanPath);
}

/**
 * 是否是tabbar页面路径
 * @param {String} fullpath
 * @returns {Boolean}
 */
export function isTabBarPath(fullpath) {
  const cleanPath = removeQueryString(fullpath);
  return routes.filter((item) => item.isTabBar === true).some((item) => item.path === cleanPath);
}

/**
 * 跳转登录页
 * @param {String} redirect 登录后重定向地址
 */
export function redirectToLoginPage(redirect = "") {
  const targetPath = redirect !== "" ? redirect : currentPath();
  if (removeQueryString(targetPath) !== LOGIN_PATH) {
    uni.redirectTo({
      url: `${LOGIN_PATH}?redirect=${encodeURIComponent(targetPath)}`,
    });
  } else {
    uni.redirectTo({
      url: LOGIN_PATH,
    });
  }
}

export function redirectTo404Page() {
  uni.redirectTo({
    url: ERROR404_PATH,
  });
}

export function redirectToHomePage() {
  const func = isTabBarPath(HOME_PATH) ? uni.switchTab : uni.redirectTo;
  func({ url: HOME_PATH });
}

/**
 * 去除查询字符串
 * @param {String} path
 * @returns {String}
 */
export function removeQueryString(path = "") {
  return path.split("?")[0];
}
