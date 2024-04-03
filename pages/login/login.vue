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
import { useAuthStore } from "@/store";
import { onLoad } from "@dcloudio/uni-app";

let redirect = "/pages/index/index";
onLoad((options) => {
  if (options.redirect) {
    redirect = decodeURIComponent(options.redirect);
  }
});

const authStore = useAuthStore();

async function handleRegister() {
  await authStore.signUp({
    username: "visitor",
    password: "123456",
  });
  uni.$uv.toast("注册成功");
  setTimeout(() => {
    uni.$uv.route({
      type: "redirectTo",
      url: redirect,
    });
  }, 800);
}

async function handleLogin() {
  await authStore.signIn({
    username: "visitor",
    password: "123456",
  });
  uni.$uv.toast("登录成功");
  setTimeout(() => {
    uni.$uv.route({
      type: "redirectTo",
      url: redirect,
    });
  }, 800);
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
