/* uni.$uv 在引入 uv-ui-tools 之后才能使用, 详见 @/uni_modules/uv-ui-tools/index.js */
import uvUI from "@/uni_modules/uv-ui-tools";
import { setupRequest } from "./request";

/**
 * uv-ui扩展配置
 * @param {Vue} app Vue实例
 * @see https://www.uvui.cn/components/setting.html
 */
export function setupUV(app) {
  // 扩展配置 - JS工具库: uv-ui内置的方法默认不再挂载到uni对象之上，也就意味着默认情况下不能在项目中直接使用uni.$uv.xxx使用内置方法。但是可以通过扩展可以解决，通过如下方式进行配置即可
  app.use(uvUI);
  // 扩展配置 - setConfig: 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
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
  // 扩展配置 - Http请求: 初始化请求配置
  setupRequest();
}

export const { http } = uni.$uv;
