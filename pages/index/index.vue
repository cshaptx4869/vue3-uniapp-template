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
      <uv-button
        type="info"
        text="地图导航"
        @click="handleMapNavigation"
      ></uv-button>
      <template v-if="authStore.isLoggedIn">
        <uv-button type="error" text="注销" @click="handleLogout"></uv-button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { UserAPI } from "@/api";
import { useAuthStore } from "@/store";
import { applyAuthorize } from "@/utils";
import { ref } from "vue";

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

// 地图导航
function handleMapNavigation() {
  applyAuthorize("scope.userLocation")
    .then(() => {
      uni.openLocation({
        latitude: 30.084718,
        longitude: 120.602738,
        scale: 18, //缩放比例
        name: "车管服务大厅",
        address: "浙江省绍兴市越城区汤公路(精工汽车文化创意园北侧)",
        success: function () {
          console.log("打开位置成功");
        },
        fail: function () {
          console.log("打开位置失败");
        },
      });
    })
    .catch((err) => {
      console.log("🚀 ~ applyAuthorize ~ err:", err);
    });
}

// 注销
const authStore = useAuthStore();
function handleLogout() {
  authStore.signOut();
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
