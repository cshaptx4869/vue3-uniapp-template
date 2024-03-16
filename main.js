import App from "./App";
import { createSSRApp } from "vue";
import { setupUV, setupHttp, setupStore, setupRouter } from "@/plugins";

export function createApp() {
  const app = createSSRApp(App);
  app.use(setupUV).use(setupHttp).use(setupStore).use(setupRouter);
  return {
    app,
  };
}
