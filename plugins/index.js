import { setupI18n } from "@/locale";
import { setupStore } from "@/store";
import { setupNavigationGuard } from "@/router/guard";
import { setupUV } from "./uv";

export default {
  install(app) {
    // 状态管理
    app.use(setupStore);
    // 国际化
    app.use(setupI18n);
    // 路由拦截
    app.use(setupNavigationGuard);
    // uvUI
    app.use(setupUV);
  },
};
