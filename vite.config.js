import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import pkg from "./package.json";

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
          drop_debugger: true,
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify({
        pkg,
        buildTimestamp: Date.now(),
      }),
    },
  };
});
