# vue3-uniapp-template

### 简介

vue3-uniapp-template 是基于 vue3 的 uniapp 快速开发模板，包含状态管理、网络请求、路由拦截、UI组件、国际化、Token无感刷新、接口签名等常用功能。

主要使用的技术栈：[uniapp](https://uniapp.dcloud.net.cn/)、[vue3](https://cn.vuejs.org/)、[pinia](https://pinia.vuejs.org/zh/)、[vite](https://cn.vitejs.dev/)、[vue-i18n](https://kazupon.github.io/vue-i18n/)、[uv-ui](https://www.uvui.cn/) 。

### 项目启动

```bash
# 克隆代码
git clone https://github.com/cshaptx4869/vue3-uniapp-template.git

# 切换目录
cd vue3-uniapp-template

# 安装 pnpm
npm install pnpm -g

# 安装依赖
pnpm install

# 启动HBuilderX运行项目
```

## 效果预览

![](https://github.com/cshaptx4869/vue3-uniapp-template/assets/31907940/e9cade4a-ffa6-44a9-b688-de08f2eb5d60)

## 目录结构

```
vue3-uniapp-template
├─ .editorconfig
├─ .env.development					// 运行环境变量
├─ .env.production					// 发行环境变量
├─ .gitignor
├─ .prettierignore
├─ api								      // api管理
│  ├─ index.js
│  └─ modules						    // api模块化
│     ├─ auth.js
│     └─ user.js
├─ App.vue
├─ commitlint.config.js
├─ components						    // 项目组件库
│  ├─ LangSelect					  // 语言切换组件
│  │  └─ LangSelect.vue
├─ hooks							      // hooks管理
│  └─ usePermission.js			// 登录鉴权hook
├─ index.html
├─ LICENSE
├─ lint-staged.config.js
├─ locale							      // 国际化管理
│  ├─ en.json
│  ├─ index.js
│  ├─ ja.json
│  ├─ uni-app.ja.json
│  ├─ zh-Hans.json
│  └─ zh-Hant.json
├─ main.js
├─ manifest.json
├─ package.json
├─ pages							      // 页面管理
│  ├─ 404
│  │  └─ 404.vue
│  ├─ index
│  │  └─ index.vue
│  ├─ login
│  │  └─ login.vue
│  └─ webview
│     └─ webview.vue
├─ pages.json						    // 页面路由
├─ pagesA							      // 分包A页面管理
│  └─ test
│     └─ test.vue
├─ plugins							    // 插件管理
│  ├─ index.js
│  ├─ permission.js					// 路由拦截
│  └─ ui.js							    // UV-UI扩展配置
├─ prettier.config.js
├─ README.md
├─ static							      // 静态资源管理
│  ├─ 404.png
│  └─ logo.png
├─ store							      // store管理
│  ├─ index.js
│  └─ modules						    // store模块化
│     ├─ auth.js
│     └─ user.js
├─ uni.scss
├─ utils                    // 工具管理
│  ├─ cache.js              // 缓存
│  └─ request.js            // 网络请求
└─ vite.config.js
```

### 注意事项

- 接口请求地址在根目录下的 .env.xxx 文件配置（development 为 “运行” 环境，production 为 “发行” 环境）
- 打开 [uniapp 插件市场](https://ext.dcloud.net.cn)，搜索 [Prettier](https://ext.dcloud.net.cn/plugin?name=formator-prettier)，点击 “下载插件并导入HBuilderX” 安装插件，并配置 Prettier 插件

![](https://img2024.cnblogs.com/blog/1215492/202403/1215492-20240321105454228-124948398.png)

- 设置 HBuilderX 保存时自动格式化

![](https://img2024.cnblogs.com/blog/1215492/202403/1215492-20240321105507711-1226718546.png)

- Git 提交使用 `pnpm run commit` 命令

![](https://img2024.cnblogs.com/blog/1215492/202403/1215492-20240321105520195-1987680185.png)

- Web端发行时慎选树摇优化，会有奇葩的问题...

![](https://img2024.cnblogs.com/blog/1215492/202404/1215492-20240401220614263-1710809111.png)

- 其他 HBuilderX 插件推荐：[eslint-plugin-vue](https://ext.dcloud.net.cn/plugin?id=2005)、[eslint-js](https://ext.dcloud.net.cn/plugin?id=2037)
