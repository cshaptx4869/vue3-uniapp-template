<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <template v-if="userList.length > 0">
      <view class="title">用户列表:</view>
      <view v-for="item in userList" :key="item.id">
        <view>{{ item.username + "-" + item.age }}</view>
      </view>
    </template>
    <template v-else>
      <view class="text-area">
        <text class="title">{{ title }}</text>
      </view>
    </template>
  </view>
</template>

<script setup>
import { ref } from "vue";

const title = "Hello";
const userList = ref([]);
uni.$api.user.getUserList().then((res) => {
  userList.value = res;
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
