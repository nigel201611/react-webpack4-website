import { createAction } from "redux-actions";
import * as common from "@apis/common";
import { createAjaxAction } from "@configs/common";

// login 登陆
export const requestLogin = createAction("request login");
export const recevieLogin = createAction("receive login");
export const setCurrentNav = createAction("set current nav");
export const setCurrentNavItem = createAction("set current nav item");
export const login = createAjaxAction(common.login, requestLogin, recevieLogin);
