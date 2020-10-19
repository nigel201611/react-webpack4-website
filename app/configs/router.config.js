/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-10-19 16:38:59
 */
import React from "react";
import {
  Router,
  Route,
  IndexRoute,
  hashHistory /* , Redirect */,
} from "react-router";

import * as base from "@pages/base"; // 基础

export default () => (
  <Router history={hashHistory}>
    <Route path="/" component={base.app}>
      <IndexRoute component={base.home} />
      <Route path="/home" component={base.home} />
      <Route path="/expressOcr" component={base.expressOcr} />
      <Route path="/T_GeneralOcr" component={base.tengxunOcr} />
      <Route path="/G_GeneralOcr" component={base.googleOcr} />
      <Route path="/customizeTemp" component={base.customizeTemplate} />
      <Route path="/developing" component={base.developing} />
    </Route>

    <Route path="/login" component={base.login} />
    <Route path="*" component={base.notfound} />
  </Router>
);
