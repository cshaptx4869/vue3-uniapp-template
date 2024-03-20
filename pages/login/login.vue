<template>
  <view class="container">
    <view class="title">登录注册页</view>
    <view>
      <uv-button type="primary" text="注册" @click="handleRegister"></uv-button>
      <uv-button type="success" text="登录" @click="handleLogin"></uv-button>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from "@/store";

const userStore = useUserStore();

async function handleRegister() {
  await userStore.signUp({
    username: "visitor",
    password: "123456",
  });
  uni.$uv.toast("注册成功");
  setTimeout(() => {
    uni.$uv.route({
      type: "redirectTo",
      url: "/pages/index/index",
    });
  }, 800);
}

async function handleLogin() {
  await userStore.signIn({
    username: "visitor",
    password: "123456",
  });
  uni.$uv.route({
    type: "redirectTo",
    url: "/pages/index/index",
  });
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
