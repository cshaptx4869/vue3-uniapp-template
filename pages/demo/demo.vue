<template>
  <view>
    <uv-grid :border="false" col="4" @click="handleClick">
      <uv-grid-item v-for="(listItem, listIndex) in list" :key="listIndex" :name="listItem.name">
        <uv-icon :customStyle="{ paddingTop: 20 + 'rpx' }" :name="listItem.name" :size="22"></uv-icon>
        <text class="grid-text">{{ listItem.title }}</text>
      </uv-grid-item>
    </uv-grid>
  </view>
</template>

<script setup>
import { applyAuthorize } from "@/utils";
import { ref } from "vue";

const list = ref([
  { name: "grid-fill", title: "地图导航" },
  { name: "map-fill", title: "获取位置" },
]);

function handleClick(name) {
  switch (name) {
    case "grid-fill":
      handleMapNavigation();
      break;
    case "map-fill":
      handleGetLocation();
      break;
  }
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
</script>

<style lang="scss" scoped>
.grid-text {
  font-size: 14px;
  color: #909399;
}
</style>
