/*
 * @Author: nigel
 * @Date: 2020-09-24 15:46:22
 * @LastEditTime: 2020-09-24 15:59:35
 */
import { createApi } from "@ajax";
import { baseURL, path } from "@config";

const prefix = "tengxun";
const option = { baseURL: baseURL };

export const tengxunOcr = createApi(`${path}/${prefix}/generalocr`, option);
