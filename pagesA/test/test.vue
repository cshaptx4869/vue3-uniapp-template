<template>
  <view class="container">
    <view>pagesA 分包页面</view>
  </view>
</template>

<script setup>
import { usePermission } from "@/hooks/usePermission";
import { onShow } from "@dcloudio/uni-app";

onShow(async () => {
  console.log("test page onShow");
  const hasPermission = await usePermission();
  console.log(hasPermission ? "已登录" : "跳转登录");
  // 以下开始写业务逻辑...
});
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
