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
import { AuthAPI } from "@/api";
import { HOME_PATH, LOGIN_PATH, isTabBarPath, removeQueryString } from "@/router";
import { useAuthStore } from "@/store";
import { onLoad } from "@dcloudio/uni-app";

let redirect = HOME_PATH;
onLoad((options) => {
  if (options.redirect && removeQueryString(options.redirect) !== LOGIN_PATH) {
    redirect = decodeURIComponent(options.redirect);
  }
});

const authStore = useAuthStore();

async function handleRegister() {
  const { tokenType, accessToken, refreshToken } = await AuthAPI.signUp({
    username: "visitor",
    password: "123456",
  });
  authStore.setToken(tokenType ? `${tokenType} ${accessToken}` : accessToken);
  authStore.setToken(refreshToken ? `${tokenType} ${refreshToken}` : refreshToken, true);
  uni.$uv.toast("注册成功");
  setTimeout(() => {
    uni.$uv.route({
      type: isTabBarPath(redirect) ? "switchTab" : "redirectTo",
      url: redirect,
    });
  }, 800);
}

async function handleLogin() {
  const { tokenType, accessToken, refreshToken } = await AuthAPI.signIn({
    username: "visitor",
    password: "123456",
  });
  authStore.setToken(tokenType ? `${tokenType} ${accessToken}` : accessToken);
  authStore.setToken(refreshToken ? `${tokenType} ${refreshToken}` : refreshToken, true);
  uni.$uv.toast("登录成功");
  setTimeout(() => {
    uni.$uv.route({
      type: isTabBarPath(redirect) ? "switchTab" : "redirectTo",
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
