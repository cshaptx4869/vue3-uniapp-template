import http from "@/utils/request";

class UserAPI {
  // test get api
  static getUserList(params = {}) {
    return http.get("/user/list", {
      params,
      custom: {
        auth: true,
        loading: true,
      },
    });
  }
}

export default UserAPI;
