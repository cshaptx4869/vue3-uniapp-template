import App from "./App";
import { createSSRApp } from "vue";
import setupPlugins from "@/plugins";

export function createApp() {
  const app = createSSRApp(App);
  app.use(setupPlugins);
  return {
    app,
  };
}
