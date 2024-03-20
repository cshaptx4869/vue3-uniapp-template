import { defineStore } from "pinia";
import { ref } from "vue";
import { cache } from "@/utils/cache";

export const useUserStore = defineStore("user", () => {
  const token = ref(cache("token") ?? "");
  const userInfo = ref({
    mobile: "",
  });

  // 注册
  async function signUp(payload) {
    const response = await uni.$api.user.signUpApi(payload);
    cache("token", response.access_token, response.expires_in);
    token.value = response.access_token;
    return response;
  }

  // 登录
  async function signIn(payload) {
    const response = await uni.$api.user.signInApi(payload);
    cache("token", response.access_token, response.expires_in);
    token.value = response.access_token;
    return response;
  }

  // 退出登录
  function signOut() {
    cache("token", null);
    token.value = "";
  }

  return {
    token,
    userInfo,
    signUp,
    signIn,
    signOut,
  };
});
