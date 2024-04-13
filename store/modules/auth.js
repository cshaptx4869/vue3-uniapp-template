import { defineStore } from "pinia";
import { ref } from "vue";
import { cache } from "@/utils/cache";
import { store } from "@/plugins/store";

export const useAuthStore = defineStore("auth", () => {
  const ACCESS_TOKEN = "accessToken";
  const REFRESH_TOKEN = "refreshToken";

  const accessToken = ref(cache(ACCESS_TOKEN) ?? "");
  const refreshToken = ref(cache(REFRESH_TOKEN) ?? "");

  // 注册
  async function signUp(payload) {
    const response = await uni.$api.auth.signUpApi(payload);
    cache(ACCESS_TOKEN, response.accessToken);
    cache(REFRESH_TOKEN, response.refreshToken);
    accessToken.value = response.accessToken;
    refreshToken.value = response.refreshToken;
    return response;
  }

  // 登录
  async function signIn(payload) {
    const response = await uni.$api.auth.signInApi(payload);
    cache(ACCESS_TOKEN, response.accessToken);
    cache(REFRESH_TOKEN, response.refreshToken);
    accessToken.value = response.accessToken;
    refreshToken.value = response.refreshToken;
    return response;
  }

  // 刷新token
  async function refresh(payload) {
    const response = await uni.$api.auth.refreshApi(payload);
    cache(ACCESS_TOKEN, response.accessToken);
    accessToken.value = response.accessToken;

    return response;
  }

  // 退出登录
  function signOut() {
    cache(ACCESS_TOKEN, null);
    cache(REFRESH_TOKEN, null);
    accessToken.value = "";
    refreshToken.value = "";
  }

  return {
    accessToken,
    refreshToken,
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
