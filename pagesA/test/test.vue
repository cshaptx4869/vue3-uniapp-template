<template>
  <view class="container">
    <view>pagesA 分包页面</view>
  </view>
</template>

<script setup>
import { usePermission } from "@/hooks/usePermission";

usePermission();
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
