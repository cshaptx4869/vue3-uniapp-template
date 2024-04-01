import { useAuthStore } from "@/store";
import { routes } from "@/utils/parseRoutes";

function hasPermission(url = "") {
  const authStore = useAuthStore();
  const whiteList = [];
  routes.forEach((item) => {
    if (item.needLogin !== true) {
      whiteList.push(item.path);
    }
  });
  const path = url.split("?")[0];
  // 在白名单中或有token 直接跳转
  return whiteList.includes(path) || !!authStore.refreshToken;
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
        if (!hasPermission(args.url)) {
          // 将用户的目标路径传递过去，这样可以实现用户登录之后，直接跳转到目标页面
          uni.$uv.route({
            type: "redirectTo",
            url: "/pages/login/login",
            params: {
              redirect: args.url,
            },
          });
          return false;
        }
        return true;
      },
    });
  });
}

export function setupRouter() {
  setupInterceptor();
}
