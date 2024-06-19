import { createPinia } from "pinia";

const store = createPinia();

export function setupStore(app) {
  app.use(store);
}

export { store };

export * from "./modules/user";
export * from "./modules/auth";
