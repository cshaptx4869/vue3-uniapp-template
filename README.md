# vue3-uniapp-template

### 简介

vue3-uniapp-template 是基于 vue3 的 uniapp 快速开发模板，包含状态管理、网络请求、路由拦截、UI组件等常用功能。

主要使用的技术栈：[uniapp](https://uniapp.dcloud.net.cn/)、[vue3](https://cn.vuejs.org/)、[pinia](https://pinia.vuejs.org/zh/)、[vite](https://cn.vitejs.dev/)、[uv-ui](https://www.uvui.cn/) 。



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
![](https://img2024.cnblogs.com/blog/1215492/202403/1215492-20240321105000927-2080988420.png)



## 目录结构
```
|-- api                          // 接口管理
|   |-- index.js
|   |-- modules                  // api模块化目录
|       |-- user.js
|-- components                   // 项目组件库
|   |-- HelloWorld               // 测试组件
|       |-- HelloWorld.vue
|-- hooks                        
|   |-- usePermission.js         // 微信小程序端点击tabbar的底层逻辑不触发uni.switchTab的特殊处理
|-- pages
|   |-- index
|   |   |-- index.vue
|   |-- login
|       |-- login.vue
|-- pagesA                       // 分包A
|   |-- test
|       |-- test.vue
|-- plugins                      // 插件管理
|   |-- http.js                  // 网络请求
|   |-- index.js                 
|   |-- router.js                // 路由拦截
|   |-- store.js                 // 状态管理  
|-- static
|   |-- logo.png
|-- store                        // pinia
|   |-- index.js
|   |-- modules                  // store模块化目录
|       |-- user.js
|-- uni_modules
|-- utils
    |-- cache.js                 // 缓存管理工具
```



### 注意事项

- 接口请求地址在根目录下的 .env.xxx 文件配置（development 为 “运行” 环境，production 为 “发行” 环境）
- 打开 [uniapp 插件市场](https://ext.dcloud.net.cn)，搜索 [Prettier](https://ext.dcloud.net.cn/plugin?name=formator-prettier)，点击 “下载插件并导入HBuilderX” 安装插件，并配置 Prettier 插件

![](https://img2024.cnblogs.com/blog/1215492/202403/1215492-20240321105454228-124948398.png)

- 设置 HBuilderX 保存时自动格式化

![](https://img2024.cnblogs.com/blog/1215492/202403/1215492-20240321105507711-1226718546.png)

- Git 提交使用 `pnpm run commit` 命令

![](https://img2024.cnblogs.com/blog/1215492/202403/1215492-20240321105520195-1987680185.png)

