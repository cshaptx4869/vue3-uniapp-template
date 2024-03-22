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
