<template>
  <view class="container">
    <view>
      <image class="logo" src="/static/logo.png"></image>
      <view class="title">{{ $t("index.demo") }}</view>
      <template v-if="userList.length > 0">
        <view>{{ userList }}</view>
      </template>
    </view>

    <view>
      <uv-button type="info" text="webview" @click="handleWebview"></uv-button>
      <LangSelect>
        <uv-button type="primary" text="切换语言"></uv-button>
      </LangSelect>
      <uv-button
        type="warning"
        text="路由跳转(拦截)"
        @click="handleJump"
      ></uv-button>
      <uv-button
        type="success"
        text="请求数据"
        @click="handleRequest"
      ></uv-button>
      <template v-if="isLoggedIn">
        <uv-button type="error" text="注销" @click="handleLogout"></uv-button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store";
import { UserAPI } from "@/api";

// 请求数据
const userList = ref([]);
function handleRequest() {
  UserAPI.getUserList().then((res) => {
    console.log("获取用户数据", res);
    userList.value = res;
  });
}

// webview
function handleWebview() {
  uni.$uv.route("/pages/webview/webview", {
    url: "https://www.baidu.com",
  });
}

// 路由跳转
function handleJump() {
  uni.$uv.route("/pagesA/test/test");
}

// 注销
const authStore = useAuthStore();
const isLoggedIn = ref(authStore.isLoggedIn());
function handleLogout() {
  authStore.signOut();
  isLoggedIn.value = authStore.isLoggedIn();
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

  .title {
    text-align: center;
  }
}
</style>
