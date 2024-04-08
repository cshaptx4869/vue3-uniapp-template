import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname);
  // console.log(env);
  return {
    plugins: [uni()],
    server: {
      port: Number(env.VITE_PORT),
      proxy: {
        [env.VITE_BASE_API]: {
          changeOrigin: true,
          target: env.VITE_BASE_URL,
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_BASE_API), ""),
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
