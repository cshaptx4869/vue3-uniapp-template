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
      <uv-button
        type="primary"
        text="获取位置"
        @click="handleGetLocation"
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
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

// 分享给朋友
onShareAppMessage((data) => {
  console.log("🚀 ~ onShareAppMessage ~ data:", data);
  return {
    title: "vue3-uniapp-template",
    path: "/pages/index/index",
    imageUrl: "https://img-cdn-tx.dcloud.net.cn/uni-app/logo-U.png", // 显示图片长宽比是 5:4
  };
});

// 分享到朋友圈
onShareTimeline((data) => {
  console.log("🚀 ~ onShareTimeline ~ data:", data);
  return {
    title: "vue3-uniapp-template",
    query: "a=1&b=2",
    imageUrl: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/icon.png", // 显示图片长宽比是 1:1
  };
});

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
  // 打开地图选择位置
  uni.chooseLocation({
    latitude: 30.084718,
    longitude: 120.602738,
    success: (res) => {
      // 使用微信内置地图查看位置
      uni.openLocation({
        latitude: res.latitude,
        longitude: res.longitude,
        scale: 18,
        name: res.name,
        address: res.address,
        fail: () => {
          console.log("🚀 ~ openLocation ~ err");
        },
      });
    },
    fail: (err) => {
      console.log("🚀 ~ chooseLocation ~ err:", err);
    },
  });
}

// 获取位置
function handleGetLocation() {
  applyAuthorize("scope.userLocation")
    .then(() => {
      // 获取当前的地理位置、速度
      uni.getLocation({
        type: "gcj02", // gcj02 返回可用于 wx.openLocation 的坐标
        altitude: true,
        isHighAccuracy: true,
        success: (res) => {
          uni.showModal({
            title: "",
            content: `纬度:${res.latitude},经度:${res.longitude},速度:${res.speed}m/s,位置的精确度:${res.accuracy},高度:${res.altitude}m,垂直精度:${res.verticalAccuracy}m,水平精度:${res.horizontalAccuracy}m`,
          });
        },
        fail: (err) => {
          console.log("🚀 ~ getLocation ~ err:", err);
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
