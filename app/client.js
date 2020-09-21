// import '@babel/polyfill'
import React from "react";
import ReactDOM from "react-dom";
import "./i18n";
import { Provider } from "react-redux";
import { hot } from "react-hot-loader/root";
import "@config";
import Routes from "@configs/router.config";
import configure from "@middleware/configureStore";

const HotRoutes = hot(Routes);
const store = configure({});
// console.log(store.getState());
ReactDOM.render(
  <Provider store={store}>
    <HotRoutes />
  </Provider>,
  document.getElementById("root")
);
