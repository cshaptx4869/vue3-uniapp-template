<template>
  <view class="container">
    <view>pagesA 分包页面</view>
  </view>
</template>

<script setup lang="ts">
import { usePermission } from "@/hooks/usePermission";
import { onShow, onPullDownRefresh } from "@dcloudio/uni-app";

onShow(async () => {
  console.log("test page onShow");
  const hasPermission = await usePermission();
  console.log(hasPermission ? "已登录" : "跳转登录");
  // 以下开始写业务逻辑...
});

onPullDownRefresh(() => {
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 300);
});

// 编写ts代码
let ts: string = "Just TS!";
console.log(ts);
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
