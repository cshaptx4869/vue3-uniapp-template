import AuthAPI from "@/api/modules/auth";
import { store } from "@/store";
import { cache } from "@/utils/cache";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const ACCESS_TOKEN_KEY = "accessToken";
  const REFRESH_TOKEN_KEY = "refreshToken";
  const accessToken = ref(cache(ACCESS_TOKEN_KEY) ?? "");
  const refreshToken = ref(cache(REFRESH_TOKEN_KEY) ?? "");
  const isLoggedIn = computed(() => !!accessToken.value);

  watch(accessToken, (newValue) => cache(ACCESS_TOKEN_KEY, newValue || null));
  watch(refreshToken, (newValue) => cache(REFRESH_TOKEN_KEY, newValue || null));

  // 注册
  async function signUp(payload) {
    const response = await AuthAPI.signUp(payload);
    const prefix = response.tokenType ? `${response.tokenType} ` : "";
    accessToken.value = prefix + response.accessToken;
    refreshToken.value = prefix + response.refreshToken;
    return response;
  }

  // 登录
  async function signIn(payload) {
    const response = await AuthAPI.signIn(payload);
    const prefix = response.tokenType ? `${response.tokenType} ` : "";
    accessToken.value = prefix + response.accessToken;
    refreshToken.value = prefix + response.refreshToken;
    return response;
  }

  // 登出
  function signOut() {
    accessToken.value = "";
    refreshToken.value = "";
  }

  // 刷新token
  async function refresh(payload) {
    const response = await AuthAPI.refreshToken(payload);
    const prefix = response.tokenType ? `${response.tokenType} ` : "";
    accessToken.value = prefix + response.accessToken;
    return response;
  }

  return {
    accessToken,
    refreshToken,
    isLoggedIn,
    signUp,
    signIn,
    signOut,
    refresh,
  };
});

// 手动提供给 useStore() 函数 pinia 实例
// https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
export function useAuthStoreHook() {
  return useAuthStore(store);
}
