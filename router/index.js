import pagesJson from "@/pages.json";

// 路径常量
export const HOME_PATH = "/pages/index/index";
export const LOGIN_PATH = "/pages/login/login";
export const ERROR404_PATH = "/pages/404/404";

/**
 * 解析路由地址
 * @param {object} pagesJson
 * @returns [{"path": "/pages/index/index","needLogin": false},...]
 */
function parseRoutes(pagesJson = {}) {
  if (!pagesJson.pages) {
    pagesJson.pages = [];
  }
  if (!pagesJson.subPackages) {
    pagesJson.subPackages = [];
  }

  function parsePages(pages = [], rootPath = "") {
    const routes = [];
    for (let i = 0; i < pages.length; i++) {
      routes.push({
        path: rootPath ? `/${rootPath}/${pages[i].path}` : `/${pages[i].path}`,
        needLogin: pages[i].needLogin === true,
      });
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

  return [
    ...parsePages(pagesJson.pages),
    ...parseSubPackages(pagesJson.subPackages),
  ];
}
export const routes = parseRoutes(pagesJson);

/**
 * 当前路由
 * @returns {String}
 */
export function currentRoute() {
  const pages = getCurrentPages();
  if (pages.length === 0) {
    return;
  }
  const currentPage = pages[pages.length - 1];
  return currentPage?.$page?.fullPath || currentPage.route;
}

/**
 * 去除查询字符串
 * @param {String} path
 * @returns
 */
export function removeQueryString(path = "") {
  return path.split("?")[0];
}

/**
 * 路径是否存在
 * @param {String} path
 * @returns
 */
export function isPathExists(path = "") {
  const cleanPath = removeQueryString(path);
  return routes.some((item) => item.path === cleanPath);
}

/**
 * 是否是tabbar页面路径
 * @param {String} path
 * @returns
 */
export function isTabBarPath(path = "") {
  const cleanPath = removeQueryString(path);
  return (
    pagesJson.tabBar?.list?.some(
      (item) => `/${item.pagePath}` === cleanPath
    ) === true
  );
}
