/*
 * @Author: nigel
 * @Date: 2020-09-24 15:46:22
 * @LastEditTime: 2020-11-09 10:33:46
 */
import { createApi } from '@ajax';
import { baseURL, path } from '@config';

const prefix = 'googleOcr';
const option = { baseURL: baseURL };

export const googleOcr = createApi(`${path}/${prefix}/generalocr`, option);
