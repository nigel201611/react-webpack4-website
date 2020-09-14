/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-14 18:00:42
 */

export const set = "set$";
export const brandName = "NRI"; // slogan

// 开发环境默认配置
let _serverIp = "http://192.168.1.222";
let _port = "1111";
let _baseURL = `${_serverIp}:${_port}`;
let _mockURL = "http://localhost:1111/";

if (process.env.NODE_ENV === "testing") {
  // 测试环境
  _mockURL = "http://localhost:1111/";
  _port = "1111";
  _baseURL = `${_serverIp}:${_port}`;
}
if (process.env.NODE_ENV === "production") {
  // 发布环境
  _port = "1111";
  _serverIp = "http://192.168.1.123";
  _baseURL = `${_serverIp}:${_port}`;
}

export const serverIp = _serverIp;
export const path = "/mock";
export const timeout = "15000"; // 接口超时限制(ms)
export const baseURL = _mockURL; //本地使用mock数据测试，真正服务可以修改为具体的服务地址
export const mockURL = _mockURL;
