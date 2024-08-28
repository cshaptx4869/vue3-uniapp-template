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
 * @returns {String}
 */
export function navigationBarHeight() {
  const { bottom } = uni.getMenuButtonBoundingClientRect();
  return `${bottom + 8}px`;
}

/**
 * 解析url查询参数
 * @param {String} url
 * @returns {Object}
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
 * 授权申请
 * 注意: 需要授权 scope.userLocation、scope.userLocationBackground、scope.userFuzzyLocation 时必须在 permission 中配置地理位置用途说明
 * @param {String} scope
 * @returns {Promise}
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 */
export function applyAuthorize(scope) {
  const scopeMap = {
    "scope.userLocation": "精确地理位置",
    "scope.userFuzzyLocation": "模糊地理位置",
    "scope.userLocationBackground": "后台定位",
    "scope.record": "麦克风",
    "scope.camera": "摄像头",
    "scope.bluetooth": "蓝牙",
    "scope.writePhotosAlbum": "添加到相册",
    "scope.addPhoneContact": "添加到通讯录",
    "scope.addPhoneCalendar": "添加到日历",
    "scope.werun": "微信运动步数",
    // "scope.address": "通讯地址",
    // "scope.invoiceTitle": "发票抬头",
    // "scope.invoice": "获取发票",
    // "scope.userInfo": "用户信息",
  };
  if (Object.keys(scopeMap).includes(scope) === false) {
    throw new Error("scope 参数非法");
  }

  return new Promise((resolve, reject) => {
    // 获取用户授权设置
    uni.getSetting({
      success: (res) => {
        // console.log("授权状态", res);
        if (res.authSetting[scope] !== true) {
          // 发起授权请求
          uni.authorize({
            scope: scope,
            success: () => {
              resolve("用户同意授权");
            },
            fail: () => {
              reject("用户拒绝授权");
              uni.showModal({
                title: "权限申请",
                content: `请在设置界面中开启[${scopeMap[scope]}]权限，否则可能无法正常提供服务`,
                success: function (res) {
                  if (res.confirm) {
                    // 打开设置界面(用户发生点击行为后，才可以跳转打开设置页)
                    uni.openSetting({
                      withSubscriptions: true,
                    });
                  }
                },
              });
            },
          });
        } else {
          // 已同意授权的
          resolve("用户已授权");
        }
      },
    });
  });
}

/**
 * 消息订阅
 * @param {Array} tmplIds
 * @returns {Promise}
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
        if (err.errCode === 20004) {
          uni.showModal({
            title: "通知管理设置",
            content: '请在"通知管理"中打开"接收通知"，否则可能无法正常提供服务',
            success: function (res) {
              if (res.confirm) {
                uni.openSetting({
                  withSubscriptions: true,
                });
              }
            },
          });
        }
        reject(err);
      },
    });
  });
}

/**
 * 当前路由
 * @returns {String}
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
 * @returns {Object}
 */
export function ksort(obj = {}) {
  const keys = Object.keys(obj).sort();
  const newObj = {};
  keys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
}

/**
 * 查询节点信息
 * 注意：使用 uni.createSelectorQuery() 需要在生命周期 mounted 后进行调用
 * @param {String} selector
 * @param {Boolean} all
 * @returns {Promise}
 */
export function getRect(selector, all = false) {
  return new Promise((resolve) => {
    uni
      .createSelectorQuery()
      [all ? "selectAll" : "select"](selector)
      .boundingClientRect((rect) => {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect);
        }
        if (!all && rect) {
          resolve(rect);
        }
      })
      .exec();
  });
}

/**
 * 比较版本号
 * @param {String} v1
 * @param {String} v2
 * @returns {Number} 1大于 0等于 -1小于
 * @link https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html
 */
export function compareVersion(v1, v2) {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  const len = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < len; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 !== num2) {
      return num1 > num2 ? 1 : -1;
    }
  }

  return 0;
}
