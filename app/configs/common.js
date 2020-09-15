/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-15 14:16:33
 */

import { login as loginApi } from "@apis/common";

export function parseQueryString(url) {
  const obj = {};
  if (url.indexOf("?") !== -1) {
    const str = url.split("?")[1];
    const strs = str.split("&");
    strs.map((item, i) => {
      const arr = strs[i].split("=");
      /* eslint-disable */
      obj[arr[0]] = arr[1];
    });
  }
  return obj;
}

/* ------------------------- 登陆 -------------------------*/
export const login = (params, success, failure) => {
  loginApi(
    params,
    (response) => {
      sessionStorage.setItem("token", response.data.token);
      if (typeof success === "function") success(response);
    },
    (response) => {
      if (typeof failure === "function") failure(response);
    }
  );
};
/* -------------------------------------------------------*/

// 异步请求需要走redux的方式
export const createAjaxAction = (createdApi, startAction, endAction) => (
  request = {},
  resolve,
  reject,
  config
) => (dispatch) => {
  if (startAction) dispatch(startAction({ req: request, res: {} }));
  const _resolve = (response) => {
    if (endAction) dispatch(endAction({ req: request, res: response }));
    if (resolve) resolve(response);
  };
  return createdApi(request, _resolve, reject, config);
};
