import { AuthAPI } from "@/api";
import { i18n } from "@/locale";
import { redirectToLoginPage } from "@/router";
import { useAuthStore } from "@/store";
import { ksort } from "@/utils";
import { getToken } from "@/utils/token";
import MD5 from "crypto-js/md5";

// 接口签名
const API_SAFE = false;
const API_KEY = "8oJliIOB2gKLFHec0jmM7Z5S9Y4UdQnP";
// 启用 refreshToken
const ENABLED_REFRESH_TOKEN = false;
// 请求头
const HeaderEnum = {
  ACCESS_TOKEN: "Authorization",
  REFRESH_TOKEN: "Pass",
  I18N: "I18n",
  SIGN: "Sign",
};
// code值
const CodeEnum = {
  SUCCESS: 200,
  ACCESS_TOKEN_INVALID: 4003,
  REFRESH_TOKEN_INVALID: 4004,
};

/** 退出登录（会重定向到登录页） */
function signOut() {
  useAuthStore().signOut();
  redirectToLoginPage();
}

/**
 * 设置请求配置
 * @param {string} baseURL 域名
 * @see https://www.uvui.cn/js/http.html
 * @see https://github.com/lei-mu/luch-request
 */
export function setupRequest(baseURL) {
  // 请求重试队列，每一项将是一个待执行的函数形式
  let pendingRequests = [];
  // 是否正在刷新token的标记
  let isRefreshing = false;

  // 初始化请求配置
  uni.$uv.http.setConfig((config) => {
    // 域名设置
    config.baseURL = baseURL;
    // 全局header
    config.header = {};
    config.method = "GET";
    // 设置为json，返回后会对数据进行一次JSON.parse()
    config.dataType = "json";
    // #ifndef MP-ALIPAY
    config.responseType = "text";
    // #endif
    // 全局自定义参数默认值
    // 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
    config.custom = {
      // 鉴权(携带 accessToken)
      auth: false,
      // 刷新token(携带 refreshToken)
      withRefreshToken: false,
      // 请求接口展示Loading
      loading: false,
      // Loading中是否遮罩
      loadingMask: true,
      // Loading文本
      loadingText: "正在加载",
    }; // 全局自定义参数默认值
    // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
    config.timeout = 60000;
    // #endif
    // #ifdef APP-PLUS
    // 验证 ssl 证书 仅5+App安卓端支持（HBuilderX 2.3.3+）
    config.sslVerify = true;
    // #endif
    // #ifdef H5
    // 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
    config.withCredentials = false;
    // #endif
    // #ifdef APP-PLUS
    // DNS解析时优先使用ipv4 仅 App-Android 支持 (HBuilderX 2.8.0+)
    config.firstIpv4 = false;
    // #endif
    // 局部优先级高于全局，返回当前请求的task,options。请勿在此处修改options。非必填
    // config.getTask = (task, options) => {
    //   // 相当于设置了请求超时时间500ms
    //   setTimeout(() => {
    //     task.abort();
    //   }, 500);
    // };
    // 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
    config.validateStatus = (statusCode) => {
      // 若返回false 走响应拦截的错误回调
      return statusCode === 200;
    };
    return config;
  });

  // 请求拦截部分，如配置，每次请求前都会执行
  uni.$uv.http.interceptors.request.use(
    (config) => {
      // loading
      if (config.custom.loading) {
        uni.showLoading({
          title: config.custom.loadingText ?? "正在加载",
          mask: config.custom.loadingMask === true,
        });
      }

      // 引用token
      if (config.custom.auth) {
        config.header[HeaderEnum.ACCESS_TOKEN] = getToken();
      }
      if (config.custom.withRefreshToken) {
        config.header[HeaderEnum.REFRESH_TOKEN] = getToken(true);
      }

      // 生成接口签名
      if (API_SAFE) {
        // nonce参数用于防止重发攻击
        config.params.nonce = uni.$uv.guid(16);
        // timestamp参数用于解决nonce随请求次数无限增多的问题
        config.params.timestamp = Date.now();
        // 将所有请求参数按照字典排序
        const signParams = ksort(uni.$uv.deepMerge(config.data, config.params));
        // 将排序后的参数数组按照 key1=val1&key2=val2 的形式组成字符串，将字符串与API_KEY连接，用md5加密一次(32位小写)，得到sign
        let signStr = "";
        for (const key in signParams) {
          signStr += `${key}=${
            typeof signParams[key] === "object" ? JSON.stringify(signParams[key]) : signParams[key]
          }&`;
        }
        signStr += API_KEY;
        config.header[HeaderEnum.SIGN] = MD5(signStr).toString();
        // console.log(signStr);
      }

      // 国际化标识
      config.header[HeaderEnum.I18N] = i18n.global.locale.value;

      // 最后需要将config进行return
      // 如果return Promise.reject(config)，则会取消本次请求
      return config;
    },
    (config) => {
      return Promise.reject(config);
    }
  );

  // 响应拦截，如配置，每次请求结束都会执行本方法
  uni.$uv.http.interceptors.response.use(
    (response) => {
      /* 对响应成功做点什么 可使用async await 做异步操作*/

      // 取消loading
      if (response.config.custom.loading) {
        uni.hideLoading();
      }

      // 下载文件,直接返回响应对象
      if (response.config.method === "DOWNLOAD") {
        return response;
      }

      // 服务器返回的数据 ｛code:xxx,data:xxx,msg:xxx}
      const { code, data, msg } = response.data;
      // 如果没有 code, 代表这不是项目后端开发的 api
      if (code === undefined) {
        uni.$uv.toast("非本系统的接口");
        return Promise.reject(new Error("non system interface"));
      }
      switch (code) {
        case CodeEnum.SUCCESS:
          // 成功
          return data;
        case CodeEnum.ACCESS_TOKEN_INVALID:
          // 短token无效或过期
          if (ENABLED_REFRESH_TOKEN !== true || getToken(true) === null) {
            signOut();
            return Promise.reject(new Error(msg || "access token invalid"));
          }
          return new Promise((resolve) => {
            // 将resolve放进重试队列，用一个函数形式来保存，等token刷新后重新请求(由新的请求决定promise状态)
            pendingRequests.push(() => resolve(uni.$uv.http.request(response.config)));
            // 刷新短token
            if (!isRefreshing) {
              isRefreshing = true;
              AuthAPI.refreshToken()
                .then(({ tokenType, accessToken }) => {
                  useAuthStore().setToken(tokenType ? `${tokenType} ${accessToken}` : accessToken);
                  pendingRequests.forEach((callback) => callback());
                })
                .finally(() => {
                  pendingRequests = [];
                  isRefreshing = false;
                });
            }
          });
        case CodeEnum.REFRESH_TOKEN_INVALID:
          // 长token无效或过期
          signOut();
          return Promise.reject(new Error(msg || "refresh token invalid"));
        default:
          // 其他错误
          uni.$uv.toast(msg || "系统出错");
          return Promise.reject(new Error(msg || "system error"));
      }
    },
    (response) => {
      /*  对响应错误做点什么 */

      // 取消loading
      if (response.config.custom.loading) {
        uni.hideLoading();
      }

      // 错误提示
      const codeMsg = {
        400: "请求错误",
        401: "未授权",
        403: "拒绝访问",
        404: "请求地址出错",
        405: "请求方式未允许",
        408: "请求超时",
        500: "服务器内部错误",
        501: "服务未实现",
        502: "网关错误",
        503: "服务不可用",
        504: "网关超时",
        505: "HTTP 版本不受支持",
      };
      const errMsg = codeMsg[response.statusCode] ?? "异常错误";
      uni.$uv.toast(errMsg);
      return Promise.reject(new Error(errMsg));
    }
  );

  return uni.$uv.http;
}
