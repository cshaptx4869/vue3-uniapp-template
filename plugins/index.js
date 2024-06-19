import { setupI18n } from "@/locale";
import { setupStore } from "@/store";
import { setupPermission } from "./permission";
import { setupUI } from "./ui";

export default {
  install(app) {
    // UI扩展配置
    app.use(setupUI);
    // 状态管理
    app.use(setupStore);
    // 国际化
    app.use(setupI18n);
    // 路由拦截
    app.use(setupPermission);
  },
};
