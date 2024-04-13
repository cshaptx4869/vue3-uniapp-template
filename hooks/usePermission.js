import { useAuthStore } from "@/store/modules/auth";
import { onShow } from "@dcloudio/uni-app";

// 对某些特殊场景需要在页面onShow生命周期中校验权限
// 比如微信小程序端点击tabbar的底层逻辑不触发uni.switchTab、h5在浏览器地址栏输入地址后跳转不触发uni的路由api
export function usePermission() {
  onShow(() => {
    const authStore = useAuthStore();
    if (!authStore.refreshToken) {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      //跳转登陆页
      uni.$uv.route({
        type: "redirectTo",
        url: "/pages/login/login",
        params: {
          redirect: encodeURIComponent(
            currentPage?.$page?.fullPath || currentPage.route
          ),
        },
      });
    }
  });
}
