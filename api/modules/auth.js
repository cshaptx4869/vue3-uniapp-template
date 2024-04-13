// 注册
export function signUpApi(data) {
  return uni.$uv.http.post("/auth/signup", data, {
    custom: {
      loading: true,
    },
  });
}

// 登录
export function signInApi(data) {
  return uni.$uv.http.post("/auth/signin", data, {
    custom: {
      loading: true,
    },
  });
}

// 刷新token
export function refreshApi(header = {}) {
  return uni.$uv.http.post("/auth/refresh", undefined, {
    header,
  });
}
