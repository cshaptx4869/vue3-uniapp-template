/**
 * 检查新版本更新
 */
export function checkForUpdate() {
  const updateManager = uni.getUpdateManager();
  // 监听向微信后台请求检查更新结果事件。微信在小程序冷启动时自动检查更新，不需由开发者主动触发。
  updateManager.onCheckForUpdate(function (res) {
    //是否有新版本
    console.log(res.hasUpdate ? "有小程序新版本" : "无小程序新版本");
  });
  //监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
  updateManager.onUpdateReady(function () {
    uni.showModal({
      title: "更新提示",
      content: "新版本已经准备好，是否重启应用？",
      success(res) {
        if (res.confirm) {
          // 强制小程序重启并使用新版本。在小程序新版本下载完成后（即收到 onUpdateReady 回调）调用
          updateManager.applyUpdate();
        }
      },
    });
  });
  // 监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
  updateManager.onUpdateFailed(function () {
    uni.showToast({
      title: "小程序更新失败，请刷新后重试",
    });
  });
}

/**
 * 导航栏高度(针对小程序)
 * @returns
 */
export function navigationBarHeight() {
  const { top, height } = uni.getMenuButtonBoundingClientRect();
  return `${top + height + 8}px`;
}

/**
 * 解析url查询参数
 * @param {String} url
 * @returns
 */
export function parseURLSearchParams(url = "") {
  const params = {};
  url = decodeURIComponent(url);
  if (url.includes("?")) {
    const pairs = url.split("?")[1].split("&");
    pairs.forEach((item) => {
      const [key, value] = item.split("=");
      if (params.hasOwnProperty(key)) {
        if (Array.isArray(params[key])) {
          params[key].push(value);
        } else {
          params[key] = [params[key], value];
        }
      } else {
        params[key] = value;
      }
    });
  }
  return params;
}

/**
 * 地理位置授权申请
 * @returns
 */
export function locationScope() {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: (res) => {
        // console.log('获取设置', res)
        if (res.authSetting["scope.userLocation"] === false) {
          //申请获取地理位置授权
          uni.authorize({
            scope: "scope.userLocation",
            success: () => {
              resolve("用户同意授权");
            },
            fail: () => {
              uni.showModal({
                title: "地理位置权限设置",
                content:
                  '请在"位置消息"勾选仅在使用小程序期间，否则可能无法正常提供服务',
                success: function (res) {
                  if (res.confirm) {
                    //打开设置（用户发生点击行为后，才可以跳转打开设置页）
                    uni.openSetting({
                      withSubscriptions: true,
                    });
                  }
                },
              });
              reject("用户拒绝授权");
            },
          });
        } else {
          // 已同意授权的
          resolve("用户已同意授权");
        }
      },
    });
  });
}

/**
 * 消息订阅
 * @param {Array} tmplIds
 * @returns
 */
export function subscribeMessage(tmplIds = []) {
  return new Promise((resolve, reject) => {
    uni.requestSubscribeMessage({
      tmplIds: tmplIds,
      success: (res) => {
        const acceptTmplIds = tmplIds.filter((tmplId) => {
          return res[tmplId] === "accept";
        });
        resolve(acceptTmplIds);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

/**
 * 当前路由
 * @returns
 */
export function currentRoute() {
  const pages = getCurrentPages();
  if (pages.length === 0) {
    return;
  }
  const currentPage = pages[pages.length - 1];
  return currentPage?.$page?.fullPath || currentPage.route;
}

/**
 * 对象属性按字典排序
 * @param {Object} obj
 * @returns
 */
export function ksort(obj = {}) {
  const keys = Object.keys(obj).sort();
  const newObj = {};
  keys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
}
