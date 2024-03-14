import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref({
    mobile: "",
    token: uni.getStorageSync("token") ?? "",
  });

  return {
    user,
  };
});
