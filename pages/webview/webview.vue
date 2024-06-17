<template>
  <view><web-view :src="src"></web-view></view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const src = ref("");
onLoad((options) => {
  console.log(options);
  src.value = decodeURIComponent(options.url);
});
</script>

<style lang="scss" scoped></style>
