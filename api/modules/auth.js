import { http } from "@/plugins/uv";

export class AuthAPI {
  /**
   * 注册
   * @param {{ username: string; password: string }} data - 注册参数
   * @param {string} data.username - 用户名
   * @param {string} data.password - 密码
   * @returns {Promise<{ tokenType: string; accessToken: string; expiresIn: number; refreshToken: string; }>}
   */
  static signUp(data) {
    return http.post("/auth/signup", data, {
      custom: {
        loading: true,
      },
    });
  }

  /**
   * 登录
   * @param {{ username: string; password: string }} data - 登录参数
   * @param {string} data.username - 用户名
   * @param {string} data.password - 密码
   * @returns {Promise<{ tokenType: string; accessToken: string; expiresIn: number; refreshToken: string; }>}
   */
  static signIn(data) {
    return http.post("/auth/signin", data, {
      custom: {
        loading: true,
      },
    });
  }

  /**
   * 刷新访问令牌（access_token）
   * @returns {Promise<{ tokenType: string; accessToken: string; expiresIn: number; }>}
   */
  static refreshToken() {
    return http.post("/auth/refresh", undefined, {
      custom: {
        auth: true,
        withRefreshToken: true,
      },
    });
  }
}
