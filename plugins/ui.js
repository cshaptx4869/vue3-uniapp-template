import uvUI from "@/uni_modules/uv-ui-tools";

export function setupUI(app) {
  // UV扩展配置 https://www.uvui.cn/components/setting.html
  app.use(uvUI);
  // 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
  uni.$uv.setConfig({
    // 修改$uv.config对象的属性
    config: {
      // 修改默认单位为rpx，相当于执行 uni.$uv.config.unit = 'rpx'
      // 用于在传入组件大小参数为数值时，指定默认单位
      unit: "px",
    },
    // 修改$uv.props对象的属性
    props: {
      // 修改uv-text组件的size参数的默认值，注意：默认值都要用default声明
      text: {
        color: {
          default: "#303133",
        },
      },
      // 其他组件属性配置，具体的参数名称可以去每个组件的props.js中进行查看
      // ......
    },
  });
}
