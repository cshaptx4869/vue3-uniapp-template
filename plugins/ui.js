import uvUI from "@/uni_modules/uv-ui-tools";

export function setupUI(app) {
  // UV扩展配置 https://www.uvui.cn/components/setting.html
  app.use(uvUI);
  // 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
  uni.$uv.setConfig({
    // 修改$uv.config对象的属性
    config: {
      // 修改默认单位为rpx，相当于执行 uni.$uv.config.unit = 'rpx'
      // 在用于传入组件大小参数为数值时，就默认为rpx
      unit: "rpx",
    },
    // 修改$uv.props对象的属性
    props: {},
  });
}
