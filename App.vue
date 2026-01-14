<script setup>
import { onLaunch, onShow, onHide, onError, onPageNotFound, onUnhandledRejection } from "@dcloudio/uni-app";
import { checkForUpdate } from "@/utils";
import { redirectTo404Page } from "@/router";

onLaunch(() => {
  console.log("App Launch");
  // #ifdef MP-WEIXIN
  checkForUpdate();
  // #endif
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});

onError((error) => {
  console.error("App Error", error);
});

onUnhandledRejection((res) => {
  console.error("App UnhandledRejection", res);
});

onPageNotFound((res) => {
  console.error("App PageNotFound", res);
  redirectTo404Page();
});
</script>

<style lang="scss">
/* 每个页面公共css */
page {
  height: 100%;
}

/* uv-ui基础样式 */
@import "@/uni_modules/uv-ui-tools/index.scss";
</style>
