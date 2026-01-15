/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T = any> {
  code: number;
  data: T;
  msg: string;
}
