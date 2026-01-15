# vue3-uniapp-template

### 简介

vue3-uniapp-template 是基于 vue3 的 uniapp 快速开发模板，包含状态管理、网络请求、路由拦截、UI组件、国际化、token 无感刷新、接口签名等常用功能。

主要使用的技术栈：[uniapp](https://uniapp.dcloud.net.cn/)、[vue3](https://cn.vuejs.org/)、[pinia](https://pinia.vuejs.org/zh/)、[vite](https://cn.vitejs.dev/)、[vue-i18n](https://kazupon.github.io/vue-i18n/)、[uv-ui](https://www.uvui.cn/) 。

### 项目启动

```bash
# 克隆代码
#git clone https://gitee.com/cshaptx4869/vue3-uniapp-template.git
git clone https://github.com/cshaptx4869/vue3-uniapp-template.git

# 切换目录
cd vue3-uniapp-template

# 安装依赖
# 使用pnpm也行，但在使用过程中发现一些奇葩的问题，比如安装某个包后引入使用时，会报某个依赖库找不到错误，也不清楚是不是HBuilderX的Bug
npm install

# 启动HBuilderX，导入并运行项目
```

使用 HBuilderX 而不是 cli 创建项目的主要理由（摘自[官方文档](https://uniapp.dcloud.net.cn/quickstart-cli.html#clidiff)）：

- HBuilderX 为 uni-app 做了大量优化，其他 ide 搭配 uni-app 使用也可以用，但没有为 uni-app 优化过。
- 其他 ide 没有 uni-app 的 app 和 uniCloud 的运行、调试工具。这些工具在 HBuilderX 里。如开发 app 和 uniCloud，必须使用 HBuilderX。

### 效果预览

![](https://github.com/user-attachments/assets/6ad5b410-e288-4291-98af-8c2e47585c23)

### 目录结构

```
vue3-uniapp-template
├─ .commitlintrc.js
├─ .editorconfig
├─ .env.development					   // 运行环境变量
├─ .env.production					   // 发行环境变量
├─ .gitignore
├─ .lintstagedrc.js
├─ .prettierignore
├─ .prettierrc.js
├─ api								   // api管理
│  ├─ index.js
│  └─ modules						   // api模块化
│     ├─ auth.js
│     └─ user.js
├─ App.vue
├─ components						   // 项目组件库
│  ├─ IconFont                         // 图标字体组件
│  │  ├─ iconfont.css
│  │  ├─ iconfont.json
│  │  ├─ iconfont.ttf
│  │  ├─ IconFont.vue
│  │  ├─ iconfont.woff
│  │  └─ iconfont.woff2
│  └─ LangSelect					   // 语言切换组件
│     └─ LangSelect.vue
├─ hooks							   // hooks管理
│  └─ usePermission.js			       // 登录鉴权hook
├─ index.html
├─ LICENSE
├─ locale							   // 国际化管理
│  ├─ en.json
│  ├─ index.js
│  ├─ ja.json
│  ├─ uni-app.ja.json
│  ├─ zh-Hans.json
│  └─ zh-Hant.json
├─ main.js
├─ manifest.json
├─ package.json
├─ pages							   // 页面管理
│  ├─ 404
│  │  └─ 404.vue
│  ├─ demo
│  │  ├─ demo.vue
│  │  └─ z-paging.vue
│  ├─ index
│  │  └─ index.vue
│  ├─ login
│  │  └─ login.vue
│  └─ webview
│     └─ webview.vue
├─ pages.json						   // 页面路由
├─ pagesA							   // 分包A页面管理
│  └─ test
│     └─ test.vue
├─ plugins							   // 插件管理
│  ├─ index.js
│  ├─ request.js					   // 网络请求
│  └─ uv.js							   // UV-UI
├─ README.md
├─ router
│  ├─ guard.js                         // 路由守卫
│  ├─ index.js
│  └─ whitelist.js
├─ static							   // 静态资源管理
│  ├─ 404.png
│  ├─ logo.png
│  └─ tabbar
│     ├─ demo.png
│     ├─ demo_HL.png
│     ├─ index.png
│     └─ index_HL.png
├─ store							   // store管理
│  ├─ index.js
│  └─ modules						   // store模块化
│     ├─ auth.js
│     └─ user.js
├─ uni.scss
├─ uni_modules
├─ utils                               // 工具管理
│  ├─ bcmath.js                        // 高精度计算
│  ├─ cache.js                         // 缓存
│  ├─ index.js
│  └─ token.js                         // token管理
└─ vite.config.js
```

这边提一嘴，uniapp 默认启用[easycom 组件规范](https://uniapp.dcloud.net.cn/component/#easycom)

- 只要组件安装在项目的 components 目录下或 uni_modules 目录下，并符合`components/组件名称/组件名称.(vue|uvue)`目录结构。就可以不用引用、注册，直接在页面中使用。
- 如果你的组件名称或路径不符合 easycom 的默认规范，可以在 pages.json 的 easycom 节点进行个性化设置，自定义匹配组件的策略。

### 登录鉴权

页面是否需要登录，只需在 pages.json 文件中需要鉴权的页面下设置 [needLogin](https://uniapp.dcloud.net.cn/collocation/pages.html#pages) 为 true 即可，比如

```json
{
  "pages": [
    {
      "path": "pages/test/test",
      "needLogin": true,
      "style": {
        "navigationBarTitleText": "",
      },
    }
  ]
}
```

注意：拦截 uni.switchTab 本身没有问题。但是在微信小程序端点击 tabbar 的底层逻辑并不是触发 uni.switchTab。所以误认为拦截无效，此类场景的解决方案是在 tabbar 页面的页面生命周期 onShow 中处理。

```vue
<template>
  <view class="container">
    <view>我是Tabbar页面</view>
  </view>
</template>

<script setup lang="ts">
// 引入鉴权hooks
import { usePermission } from "@/hooks/usePermission";
import { onShow } from "@dcloudio/uni-app";

onShow(async () => {
  console.log("tabbar page onShow");
  const hasPermission = await usePermission();
  console.log(hasPermission ? "已登录" : "未登录，拦截跳转");
  // 以下开始写业务逻辑...
});
</script>

<style lang="scss" scoped></style>
```

### 网络请求

网络请求封装文件：plugins/request.js 文件

- 默认未启用接口签名，可以修改 `API_SAFE` 为 true 启用，并建议修改 `API_KEY` 值。
- 默认未启用 refresh token，可以修改 `ENABLED_REFRESH_TOKEN` 为 true 启用。
- 根据实际业务情况修改 `HeaderEnum`、`CodeEnum` 中对应的内容。

### 注意事项

- 接口请求地址在根目录下的 `.env.xxx` 文件配置（其中 development 为 “运行” 环境，production 为 “发行” 环境）
- 打开 uniapp 插件市场，搜索 [Prettier](https://ext.dcloud.net.cn/plugin?name=formator-prettier)，点击 “下载插件并导入HBuilderX” 安装插件，并配置 Prettier 插件

![](https://github.com/user-attachments/assets/1ed4650a-abf5-4bb2-9533-0254c7458767)

- 设置 HBuilderX 保存时自动格式化

![](https://github.com/user-attachments/assets/420263c1-1279-46f8-b99e-9d25b7beb50a)

- Git 提交使用 `npm run commit` 命令

![](https://github.com/user-attachments/assets/936516a5-9590-429e-8473-d048653d9f50)

- Web 端发行时慎选树摇优化，会有奇葩的问题... 比如 uv-ui 有的组件没有被打包进去😱

![](https://github.com/user-attachments/assets/21d5032d-a166-4040-b135-18aff8fe1646)

- 其他 HBuilderX 插件推荐：[eslint-plugin-vue](https://ext.dcloud.net.cn/plugin?id=2005)、[eslint-js](https://ext.dcloud.net.cn/plugin?id=2037)

### 移除所有示例代码

1. 移除 pagesA 目录
2. 移除 pages/demo 目录
3. 移除 pages.json 中无用路由以及 subPackages、preloadRule、tabBar
4. 移除 manifest.json 中 mp-weixin 下的 permission、requiredPrivateInfos 配置
5. 修改首页、登录页内容
