<script setup>
import {
  onLaunch,
  onShow,
  onHide,
  onError,
  onPageNotFound,
} from "@dcloudio/uni-app";
import { checkForUpdate } from "@/utils";

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

onPageNotFound((res) => {
  console.error("PageNotFound", res);
  uni.redirectTo({
    url: "/pages/404/404",
  });
});
</script>

<style lang="scss">
/*每个页面公共css */
page {
  height: 100%;
}

/* uv-ui基础样式 */
@import "@/uni_modules/uv-ui-tools/index.scss";
</style>
