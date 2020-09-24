/*
 * @Author: nigel
 * @Date: 2020-09-23 11:44:33
 * @LastEditTime: 2020-09-24 15:46:33
 */
import { createApi } from "@ajax";
import { baseURL, path } from "@config";

const prefix = "detection";
const option = { baseURL: baseURL };

export const expressBill = createApi(
  `${path}/${prefix}/expressBillDetection`,
  option
);
