/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-14 10:06:55
 */
import React from 'react'
import { Router, Route, IndexRoute, hashHistory/* , Redirect */ } from 'react-router'

import * as base from '@pages/base' // 基础
import * as menu from '@pages/menu' // 菜单

export default () => (
  <Router history={hashHistory}>
    <Route path="/" component={base.app}>
      <IndexRoute component={base.example} />
      <Route path="/desk$/index" component={base.example} />
      <Route path="/echarts" component={menu.echarts} />
      <Route path="/editor" component={menu.editor} />
    </Route>
    <Route path="/login" component={base.login} />
    <Route path="*" component={base.notfound} />
  </Router>
)
