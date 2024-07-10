import AuthAPI from "@/api/modules/auth";
import { store } from "@/store";
import { cache } from "@/utils/cache";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  // token认证的方式
  const TOKEN_SCHEMA = "Bearer ";
  const ACCESS_TOKEN = "accessToken";
  const REFRESH_TOKEN = "refreshToken";

  // 注册
  async function signUp(payload) {
    const response = await AuthAPI.signUp(payload);
    cache(ACCESS_TOKEN, TOKEN_SCHEMA + response.accessToken);
    cache(REFRESH_TOKEN, TOKEN_SCHEMA + response.refreshToken);
    return response;
  }

  // 登录
  async function signIn(payload) {
    const response = await AuthAPI.signIn(payload);
    cache(ACCESS_TOKEN, TOKEN_SCHEMA + response.accessToken);
    cache(REFRESH_TOKEN, TOKEN_SCHEMA + response.refreshToken);
    return response;
  }

  // 登出
  function signOut() {
    cache(ACCESS_TOKEN, null);
    cache(REFRESH_TOKEN, null);
  }

  // 刷新token
  async function refresh(payload) {
    const response = await AuthAPI.refresh(payload);
    cache(ACCESS_TOKEN, TOKEN_SCHEMA + response.accessToken);
    return response;
  }

  function getAccessToken() {
    return cache(ACCESS_TOKEN);
  }

  function getRefreshToken() {
    return cache(REFRESH_TOKEN);
  }

  function isLoggedIn() {
    return cache(REFRESH_TOKEN) !== null;
  }

  return {
    signUp,
    signIn,
    signOut,
    refresh,
    getAccessToken,
    getRefreshToken,
    isLoggedIn,
  };
});

// 手动提供给 useStore() 函数 pinia 实例
// https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
export function useAuthStoreHook() {
  return useAuthStore(store);
}
