/**
 * 缓存管理类
 */
class Cache {
  // 写入
  set(key, value = "", expire = 0) {
    let ttl = expire > 0 ? Date.now() + expire * 1000 : 0;
    uni.setStorageSync(key, {
      value,
      ttl,
    });
    return true;
  }

  // 读取
  get(key, defalut = null) {
    const data = uni.getStorageSync(key);
    if (data && typeof data === "object") {
      // 没有有效期
      if (data.ttl === 0) {
        return data.value;
      }
      return Date.now() > data.ttl ? null : data.value;
    }
    return defalut;
  }

  // 删除
  delete(key) {
    uni.removeStorageSync(key);
    return true;
  }

  // 清空
  clear() {
    uni.clearStorageSync();
    return true;
  }
}

const cacheInstance = new Cache();
export default cacheInstance;

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
