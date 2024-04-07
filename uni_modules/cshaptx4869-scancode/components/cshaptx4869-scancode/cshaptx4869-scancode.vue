<template>
  <div ref="scancodeRef" class="cshaptx4869-scancode">
    <qrcode-stream
      :formats="scanType"
      :paused="paused"
      :track="paintBoundingBox"
      :constraints="constraints"
      :torch="torch"
      @camera-on="onCameraOn"
      @camera-off="onCameraOff"
      @detect="onDetect"
      @error="onError"
    >
      <template v-if="isReady">
        <template v-if="!paused">
          <!-- 关闭按钮 -->
          <div class="closebtn" @click="onClose">
            <svg
              t="1712292126462"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2432"
              width="25"
              height="25"
            >
              <path
                d="M512 938.667C276.352 938.667 85.333 747.648 85.333 512S276.352 85.333 512 85.333 938.667 276.352 938.667 512 747.648 938.667 512 938.667z m0-85.334a341.333 341.333 0 1 0 0-682.666 341.333 341.333 0 0 0 0 682.666z m0-401.664l76.501-76.501a42.667 42.667 0 0 1 60.331 60.33L572.331 512l76.501 76.501a42.667 42.667 0 0 1-60.33 60.331L512 572.331l-76.501 76.501a42.667 42.667 0 1 1-60.331-60.33L451.669 512l-76.501-76.501a42.667 42.667 0 0 1 60.33-60.331L512 451.669z"
                p-id="2433"
                fill="#e9e7e8"
              ></path>
            </svg>
          </div>
          <!-- 摄像头 -->
          <div class="camera" v-if="devices.length > 1">
            <picker
              :range="devices"
              :range-key="deviceKey"
              :value="deviceIndex"
              @change="handleCameraChange"
            >
              <svg
                t="1712292177105"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2706"
                width="25"
                height="25"
              >
                <path
                  d="M906.666667 320a32 32 0 0 1 31.701333 27.648L938.666667 352v362.666667a138.666667 138.666667 0 0 1-130.816 138.453333L800 853.333333H258.602667l30.72 30.72a32 32 0 0 1 3.072 41.642667l-3.114667 3.584a32 32 0 0 1-41.642667 3.114667l-3.584-3.114667-85.333333-85.333333-2.730667-3.072a51.754667 51.754667 0 0 1-0.298666-0.426667l2.986666 3.498667a32.128 32.128 0 0 1-5.418666-37.973334 33.066667 33.066667 0 0 1 5.461333-7.253333l85.333333-85.333333a32 32 0 0 1 48.341334 41.642666l-3.114667 3.584-30.72 30.72h541.44a74.666667 74.666667 0 0 0 74.410667-68.565333l0.256-6.101333v-362.666667a32 32 0 0 1 32-32z m-130.304-228.394667l3.584 3.114667 85.333333 85.333333a32 32 0 0 1 3.029333 3.456l-2.986666-3.456a31.829333 31.829333 0 0 1 3.072 41.642667 33.28 33.28 0 0 1-2.901334 3.413333l-0.213333 0.170667-85.333333 85.333333a32 32 0 0 1-48.341334-41.642666l3.114667-3.584 30.634667-30.72H224a74.666667 74.666667 0 0 0-74.410667 68.522666L149.333333 309.333333v362.666667a32 32 0 0 1-63.701333 4.352L85.333333 672v-362.666667a138.666667 138.666667 0 0 1 130.816-138.453333L224 170.666667h541.397333l-30.72-30.72a32 32 0 0 1-3.072-41.642667l3.114667-3.584a32 32 0 0 1 41.642667-3.114667zM512 341.333333a170.666667 170.666667 0 1 1 0 341.333334 170.666667 170.666667 0 0 1 0-341.333334z m0 64a106.666667 106.666667 0 1 0 0 213.333334 106.666667 106.666667 0 0 0 0-213.333334z"
                  fill="#e9e7e8"
                  p-id="2707"
                ></path>
              </svg>
            </picker>
          </div>
          <!-- 扫描线 -->
          <div class="scanline"></div>
          <!-- 手电筒 -->
          <div
            v-if="!torchNotSupported"
            class="flashlight"
            @click="handleFlashlightChange"
          >
            <template v-if="torch">
              <svg
                t="1712292222903"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2940"
                width="48"
                height="48"
              >
                <path
                  d="M384.796053 640.831005v336.431242a46.133386 46.133386 0 0 0 46.133386 46.737753h170.431634a46.939209 46.939209 0 0 0 46.93921-46.737753v-336.431242A319.307496 319.307496 0 0 0 752.251492 443.202833H281.247754a313.465276 313.465276 0 0 0 103.548299 197.628172z m114.628369 59.429471a17.123746 17.123746 0 1 1 34.247491 0v102.339563a17.123746 17.123746 0 0 1-34.247491 0z m208.909699-427.086366h-382.766083a46.334842 46.334842 0 0 0-46.536298 46.334841v90.453669h476.040134v-90.453669a46.939209 46.939209 0 0 0-46.939209-46.334841z m-191.785953-68.293528a34.247492 34.247492 0 0 0 34.247491-34.046035V34.247492a34.247492 34.247492 0 0 0-68.494983 0v136.587055a34.247492 34.247492 0 0 0 34.247492 34.046035z m-141.019084-10.274247a34.448947 34.448947 0 0 0 12.691718-46.737753L319.524363 29.412552A34.448947 34.448947 0 0 0 272.988065 16.92229a34.448947 34.448947 0 0 0-12.691717 46.737753L328.791331 181.31025a33.84458 33.84458 0 0 0 46.536298 12.691717zM751.042757 17.123746a34.046036 34.046036 0 0 0-46.536297 12.490261l-68.494983 118.254575A34.247492 34.247492 0 0 0 695.239492 181.31025l68.494983-118.254574a34.448947 34.448947 0 0 0-12.691718-45.93193z"
                  fill="#e9e7e8"
                  p-id="2941"
                ></path>
              </svg>
            </template>
            <template v-else>
              <svg
                t="1712292282611"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3138"
                width="48"
                height="48"
              >
                <path
                  d="M370.725126 613.450253v360.472175a49.430017 49.430017 0 0 0 49.430017 50.077572h182.610456a50.293423 50.293423 0 0 0 50.293423-50.077572v-360.472175a341.261383 341.261383 0 0 0 111.379427-210.887015H259.777403a335.865093 335.865093 0 0 0 110.947723 210.887015z m123.035414 63.676223a18.347386 18.347386 0 1 1 36.694772 0v109.652613a18.347386 18.347386 0 0 1-36.694772 0z m224.053963-457.605397H306.185497A49.645868 49.645868 0 0 0 256.323777 269.166948v96.701517h511.136594v-96.701517a50.077572 50.077572 0 0 0-50.077572-49.645869zM259.777403 36.694772a36.478921 36.478921 0 0 0 36.478921 36.478921h421.558179a36.694772 36.694772 0 0 0 36.694772-36.478921 36.694772 36.694772 0 0 0-36.694772-36.694772H296.256324A36.694772 36.694772 0 0 0 259.777403 36.694772z"
                  fill="#e9e7e8"
                  p-id="3139"
                ></path>
              </svg>
            </template>
          </div>
        </template>
        <template v-else>
          <!-- 码定位容器 -->
          <div
            v-for="(item, index) in codes"
            :key="item"
            :style="{
              position: 'absolute',
              height: `${item.boundingBox.height}px`,
              width: `${item.boundingBox.width}px`,
              top: `${item.boundingBox.y}px`,
              left: `${item.boundingBox.x}px`,
            }"
            @click="onConfirm(index)"
          ></div>
        </template>
      </template>
      <template v-else>
        <div class="load-container">
          <div class="box-loading"></div>
        </div>
      </template>
    </qrcode-stream>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";

const props = defineProps({
  scanType: {
    type: Array,
    validator: (value) => {
      return value.every((item) =>
        [
          "aztec",
          "code_128",
          "code_39",
          "code_93",
          "codabar",
          "databar",
          "databar_expanded",
          "data_matrix",
          "dx_film_edge",
          "ean_13",
          "ean_8",
          "itf",
          "maxi_code",
          "micro_qr_code",
          "pdf417",
          "qr_code",
          "rm_qr_code",
          "upc_a",
          "upc_e",
          "linear_codes",
          "matrix_codes",
        ].includes(item)
      );
    },
    default: () => ["qr_code"],
  },
  strokeStyle: {
    type: String,
    default: "#007bff",
  },
  fullScreen: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["success", "fail", "close"]);

const scancodeRef = ref();
const isReady = ref(false);
const codes = ref([]);
const paused = ref(false);
const torch = ref(false);
const torchNotSupported = ref(false);
const constraints = ref({
  facingMode: "environment",
  width: { ideal: 1920 },
  height: { ideal: 1080 },
});
const paintBoundingBox = function (detectedCodes, ctx) {
  codes.value = detectedCodes;
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height },
    } = detectedCode;

    ctx.lineWidth = 2;
    ctx.strokeStyle = props.strokeStyle;
    ctx.strokeRect(x, y, width, height);
  }
};
const devices = ref([]);
const deviceIndex = ref(0);
const deviceKey = ref("label");

onMounted(async () => {
  props.fullScreen && fullScreen(scancodeRef.value);
  const videoDevices = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === "videoinput"
  );
  if (videoDevices.length > 0) {
    const isLabel = videoDevices.every((item) => {
      return item.label;
    });
    if (!isLabel) {
      deviceKey.value = "deviceId";
    }
    devices.value = videoDevices;
  }
});

function handleCameraChange(event) {
  const index = event.detail.value;
  isReady.value = false;
  deviceIndex.value = index;
  //改变constraints会重新触发camera-on事件
  constraints.value = {
    deviceId: devices.value[index].deviceId,
  };
}

function handleFlashlightChange() {
  isReady.value = false;
  //改变torch会重新触发camera-on事件
  torch.value = !torch.value;
}

function onCameraOn(capabilities) {
  isReady.value = true;
  torchNotSupported.value = !capabilities.torch;
}

function onDetect(detectedCodes) {
  // 感觉有bug...当前这个detectedCodes和paintBoundingBox中返回的detectedCodes不一样
  if (detectedCodes.length === 1) {
    emit("success", detectedCodes[0].rawValue);
  } else {
    paused.value = true;
  }
}

function onCameraOff() {
  console.log("CameraOff");
}

function onConfirm(index) {
  emit("success", codes.value[index].rawValue);
}

function onClose() {
  emit("close");
}

function onError(err) {
  let errName = err.name;
  let errMsg = err.message;

  switch (err.name) {
    case "NotAllowedError":
      errMsg = "you need to grant camera access permission";
      break;
    case "NotFoundError":
      errMsg = "no camera on this device";
      break;
    case "NotSupportedError":
      errMsg = "secure context required (HTTPS, localhost)";
      break;
    case "NotReadableError":
      errMsg = "is the camera already in use?";
      break;
    case "OverconstrainedError":
      errMsg = "installed cameras are not suitable";
      break;
    case "StreamApiNotSupportedError":
      errMsg = "Stream API is not supported in this browser";
      break;
    case "InsecureContextError":
      errMsg =
        "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
      break;
  }

  emit("fail", { errName, errMsg });
}

// 全屏
function fullScreen(el) {
  el = el ?? document.documentElement;
  const requestMethod = [
    "requestFullscreen",
    "webkitRequestFullscreen",
    "webkitRequestFullScreen",
    "webkitEnterFullscreen",
    "webkitEnterFullScreen",
    "mozRequestFullScreen",
    "msRequestFullscreen",
    "oRequestFullscreen",
  ].find((m) => el && m in el);
  requestMethod && el[requestMethod]();
}
</script>

<style lang="scss" scoped>
.cshaptx4869-scancode {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;

  .closebtn {
    position: absolute;
    top: 40rpx;
    left: 30rpx;
    z-index: 99;
  }

  .camera {
    position: absolute;
    top: 40rpx;
    right: 30rpx;
    z-index: 99;
  }

  .flashlight {
    position: absolute;
    bottom: 100rpx;
    left: 50%;
    transform: translate(-50%);
    z-index: 99;
  }

  .scanline {
    height: 100%;
    width: 100%;
    background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #06ae57 211%);
    animation: scan 2s linear infinite;
  }

  @keyframes scan {
    0% {
      transform: translateY(-100%);
    }

    100% {
      transform: translateY(0);
    }
  }

  .load-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;

    .box-loading {
      width: 100rpx;
      height: 100rpx;
      margin: auto;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      &:before {
        content: "";
        width: 100rpx;
        height: 10rpx;
        background: #000;
        opacity: 0.1;
        position: absolute;
        top: 118rpx;
        left: 0;
        border-radius: 50%;
        animation: shadow 0.5s linear infinite;
      }

      &:after {
        content: "";
        width: 100rpx;
        height: 100rpx;
        background: #06ae57;
        animation: animate 0.5s linear infinite;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 6rpx;
      }
    }
  }

  @keyframes animate {
    17% {
      border-bottom-right-radius: 6rpx;
    }
    25% {
      transform: translateY(18rpx) rotate(22.5deg);
    }
    50% {
      transform: translateY(36rpx) scale(1, 0.9) rotate(45deg);
      border-bottom-right-radius: 80rpx;
    }
    75% {
      transform: translateY(18rpx) rotate(67.5deg);
    }
    100% {
      transform: translateY(0) rotate(90deg);
    }
  }

  @keyframes shadow {
    0%,
    100% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1.2, 1);
    }
  }
}
</style>
