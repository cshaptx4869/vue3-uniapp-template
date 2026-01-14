<template>
  <z-paging ref="paging" v-model="dataList" auto-show-back-to-top @query="queryList">
    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <template #top>
      <uv-tabs :list="tabList" :activeStyle="{ color: '#3c9cff' }" @click="tabClick" />
    </template>

    <view class="item" v-for="(item, index) in dataList" :key="index">
      <view class="item-title">标题{{ index + 1 }}</view>
      <view class="item-content">
        uni-app is a framework for developing all front-end applications using Vue.js. Developers write a set of codes
        that can be published to iOS, Android, HarmonyOS Next, Web (responsive) and various MiniApp
        (weixin/alipay/baidu/douyin/lark).
      </view>
    </view>
  </z-paging>
</template>

<script setup>
import { ref } from "vue";

const paging = ref(null);
// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
const dataList = ref([]);
// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
const queryList = function (pageNo, pageSize, from) {
  console.log({ pageNo, pageSize, from });
  // 此处请求仅为演示，请替换为自己项目中的请求
  setTimeout(() => {
    // 将请求结果通过complete传给z-paging处理，同时也代表请求结束，这一行必须调用
    paging.value.complete(new Array(10));
  }, 500);
};

const tabList = [
  {
    name: "页签1",
  },
  {
    name: "页签2",
  },
  {
    name: "页签3",
  },
];

function tabClick(e) {
  paging.value.reload(true);
}
</script>

<style lang="scss" scoped>
.item {
  padding: 30rpx;
  border-bottom: 1px solid #e2e2e2;
}
</style>
