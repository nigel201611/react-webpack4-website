/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-18 20:28:16
 */
import { routerReducer as routing } from "react-router-redux";
import { combineReducers } from "redux";

import * as common from "./common";

const rootReducer = combineReducers({
  routing,
  config: (state = {}) => state,
  ...common,
});

export default rootReducer;
