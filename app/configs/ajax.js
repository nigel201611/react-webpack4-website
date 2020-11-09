/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-11-09 17:50:38
 */
import axios from "axios";
import { hashHistory } from "react-router";
import { timeout, baseURL } from "@config";
import { message } from "antd";
// import { toLocaleString } from "core-js/fn/number/epsilon";/

const isProd = process.env.NODE_ENV === "production";

const { CancelToken } = axios;
// 防止连续出现多个用户登录超时的提示
let flag = true;
function logOut(text) {
  if (flag) {
    message.warning(
      text || "User login expired or logged in from another browser"
    );
    hashHistory.replace("/login");
    flag = false;
    setTimeout(() => (flag = true), 0);
  }
}
let baseConfig = {
  url: "/",
  method: "post", // default
  baseURL: "",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {},
  data: {},
  timeout: "",
  withCredentials: isProd ? true : false, // default
  responseType: "json", // default
  maxContentLength: 2000,
  validateStatus(status) {
    return status >= 200 && status < 300; // default
  },
};

baseConfig = { ...baseConfig, timeout: timeout, baseURL: baseURL };

export const oftenFetchByPost = (api, options) => {
  // 当api参数为createApi创建的返回值
  if (typeof api === "function") return api;
  /**
   * 可用参数组合：
   * (data:Object,sucess:Function,failure:Function,config:Object)
   * (data:Object,sucess:Function,config:Object)
   * (data:Object,sucess:Function)
   * (data:Object,config:Object)
   * (data:Object)
   * ()
   */
  return (...rest) => {
    // 参数:(data:Object,sucess?:Function,failure?:Function,config?:Object)
    // 参数分析
    const token = sessionStorage.getItem("token");
    baseConfig.headers["x-nri_admin-token"] = token;
    const data = rest[0] || {};
    let success = null;
    let failure = null;
    let config = {};
    for (let i = 1; i < rest.length; i += 1) {
      if (typeof rest[i] === "function") {
        if (!success) {
          success = rest[i];
        } else {
          failure = rest[i];
        }
      }
      if (Object.prototype.toString.call(rest[i]) === "[object Object]") {
        config = rest[i];
      }
    }

    const hooks = {
      abort: null,
    };

    const cancelToken = new CancelToken((c) => {
      hooks.abort = c;
    });
    // 如果是用的30上的mock的服务，那么就默认不带cookie到服务器
    // if (options && options.baseURL.indexOf("12602") !== -1) {
    //   baseConfig.withCredentials = false;
    // } else {
    //   baseConfig.withCredentials = true;
    // }
    axios({
      ...baseConfig,
      ...options,
      ...config,
      url: api,
      data,
      cancelToken,
    })
      .then((response) => response.data)
      .then((response) => {
        switch (response.errno) {
          case 0: {
            success && success(response);
            break;
          }
          default: {
            if (typeof failure === "function") {
              failure(response);
            } else {
              logOut();
            }
          }
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          if (process.env.NODE_ENV !== "production") {
            console.log("Request canceled", e.message);
          }
        } else {
          console.dir(e);
          if (typeof failure === "function") {
            if (e.code === "ECONNABORTED") {
              // 超时的报错
              failure({
                data: "",
                errmsg: "Server connection timeout",
                status: 0,
              });
            } else {
              failure({
                data: "",
                errmsg: e.message || "Something error",
                status: 0,
              });
            }
          }
        }
      });
    return hooks;
  };
};

// 创建发起api的启动器
export const createApi = function (api, options) {
  const url = api;
  return oftenFetchByPost(`${url}`, options);
};
