/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2021-06-20 21:29:14
 */
// import '@babel/polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { hot } from "react-hot-loader/root";
import '@config';
import Routes from '@configs/router.config';
import configure from '@middleware/configureStore';
import './i18n';
// import * as base from '@pages/base'; // 基础
// const HotRoutes = hot(Routes);
export const store = configure({
  currentNav: '1',
});
ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root'),
);
