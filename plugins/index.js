import setupUV from "@/uni_modules/uv-ui-tools";
import { setupStore } from "./store";
import { setupHttp } from "./http";
import { setupRouter } from "./router";
import { setupI18n } from "./i18n";

export default {
  install(app) {
    // 状态管理
    app.use(setupStore);
    // UV扩展配置 https://www.uvui.cn/components/setting.html
    app.use(setupUV);
    // 请求响应拦截
    app.use(setupHttp);
    // 路由拦截
    app.use(setupRouter);
    // 国际化
    app.use(setupI18n);
  },
};
