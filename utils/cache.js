/**
 * 缓存管理类
 */
class Cache {
  /**
   * 写入缓存
   * @param {String} key 缓存键名
   * @param {String} value 缓存值
   * @param {number} expire 过期时间，秒
   * @returns
   */
  set(key, value = "", expire = 0) {
    let ttl = expire > 0 ? Date.now() + expire * 1000 : 0;
    return uni.setStorageSync(key, {
      value,
      ttl,
    });
  }

  /**
   * 读取缓存
   * @param {String} key 缓存键名
   * @param {*} defalut 默认值
   * @returns {*} 缓存值
   */
  get(key, defalut = null) {
    const data = uni.getStorageSync(key);
    if (data && typeof data === "object") {
      // 没有有效期
      if (data.ttl === 0) {
        return data.value;
      }
      return Date.now() > data.ttl ? defalut : data.value;
    }
    return defalut;
  }

  /**
   * 删除缓存
   * @param {String} key 缓存键名
   * @returns
   */
  delete(key) {
    return uni.removeStorageSync(key);
  }

  /**
   * 清空缓存
   * @returns
   */
  clear() {
    return uni.clearStorageSync();
  }
}

export const cacheInstance = new Cache();

/**
 * 缓存操作(获取、删除、设置)
 * @param name string
 * @param value any
 * @param expire int 有效时间，秒
 */
export function cache(name = null, value = "", expire = 0) {
  if (name === null) {
    return cacheInstance;
  }

  if (value === "") {
    return cacheInstance.get(name);
  } else if (value === null) {
    return cacheInstance.delete(name);
  } else {
    return cacheInstance.set(name, value, expire);
  }
}
