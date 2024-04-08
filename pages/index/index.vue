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
      <uv-button type="info" text="请求数据" @click="handleRequest"></uv-button>
      <LangSelect>
        <uv-button type="primary" text="切换语言"></uv-button>
      </LangSelect>
      <uv-button
        type="success"
        text="扫一扫"
        @click="handleScanCode"
      ></uv-button>
      <uv-button type="warning" text="路由跳转" @click="handleJump"></uv-button>
      <template v-if="authStore.refreshToken">
        <uv-button type="error" text="注销" @click="handleLogout"></uv-button>
      </template>
    </view>
    <!-- 扫码组件 -->
    <!-- #ifdef H5 -->
    <cshaptx4869-scancode
      v-if="h5ScanCode"
      @success="handleScanSuccess"
      @fail="handleScanFail"
      @close="h5ScanCode = false"
    ></cshaptx4869-scancode>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store";

// 请求数据
const userList = ref([]);
function handleRequest() {
  uni.$api.user.getUserList().then((res) => {
    console.log("获取用户数据", res);
    userList.value = res;
  });
}

// 路由跳转
function handleJump() {
  uni.$uv.route("/pagesA/test/test");
}

// 注销
const authStore = useAuthStore();
function handleLogout() {
  authStore.signOut();
}

// 扫一扫
const h5ScanCode = ref(false);
function handleScanCode() {
  // #ifdef H5
  h5ScanCode.value = true;
  // #endif
  // #ifndef H5
  uni.scanCode({
    success: (res) => {
      uni.showToast({
        icon: "none",
        title: res.result,
      });
    },
    faile: (err) => {
      console.log("err", err);
    },
  });
  // #endif
}
function handleScanSuccess(res) {
  h5ScanCode.value = false;
  uni.showToast({
    icon: "none",
    title: res,
  });
}
function handleScanFail(err) {
  uni.showModal({
    title: err.errName,
    content: err.errMsg,
    complete: () => {
      h5ScanCode.value = false;
    },
  });
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
