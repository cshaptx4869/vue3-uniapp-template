// test get api
export function getUserList(params = {}) {
  return uni.$uv.http.get("/user/list", {
    params,
    custom: {
      auth: true,
      loading: true,
    },
  });
}
