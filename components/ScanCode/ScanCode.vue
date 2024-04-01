<template>
  <view class="scan-code">
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
          <view class="closebtn" @click="onClose">
            <image :src="icons.closeBtn"></image>
          </view>
          <!-- 摄像头 -->
          <view class="camera" v-if="devices.length > 1">
            <picker
              :range="devices"
              :range-key="deviceKey"
              :value="deviceIndex"
              @change="handleCameraChange"
            >
              <image :src="icons.cameraSwitch"></image>
            </picker>
          </view>
          <!-- 扫描线 -->
          <view class="scanline"></view>
          <!-- 手电筒 -->
          <view
            v-if="!torchNotSupported"
            class="flashlight"
            @click="handleFlashlightChange"
          >
            <image
              :src="torch ? icons.flashlightOpen : icons.flashlightClose"
            ></image>
          </view>
        </template>
        <template v-else>
          <!-- 码定位容器 -->
          <view
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
          >
          </view>
        </template>
      </template>
      <template v-else>
        <view class="loading">
          <view class="circle"></view>
        </view>
      </template>
    </qrcode-stream>
  </view>
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
});
const emit = defineEmits(["success", "fail", "close"]);

const isReady = ref(false);
const codes = ref([]);
const paused = ref(false);
const torch = ref(false);
const torchNotSupported = ref(false);
const constraints = ref({ facingMode: "environment" });
const icons = {
  closeBtn:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAB+UExURUdwTOvo6uvp6uzs7Ovq6+vp6ujo6Onn6ezp6+fn5+3t7ern6uvr6+vq6uzp6+vq6+3t7evp6urq6uzq6uvq6unp6e3t7evo6evp6evr6+rq6uzp6unp6evo6+zq6uvp6evp6/Dp6ezp6+vp6+vo6/Ly8uvp6erq6uvp6+vp6hkHyTgAAAApdFJOUwDM8TWPzwuA1CAqYBm/r+UO71WftVwcjnMmbt9pWnhnWyLIdGYUWz1/IVlg3AAAAbdJREFUSMfdVsmWgyAQdEfikmgWo3E3m///gyMtRlohmfdmTuFEF0XsroYimvaV41RboR1FdmjVp8/sTdL2wmiTzVv6jhj9Yhhkp+Z7bi8Zrqfi7znjUJnUcahZHTiwl/MvsLglzQw1ZAvgRcbXYYn4GPUJwPqaX8JCvF6IYaFcwgXAVPZpCkvFQk/Q5yYv7gZaYXUh04dKvgdUh/prLBFt9XuG2HOL6emrN/hMXUsAbOEDJND5lOgBET5hL3RIecDK79ikY6VyMMUaekMUoAbmmpajhgVD4KESMiRYfzz2SJoMFREOkfmKuvmgdi/QHKIQ1Sw0OZ/4OS5zrjoaIkcQbUynPwqQM8SRcsN93HBXblikdJ1SuqpSwkWf56LPiqKZrBWW9T6m9ZzQCslas4usCZ1myUBiU6c1dr3r2brYWiP09DylNvW/YQzB1lrx8LkuWc4gz1YQLfnN8U7+coFGaWIVP15dUW4CVM6nEhOAK6GwDTCN3pMb60NhGTJ7vbyzyjfmuiXpDKXcjHV5cSU/ckE22n0WcKBUyVfIH5Ti/54s1nPLFum2tfn8kFJvenY9+p1/LH4AUaJXQsFZXwYAAAAASUVORK5CYII=",
  cameraSwitch:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABsUExURUdwTOrp6ezq6u7p7uvp6erp6evp6unn6evo6+zq6urq6uzq6+ro6uvq6+fn5/Hq6urn6uvq6uzp6uvo6unp6evp6+zp6+vo6Onp6evo6evo6evp6uvr6+zp6uvp6uvp6e3q6uzp6uvp6uvp6jhpvhUAAAAjdFJOUwDqbjukleiAZp9JypKyICRgv7nMdn/UWTrtptlMqu+ZYcbrLrdKkgAAAQ1JREFUSMflltkSgyAMRXFFrfvSfb///4/FdmhRS2Nm2qfmKTockJtLUIi/CAnJAwAmIb9DnOMlPsaIOICMyaJgrLBWL5qIsYcTELL23AD2+cVxqtF4S8OIp5p+Bp5fFluBJK3DsE4T66wjwNdS+vMAS7WsgKueFmWelwuVuDTgvVTvC+CRQABkOs+AgAQqo4gRUJGAAxQ6LwCHBEIg13lueswG1ECp8xKoSSBVoupcCZuSQDKUNaEL1xsji4oiyobm+J41Hua4hzvTrcILKsepAs9q73hOZ3tzyjrjTM0BpGmESbTAhdVzr6Zz6fGy77x7ZrMcnHCxIce3gtOOd9vVj+4ZkuDer91//EjcAJr/QodEBp8eAAAAAElFTkSuQmCC",
  flashlightOpen:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADeUExURUdwTOvp6vLm5uvo6Ovp6+3t7evo6uvn5+nn6evq6unp6evq6v///+vn6+vq6+zq6uPj4/Hq6uzp6+vp6uzq6uvq6+rp6uvo6erp6ubm5uTk5O7p7unp6ero6tvb2+rq6unp6erq6uvp6unp6ezs7O3t7evp6evo6+ro6urp6uvq6+rp6urp6urq6uzp6urq6uro6uvq6urp6uvr6+vp6+rp6u3t7ezp6+vq6uvp6unp6enp6ern6uro6uzp6urq6u7o6Orn6uvr6+zo6uvp6evr6+rp6urq6uvp6uvp6tCVFiEAAABJdFJOUwDZFGV/HcxAgL9GtQJBspEJJMjPn/zG7fcKEy5Emw4+F0nOahsOpFmSoMvbxG/HY4ac3Q2jxyrU1vQvU3d73zAsYE6Tcxmube/w/V+XAAABFUlEQVRIx+3V6U7CQBQF4MtSpuybCyAgiPvOooigqKBy3v+FnIgNXWZum6BJTTh/5qY9XyHpTEpkS1EUrDH3PP2ZCqJIuiRRMpaTCSSXk1GyJkXKQN4N8kBZCyYAsk6QlZeetCBzB6SdIA08kD5j+byYHcTkhRsG0ACIRFcgGgEuuT49jgCxAkL+wBELZHN4L5c3YCaX6gHi5BPR/15e5waFJMKTQ66+twtvjhmQgCopPVD2Yf4rINT5RXCr+keLdz1IqcAH8+IyPQX45PZGVwFeOHDi7V/zu/XM3d+u86B27gJXfgdiv+LoN/yPUMfe32kGOHQBt9G6IE6hA2b4QGLrr9/DBvgkZwOtQJ+tU6t+0fbe/ALGCKQKcrjlyQAAAABJRU5ErkJggg==",
  flashlightClose:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABRUExURUdwTOvp6uvp6+zq6uzp6uvq6+vr6+vn5+nn6evq6uvr6+bm5urp6evr6+rq6uzq6uvp6+zp6urp6ufn5+zp6fHx8e3t7erq6uvr6+vp6evp6uGNTiwAAAAadFJOUwDjaG2q5RlAgL9xCpVYMZ9b360gahIqY1lzUn7+0QAAAJ5JREFUSMftlckOgzAMRAMk2KxdWNrm/z+0vVSCMsOiwgXlXTNPTmQnMWbA03rAxVDuHtJToYX5G6/QXRXQmMB/xBkg5vkEdzqhgiecWhDCfkKJd1RSocJCRYUaCzUVCofyruDDpEjQmWlNQQmXzs23bivwYfL22aU7ZDfmf4wV+fEx9DhBJAjLwuN1dB+CsLMgQ0HW/Ix59I1H+XT1Df75QqnYg8plAAAAAElFTkSuQmCC",
};
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
</script>

<style lang="scss" scoped>
.scan-code {
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

    image {
      display: block;
      width: 50rpx;
      height: 50rpx;
    }
  }

  .camera {
    position: absolute;
    top: 40rpx;
    right: 30rpx;

    image {
      display: block;
      width: 50rpx;
      height: 50rpx;
    }
  }

  .flashlight {
    position: absolute;
    bottom: 100rpx;
    left: 50%;
    transform: translate(-50%);
    z-index: 99;

    image {
      display: block;
      width: 96rpx;
      height: 96rpx;
    }
  }

  .scanline {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%);
    width: 80%;
    height: 2rpx;
    background: linear-gradient(180deg, rgba(0, 255, 51, 0) 50%, #06ae57 300%);
    border-bottom: 2px solid #06ae57;
    animation: scan 2s linear infinite;
  }

  @keyframes scan {
    0% {
      top: 20%;
    }

    100% {
      top: 80%;
      opacity: 0;
    }
  }

  .loading {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // background: rgba(0, 0, 0, 0.5);
    background-color: #808080;

    .circle {
      position: relative;
      width: 400rpx;
      height: 400rpx;
      border-radius: 50%;
      transform: rotate(360deg);
      animation: rotate 45s infinite linear;
    }

    .circle::before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      box-sizing: border-box;
      border-radius: 50%;
      border-top: 6rpx solid #fff;
      border-left: 6rpx solid #fff;
      border-bottom: 6rpx solid transparent;
      border-right: 6rpx solid transparent;
      transform: rotate(720deg);
      animation: rotate 3s infinite ease-out;
    }

    .circle::after {
      position: absolute;
      content: "";
      top: -4rpx;
      left: -4rpx;
      right: -4px;
      bottom: -4px;
      box-sizing: border-box;
      border-radius: 50%;
      border-bottom: 14rpx solid transparent;
      border-right: 14rpx solid transparent;
      border-top: 14rpx solid #06ae57;
      border-left: 14rpx solid #06ae57;
      transform: rotate(720deg);
      animation: rotate 3s infinite ease-in-out;
    }

    @keyframes rotate {
      100% {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
