<template>
  <view>
    <picker
      range-key="label"
      :range="langOptions"
      :value="langIndex"
      @change="handleLangChange"
    >
      <slot>
        <image
          :style="langStyle"
          src="data:image/png;base64,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"
        ></image>
      </slot>
    </picker>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["change"]);
const props = defineProps({
  size: {
    type: Number,
    default: 40,
    required: false,
  },
});

const { locale, t } = useI18n();
const langStyle = {
  width: props.size + "rpx",
  height: props.size + "rpx",
};
const langOptions = computed(() => {
  return [
    { label: t("locale.en"), value: "en" },
    { label: t("locale.zh-hans"), value: "zh-Hans" },
    { label: t("locale.zh-hant"), value: "zh-Hant" },
    { label: t("locale.ja"), value: "ja" },
  ];
});
const langIndex = computed(() => {
  return langOptions.value.findIndex((item) => {
    return item.value === locale.value;
  });
});
function handleLangChange(event) {
  const lang = langOptions.value[event.detail.value].value;
  locale.value = lang;
  uni.setLocale(lang);
  emit("change", lang);
}
</script>

<style lang="scss" scoped></style>
