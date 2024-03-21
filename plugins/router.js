import { useUserStore } from "@/store";

function hasPermission(url) {
  const userStore = useUserStore();
  const whiteList = [/^\/pages\/login\/login\??/i, "/pages/index/index"];
  const isPassed = whiteList.some((item) => {
    if (typeof item === "string") {
      return item === url;
    }
    if (item instanceof RegExp) {
      return item.test(url);
    }
    return false;
  });
  // 在白名单中或有token 直接跳转
  return isPassed || !!userStore.token;
}

// 拦截器
function setupInterceptor() {
  // 注意：拦截uni.switchTab本身没有问题。但是在微信小程序端点击tabbar的底层逻辑并不是触发uni.switchTab。
  // 所以误认为拦截无效，此类场景的解决方案是在tabbar页面的页面生命周期onShow中处理。
  const apiList = [
    "navigateTo",
    "redirectTo",
    "reLaunch",
    "switchTab",
    "navigateBack",
  ];
  apiList.forEach((item) => {
    // https://uniapp.dcloud.net.cn/api/interceptor.html
    uni.addInterceptor(item, {
      // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
      invoke(args) {
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
