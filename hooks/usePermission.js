import { currentPath } from "@/router";
import { hasPerm } from "@/router/guard";

/**
 * 校验当前路由是否有权限
 * 对某些特殊场景需要在页面onShow生命周期中校验权限:
 * 1.微信小程序端点击tabbar的底层逻辑不触发uni.switchTab
 * 2.h5在浏览器地址栏输入url后跳转不触发uni的路由api
 * 3.首次启动加载的页面不触发uni的路由api
 * @returns {Boolean} 是否有权限
 */
export async function usePermission() {
  return hasPerm(currentPath());
}
