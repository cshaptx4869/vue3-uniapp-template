import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname);
  // console.log(env);
  return {
    plugins: [uni()],
    server: {
      port: Number.parseInt(env.VITE_APP_PORT, 10),
      proxy: {
        [env.VITE_APP_PROXY_PREFIX]: {
          changeOrigin: true,
          target: env.VITE_APP_BASE_URL,
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_APP_PROXY_PREFIX), ""),
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  };
});
