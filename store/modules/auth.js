import { store } from "@/store";
import { setToken as _setToken, getToken, removeToken } from "@/utils/token";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // 主要用于需要根据状态更新页面的场景
  const token = ref(getToken() || "");

  // 设置 Token
  const setToken = (value, refresh = false) => {
    _setToken(value, refresh);
    if (!refresh) {
      token.value = value;
    }
  };

  // 登出
  const signOut = () => {
    removeToken();
    token.value = "";
  };

  return {
    token,
    setToken,
    signOut,
  };
});

// 手动提供给 useStore() 函数 pinia 实例
// https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
export function useAuthStoreHook() {
  return useAuthStore(store);
}
