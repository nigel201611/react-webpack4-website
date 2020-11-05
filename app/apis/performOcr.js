/*
 * @Author: nigel
 * @Date: 2020-09-23 11:44:33
 * @LastEditTime: 2020-10-27 18:01:19
 */
import { createApi } from '@ajax';
import { baseURL, path } from '@config';

const prefix = 'detection';
const option = { baseURL: baseURL };

export const performOcr = createApi(
  `${path}/${prefix}/userCustomizeImgDetection`,
  option,
);
