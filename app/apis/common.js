/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-15 13:55:41
 */

import { createApi } from "@ajax";
import { baseURL, path } from "@config";

const prefix = "auth";
const option = { baseURL: baseURL };

export const login = createApi(`${path}/${prefix}/login`, option); // 登陆
export const logout = createApi(`${path}/${prefix}/logout`, option); // 登出