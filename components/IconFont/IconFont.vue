<template>
  <text
    :class="`iconfont icon-${name}`"
    :style="{
      color: color,
      'font-size': size + 'px',
    }"
    @click="handleClick"
  />
</template>

<script setup>
const emit = defineEmits(["click"]);
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#333333",
  },
  size: {
    type: [Number, String],
    default: 16,
  },
});

function handleClick() {
  emit("click");
}
</script>

<style>
@import "./iconfont.css";
</style>
