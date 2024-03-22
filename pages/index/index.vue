<template>
  <view class="container">
    <view>
      <image class="logo" src="/static/logo.png"></image>
      <HelloWorld></HelloWorld>
      <template v-if="userList.length > 0">
        <view>{{ userList }}</view>
      </template>
    </view>

    <view>
      <uv-button text="获取数据" @click="handleRequest"></uv-button>
      <uv-button type="warning" text="路由跳转" @click="handleJump"></uv-button>
      <template v-if="authStore.refreshToken">
        <uv-button type="error" text="注销" @click="handleLogout"></uv-button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store";

const authStore = useAuthStore();

const userList = ref([]);
function handleRequest() {
  uni.$api.user.getUserList().then((res) => {
    console.log("获取用户数据", res);
    userList.value = res;
  });
}

function handleJump() {
  uni.$uv.route("/pagesA/test/test");
}

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
}
</style>
