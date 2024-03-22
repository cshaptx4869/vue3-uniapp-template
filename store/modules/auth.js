import { defineStore } from "pinia";
import { ref } from "vue";
import { cache } from "@/utils/cache";
import { signUpApi, signInApi, refreshApi } from "@/api/modules/auth";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref(cache(ACCESS_TOKEN) ?? "");
  const refreshToken = ref(cache(REFRESH_TOKEN) ?? "");

  // 注册
  async function signUp(payload) {
    const response = await signUpApi(payload);
    cache(ACCESS_TOKEN, response.accessToken);
    cache(REFRESH_TOKEN, response.refreshToken);
    accessToken.value = response.accessToken;
    refreshToken.value = response.refreshToken;
    return response;
  }

  // 登录
  async function signIn(payload) {
    const response = await signInApi(payload);
    cache(ACCESS_TOKEN, response.accessToken);
    cache(REFRESH_TOKEN, response.refreshToken);
    accessToken.value = response.accessToken;
    refreshToken.value = response.refreshToken;
    return response;
  }

  // 刷新token
  async function refresh(payload) {
    const response = await refreshApi(payload);
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
