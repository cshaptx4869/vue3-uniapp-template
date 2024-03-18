<template>
  <view class="container">
    <image class="logo" src="/static/logo.png"></image>
    <HelloWorld></HelloWorld>
    <uv-button
      type="primary"
      text="发起网络请求"
      @click="handleRequest"
    ></uv-button>
    <view v-if="userList.length > 0">
      <view v-for="item in userList" :key="item.id">
        <view>{{ item.username + "-" + item.age }}</view>
      </view>
    </view>
    <uv-button type="warning" text="路由拦截" @click="handleRoute"></uv-button>
  </view>
</template>

<script setup>
import { ref } from "vue";

const userList = ref([]);
function handleRequest() {
  uni.$api.user.getUserList().then((res) => {
    userList.value = res;
  });
}

function handleRoute() {
  uni.$uv.route("/pagesA/test/test");
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }
}
</style>
