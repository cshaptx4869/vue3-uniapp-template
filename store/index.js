import { createPinia } from "pinia";

export const store = createPinia();

export function setupStore(app) {
  app.use(store);
}

export * from "./modules/user";
export * from "./modules/auth";
