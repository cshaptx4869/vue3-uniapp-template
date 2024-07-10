<template>
  <div class="not-found">
    <uv-navbar leftIconSize="40rpx" @leftClick="handleBack"></uv-navbar>
    <uv-empty
      mode="page"
      textSize="20"
      text="Page Not Found"
      icon="/static/404.png"
      width="380"
      height="380"
    ></uv-empty>
  </div>
</template>

<script setup>
import { HOME_PATH, isTabBarPath } from "@/router";

function handleBack() {
  uni.$uv.route({
    type: isTabBarPath(HOME_PATH) ? "switchTab" : "redirectTo",
    url: HOME_PATH,
  });
}
</script>

<style lang="scss" scoped>
.not-found {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
