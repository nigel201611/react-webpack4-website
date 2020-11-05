/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-22 11:48:03
 */
import { combineReducers } from 'redux';

import * as common from './common';

const rootReducer = combineReducers({
  config: (state = {}) => state,
  ...common,
});

export default rootReducer;
