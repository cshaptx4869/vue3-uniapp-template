import { useAuthStoreHook } from "@/store/modules/auth";
import pagesJson from "@/pages.json";

/**
 * 解析路由地址
 * @param {object} pagesJson
 * @returns [{"path": "/pages/index/index","needLogin": false}]
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

const routes = parseRoutes(pagesJson);
const whiteList = [];
routes.forEach((item) => {
  if (item.needLogin !== true) {
    whiteList.push(item.path);
  }
});
const authStore = useAuthStoreHook();

/**
 * 权限校验
 * @param {string} to
 * @returns
 */
export function beforeEnter(to = "") {
  const path = to.split("?")[0];
  // 在白名单中或有token，直接放行
  const hasPermission = whiteList.includes(path) || !!authStore.refreshToken;
  if (!hasPermission) {
    // 将用户的目标路径传递过去，这样可以实现用户登录之后，直接跳转到目标页面
    uni.$uv.route({
      type: "redirectTo",
      url: "/pages/login/login",
      params: {
        redirect: encodeURIComponent(to),
      },
    });
  }
  return hasPermission;
}

// 拦截器
function setupInterceptor() {
  // 注意：拦截uni.switchTab本身没有问题。但是在微信小程序端点击tabbar的底层逻辑并不是触发uni.switchTab。
  // 所以误认为拦截无效，此类场景的解决方案是在tabbar页面的页面生命周期onShow中处理。
  const apiList = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  apiList.forEach((item) => {
    // https://uniapp.dcloud.net.cn/api/interceptor.html
    uni.addInterceptor(item, {
      // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
      invoke(args) {
        // args为所拦截api中的参数，比如拦截的是uni.redirectTo(OBJECT)，则args对应的是OBJECT参数
        return beforeEnter(args.url);
      },
    });
  });
}

export function setupRouter() {
  setupInterceptor();
}
