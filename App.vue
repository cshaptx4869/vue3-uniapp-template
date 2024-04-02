<script setup>
import {
  onLaunch,
  onShow,
  onHide,
  onError,
  onPageNotFound,
} from "@dcloudio/uni-app";

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
  console.log("App Error", error);
});

onPageNotFound((res) => {
  console.log("PageNotFound", res);
  uni.redirectTo({
    url: "/pages/404/404",
  });
});

// 检查新版本更新
// #ifdef MP-WEIXIN
function checkForUpdate() {
  const updateManager = uni.getUpdateManager();
  // 监听向微信后台请求检查更新结果事件。微信在小程序冷启动时自动检查更新，不需由开发者主动触发。
  updateManager.onCheckForUpdate(function (res) {
    //是否有新版本
    console.log(res.hasUpdate ? "有小程序新版本" : "无小程序新版本");
  });
  //监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
  updateManager.onUpdateReady(function () {
    uni.showModal({
      title: "更新提示",
      content: "新版本已经准备好，是否重启应用？",
      success(res) {
        if (res.confirm) {
          // 强制小程序重启并使用新版本。在小程序新版本下载完成后（即收到 onUpdateReady 回调）调用
          updateManager.applyUpdate();
        }
      },
    });
  });
  // 监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
  updateManager.onUpdateFailed(function () {
    uni.showToast({
      title: "小程序更新失败，请刷新后重试",
    });
  });
}
// #endif
</script>

<style lang="scss">
/*每个页面公共css */
page {
  height: 100%;
}

/* uv-ui基础样式 */
@import "@/uni_modules/uv-ui-tools/index.scss";
</style>
