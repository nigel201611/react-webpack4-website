import React, { Component } from "react";
import { ConfigProvider } from "antd";
import { connect } from "react-redux";
// import zhCN from 'antd/es/locale/zh_CN';
// import jp from 'antd/es/locale/ja_JP';
import enUS from "antd/es/locale/en_US";

import "@styles/base.less";
import Header from "./app/header";
// import Main from "./home";
import Footer from "./app/footer";
@connect((state) => ({
  currentNav: state.config.currentNav,
}))
export default class App extends Component {
  constructor(props, context) {
    super(props);
  }
  render() {
    return (
      <ConfigProvider locale={enUS}>
        <div id="container">
          <Header></Header>
          <div className="main_wrap">{this.props.children}</div>
          <Footer></Footer>
        </div>
      </ConfigProvider>
    );
  }
}
