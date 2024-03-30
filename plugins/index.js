import { setupStore } from "./store";
import { setupUI } from "./ui";
import { setupHttp } from "./http";
import { setupRouter } from "./router";
import { setupI18n } from "./i18n";

export default {
  install(app) {
    // 状态管理
    app.use(setupStore);
    // UI扩展配置
    app.use(setupUI);
    // 请求响应拦截
    app.use(setupHttp);
    // 路由拦截
    app.use(setupRouter);
    // 国际化
    app.use(setupI18n);
  },
};
