/*
 * @Author: nigel
 * @Date: 2020-09-24 15:46:22
 * @LastEditTime: ,: 2020-10-22 17:54:55
 */
import { createApi } from "@ajax";
import { baseURL, path } from "@config";

const prefix = "saveTemplate";
const option = { baseURL: baseURL };

export const saveTemplate = createApi(`${path}/${prefix}/saveTemplate`, option);
export const selectTemplate = createApi(
  `${path}/${prefix}/selectUserTemplate`,
  option
);
export const deleteTemplate = createApi(
  `${path}/${prefix}/deleteUserTemplate`,
  option
);
