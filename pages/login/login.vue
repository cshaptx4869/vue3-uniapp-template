<template>
  <view class="container">
    <uv-button type="primary" text="注册" @click="handleRegister"></uv-button>
    <uv-button type="success" text="登录" @click="handleLogin"></uv-button>
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
  justify-content: flex-end;
}
</style>
