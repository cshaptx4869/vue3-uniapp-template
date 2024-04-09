<template>
  <div class="not-found">
    <uv-navbar leftIconSize="40rpx" @leftClick="handleBack"></uv-navbar>
    <uv-empty
      mode="page"
      textSize="28"
      text="Page Not Found"
      icon="/static/404.png"
      width="380"
      height="380"
    ></uv-empty>
  </div>
</template>

<script setup>
function handleBack() {
  uni.$uv.route({
    type: "redirectTo",
    url: "/pages/index/index",
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
