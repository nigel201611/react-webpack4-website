import React, { Component } from "react";
import { connect } from "react-redux";
import { ConfigProvider } from "antd";
// ...省略若干行
// import zhCN from 'antd/es/locale/zh_CN';
// import jp from 'antd/es/locale/ja_JP';
import enUS from "antd/es/locale/en_US";

import "@styles/base.less";
import Header from "./app/header";
import Main from "./home";
import Footer from "./app/footer";

@connect((state, props) => ({}))
export default class App extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      currentNav: 1,
    };
    this.setCurrentNavCallback = this.setCurrentNavCallback.bind(this);
  }
  setCurrentNavCallback(index) {
    this.setState({
      currentNav: index,
    });
  }
  render() {
    const { location, children } = this.props;
    return (
      <ConfigProvider locale={enUS}>
        <div id="container">
          <Header
            currentNav={this.state.currentNav}
            setCurrentNav={this.setCurrentNavCallback}
          ></Header>
          {/* <p>{this.props.t("Welcome to React")}</p> */}
          <Main setCurrentNav={this.setCurrentNavCallback}></Main>
          <Footer></Footer>
        </div>
      </ConfigProvider>
    );
  }
}
