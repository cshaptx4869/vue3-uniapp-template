function hasPermission(url) {
  const whiteList = ["/pages/login/login"];
  // 在白名单中或有token，直接跳转
  if (whiteList.includes(url) || uni.getStorageSync("token")) {
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
          uni.navigateTo({
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
