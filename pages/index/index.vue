<template>
  <view class="container">
    <view>
      <image class="logo" src="/static/logo.png"></image>
      <HelloWorld></HelloWorld>
      <template v-if="userStore.token">
        <view class="token">
          {{ "Token: " + userStore.token }}
        </view>
      </template>
    </view>

    <view>
      <uv-button type="warning" text="鉴权跳转" @click="handleJump"></uv-button>
      <template v-if="userStore.token">
        <uv-button type="error" text="注销" @click="handleLogout"></uv-button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from "@/store";

const userStore = useUserStore();

function handleJump() {
  uni.$uv.route("/pagesA/test/test");
}

function handleLogout() {
  userStore.signOut();
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .logo {
    display: block;
    height: 200rpx;
    width: 200rpx;
    margin: 50rpx auto;
  }

  .token {
    word-break: break-all;
  }
}
</style>
