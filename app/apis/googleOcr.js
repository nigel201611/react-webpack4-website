/*
 * @Author: nigel
 * @Date: 2020-09-24 15:46:22
 * @LastEditTime: 2020-10-19 11:11:00
 */
import { createApi } from '@ajax';
import { baseURL, path } from '@config';

const prefix = 'googleOcr';
const option = { baseURL: baseURL };

export const googleOcr = createApi(`${path}/${prefix}/generalocr`, option);
