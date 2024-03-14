import App from "./App";
import { createSSRApp } from "vue";
import { setupStore, setupUV, setupHttp } from "@/plugins";

export function createApp() {
  const app = createSSRApp(App);
  app.use(setupUV).use(setupHttp).use(setupStore);
  return {
    app,
  };
}
