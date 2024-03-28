import { createI18n } from "vue-i18n"; // v9.x
import messages from "@/locale";

const i18n = createI18n({
  locale: uni.getLocale(), // 获取已设置的语言
  messages,
});

export function setupI18n(app) {
  app.use(i18n);
}
