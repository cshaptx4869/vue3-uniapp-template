import { useUserStore } from "@/store";

function hasPermission(url) {
  const whiteList = ["/pages/login/login", "/pages/index/index"];
  const userStore = useUserStore();
  // 在白名单中或有token，直接跳转
  if (whiteList.includes(url) || userStore.token) {
    return true;
  }
  return false;
}

// 拦截器
function setupInterceptor() {
  const apiList = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  apiList.forEach((item) => {
    // https://uniapp.dcloud.net.cn/api/interceptor.html
    uni.addInterceptor(item, {
      // 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
      invoke(args) {
        if (!hasPermission(args.url)) {
          // 将用户的目标路径保存下来
          // 这样可以实现用户登录之后，直接跳转到目标页面
          // uni.setStorageSync("URL", args.url);
          uni.redirectTo({
            url: "/pages/login/login",
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
