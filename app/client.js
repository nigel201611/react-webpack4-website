/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-10-26 18:18:56
 */
// import '@babel/polyfill'
import React from "react";
import ReactDOM from "react-dom";
import "./i18n";
import { Provider } from "react-redux";
// import { hot } from "react-hot-loader/root";
import "@config";
import Routes from "@configs/router.config";
import configure from "@middleware/configureStore";
// const HotRoutes = hot(Routes);
export const store = configure({
  currentNav: "1",
});

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById("root")
);
