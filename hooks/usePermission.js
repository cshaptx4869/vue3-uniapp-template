import { useUserStore } from "@/store";
import { onShow } from "@dcloudio/uni-app";

// 注意：这是针对微信小程序端点击tabbar的底层逻辑不触发uni.switchTab的特殊处理
export function usePermission() {
  onShow(() => {
    console.log("Page Show");
    // #ifdef MP-WEIXIN
    const userStore = useUserStore();
    if (!userStore.token) {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      //跳转登陆页
      uni.$uv.route({
        type: "redirectTo",
        url: "/pages/login/login",
        params: {
          redirect: currentPage.$page.fullPath,
        },
      });
    }
    // #endif
  });
}
