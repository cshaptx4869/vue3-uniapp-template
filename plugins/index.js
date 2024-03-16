import setupUV from "@/uni_modules/uv-ui-tools";
import { setupStore } from "./store";
import { setupHttp } from "./http";
import { setupRouter } from "./router";

export default {
  install(app) {
    // UV扩展配置 https://www.uvui.cn/components/setting.html
    app.use(setupUV);
    // 请求响应拦截
    app.use(setupHttp);
    // 路由拦截
    app.use(setupRouter);
    // 状态管理 https://pinia.vuejs.org/zh/
    app.use(setupStore);
  },
};
