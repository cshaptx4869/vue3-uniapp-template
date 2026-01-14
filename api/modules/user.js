import { http } from "@/plugins/uv";

export class UserAPI {
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
