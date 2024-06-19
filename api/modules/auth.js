import http from "@/utils/request";

class AuthAPI {
  // 注册
  static signUp(data) {
    return http.post("/auth/signup", data, {
      custom: {
        loading: true,
      },
    });
  }

  // 登录
  static signIn(data) {
    return http.post("/auth/signin", data, {
      custom: {
        loading: true,
      },
    });
  }

  // 刷新token
  static refresh(header = {}) {
    return http.post("/auth/refresh", undefined, {
      header,
    });
  }
}

export default AuthAPI;
