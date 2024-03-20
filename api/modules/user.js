// test user request api
const http = uni.$uv.http;

// test get api
export function getUserList(params) {
  return http.get("/user/list", {
    params,
    custom: {
      auth: true,
      loading: true,
    },
  });
}

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
