/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2021-06-20 21:02:34
 */

export const set = 'set$';
export const brandName = '深圳市知鸣智能科技有限公司'; // slogan

// 开发环境默认配置,本地环境测试配置
const _serverIp = 'http://127.0.0.1';
const _localIp = 'http://127.0.0.1';
const _port = '80';
let _baseURL = `${_localIp}`;
// let _mockURL = "http://localhost:1111/";

// if (process.env.NODE_ENV === 'testing') {
//   // 测试环境
//   _mockURL = 'http://localhost:1111/';
//   _port = '1111';
//   _baseURL = `${_serverIp}:${_port}`;
// }
if (process.env.NODE_ENV === 'production') {
  // 发布环境
  // _port = "80";
  // _serverIp = "127.0.0.1";
  // _baseURL = `${_serverIp}:${_port}`;
  _baseURL = '';
}

export const serverIp = _serverIp;
export const path = '/api'; // /mock,api
export const timeout = '65000'; // 接口超时限制(ms)
export const baseURL = _baseURL;
// export const mockURL = _mockURL;
