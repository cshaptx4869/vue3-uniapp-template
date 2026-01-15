import { cacheInstance } from "./cache";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * 设置 Token
 * @param {String} value Token值
 * @param {Boolean} refresh 是否是RefreshToken
 * @param {Number} expire 过期时间，单位秒
 */
function setToken(value, refresh = false, expire = 0) {
  cacheInstance.set(refresh ? REFRESH_TOKEN_KEY : ACCESS_TOKEN_KEY, value, expire);
}

/**
 * 获取 Token
 * @param {Boolean} refresh 是否是RefreshToken
 * @returns {String} Token值
 */
function getToken(refresh = false) {
  return cacheInstance.get(refresh ? REFRESH_TOKEN_KEY : ACCESS_TOKEN_KEY);
}

/**
 * 清除 Token
 */
function removeToken() {
  cacheInstance.delete(ACCESS_TOKEN_KEY);
  cacheInstance.delete(REFRESH_TOKEN_KEY);
}

export { setToken, getToken, removeToken };
