import * as api from "@/api";
import { useAuthStore } from "@/store";

/* 拦截器 */
function setupInterceptor() {
  const http = uni.$uv.http;
  const authStore = useAuthStore();
  // 请求重试队列，每一项将是一个待执行的函数形式
  let requests = [];
  // 是否正在刷新token的标记
  let isRefreshing = false;
  // 请求头
  const HEADER_ACCESS_TOKEN = "Authorization";
  const HEADER_REFRESH_TOKEN = "Pass";
  // code值
  const CODE_SUCCESS = 200;
  const CODE_ACCESS_TOKEN = 4003;
  const CODE_REFRESH_TOKEN = 4004;

  // 初始化请求配置
  http.setConfig((config) => {
    // 域名设置
    config.baseURL = import.meta.env.VITE_BASE_URL;
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
      // 鉴权
      auth: false,
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
    // getTask: (task, options) => {
    // 相当于设置了请求超时时间500ms
    //   setTimeout(() => {
    //     task.abort()
    //   }, 500)
    // },
    // 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
    config.validateStatus = (statusCode) => {
      // 若返回false 走响应拦截的错误回调
      return statusCode === 200;
    };
    return config;
  });

  // 请求拦截部分，如配置，每次请求前都会执行
  http.interceptors.request.use((config) => {
    // loading
    if (config.custom.loading) {
      uni.showLoading({
        title: config.custom.loadingText ?? "正在加载",
        mask: config.custom.loadingMask ?? true,
      });
    }

    // 引用token
    if (config.custom.auth) {
      config.header[HEADER_ACCESS_TOKEN] = authStore.accessToken;
    }

    // 最后需要将config进行return
    // 如果return一个false值，则会取消本次请求
    return config;
  });

  // 响应拦截，如配置，每次请求结束都会执行本方法
  http.interceptors.response.use(
    (response) => {
      /* 对响应成功做点什么 可使用async await 做异步操作*/

      // 取消loading
      if (response.config.custom.loading) {
        uni.hideLoading();
      }

      // 服务器返回的数据
      let result = response.data;
      // if 与后台规定的成功码是否正常
      if (result.code == CODE_SUCCESS) {
        return result.result || result.data;
      } else if (result.code == CODE_ACCESS_TOKEN) {
        // 短token失效
        return new Promise((resolve, reject) => {
          // 将resolve放进重试队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push(() => resolve(http.request(response.config)));
          // 刷新短token
          if (!isRefreshing) {
            isRefreshing = true;
            authStore
              .refresh({
                [HEADER_REFRESH_TOKEN]: authStore.refreshToken,
              })
              .then(() => {
                requests.forEach((request) => request());
              })
              .catch(() => {
                authStore.signOut();
                uni.$uv.route({
                  type: "redirectTo",
                  url: "/pages/login/login",
                });
              })
              .finally(() => {
                requests = [];
                isRefreshing = false;
              });
          }
        });
      } else if (result.code == CODE_REFRESH_TOKEN) {
        //长token失效
        return Promise.reject(response);
      } else {
        uni.$uv.toast(result.msg);
      }

      return false;
    },
    (response) => {
      /*  对响应错误做点什么 */
      const codeMessage = {
        404: "您所请求的资源无法找到",
        500: "服务器内部错误，无法完成请求",
      };
      let errorMessage = codeMessage[response.statusCode] ?? response.errMsg;
      uni.$uv.toast(errorMessage);
      return Promise.reject(response);
    }
  );
}

export function setupHttp(app) {
  uni.$api = api;
  app.config.globalProperties.$api = api;
  setupInterceptor();
}
