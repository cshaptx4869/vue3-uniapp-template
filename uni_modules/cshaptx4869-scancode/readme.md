# H5扫码

## 简介

基于 [vue-qrcode-reader](https://github.com/gruhn/vue-qrcode-reader) 库封装的 H5 扫码组件。

特性：

- 支持手电筒
- 支持摄像头切换
- 支持一次扫多个二维码，可自行选择识别哪一个



## **示例**

安装依赖

```bash
npm install vue-qrcode-reader
```

使用

```vue
<template>
  <button @click="scanCode">扫一扫</button>

  <!-- #ifdef H5 -->
  <cshaptx4869-scancode
    v-if="h5ScanCode"
    @success="handleSuccess"
    @fail="handleFail"
    @close="handleClose"
  ></cshaptx4869-scancode>
  <!-- #endif -->
</template>

<script setup>
import { ref } from "vue";

const h5ScanCode = ref(false);
function scanCode() {
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
function handleSuccess(res) {
  h5ScanCode.value = false;
  uni.showToast({
    icon: "none",
    title: res,
  });
}
function handleFail(err) {
  uni.showModal({
    title: err.errName,
    content: err.errMsg,
    complete: () => {
      h5ScanCode.value = false;
    },
  });
}
function handleClose() {
  h5ScanCode.value = false;
}
</script>
```

