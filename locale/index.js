import { createI18n } from "vue-i18n"; // v9.x
import en from "./en.json";
import ja from "./ja.json";
import zhHans from "./zh-Hans.json";
import zhHant from "./zh-Hant.json";

const i18n = createI18n({
  legacy: false, // 必须设置false才能使用Composition API
  globalInjection: true, // 为每个组件注入$为前缀的全局属性和函数
  locale: uni.getLocale(),
  messages: {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant,
    ja,
  },
});

export function setupI18n(app) {
  app.use(i18n);
}

export { i18n };
