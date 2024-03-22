const http = uni.$uv.http;

// 注册
export function signUpApi(data) {
  return http.post("/auth/signup", data, {
    custom: {
      loading: true,
    },
  });
}

// 登录
export function signInApi(data) {
  return http.post("/auth/signin", data, {
    custom: {
      loading: true,
    },
  });
}

// 刷新token
export function refreshApi(header) {
  return http.post("/auth/refresh", undefined, {
    header,
  });
}
