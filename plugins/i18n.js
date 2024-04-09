import { createI18n } from "vue-i18n"; // v9.x
import messages from "@/locale";

const i18n = createI18n({
  legacy: false, // 必须设置false才能使用Composition API
  globalInjection: true, // 为每个组件注入$为前缀的全局属性和函数
  locale: uni.getLocale(),
  messages,
});

export function setupI18n(app) {
  app.use(i18n);
}

export { i18n };
