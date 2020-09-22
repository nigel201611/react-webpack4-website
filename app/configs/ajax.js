import axios from "axios";
import { hashHistory } from "react-router";
import { timeout, baseURL } from "@config";
import { message } from "antd";

const { CancelToken } = axios;
// 防止连续出现多个用户登录超时的提示
let flag = true;
function logOut(text) {
  if (flag) {
    message.warning(text || "用户登录过期或从其他浏览器登录");
    hashHistory.replace("/login");
    flag = false;
    setTimeout(() => (flag = true), 0);
  }
}
let token = sessionStorage.getItem("token");
let baseConfig = {
  url: "/",
  method: "post", // default
  baseURL: "",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "x-nri_admin-token": token,
  },
  params: {},
  data: {},
  timeout: "",
  withCredentials: true, // default
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
    if (options && options.baseURL.indexOf("12602") !== -1) {
      baseConfig.withCredentials = false;
    } else {
      baseConfig.withCredentials = true;
    }
    axios({
      ...baseConfig,
      ...options,
      ...config,
      url: api,
      data,
      cancelToken,
    })
      .then((response) => {
        return response.data;
      })
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
                msg: "服务器连接超时",
                status: 0,
              });
            } else {
              failure({
                data: "",
                msg: e.message,
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
  let url = api;
  return oftenFetchByPost(`${url}`, options);
};
