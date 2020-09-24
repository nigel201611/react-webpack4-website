import React, { Component } from "react";
import { ConfigProvider } from "antd";
import { connect } from "react-redux";
// ...省略若干行
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
    // this.state = {
    //   currentNav: 1,
    // };
    // this.setCurrentNavCallback = this.setCurrentNavCallback.bind(this);
  }
  // setCurrentNavCallback(index) {
  //   this.setState({
  //     currentNav: index,
  //   });
  // }
  render() {
    const { location, children } = this.props;
    return (
      <ConfigProvider locale={enUS}>
        <div id="container">
          <Header></Header>
          <div className="main_wrap">{this.props.children}</div>
          {/* <Main setCurrentNav={this.setCurrentNavCallback}></Main> */}

          <Footer></Footer>
        </div>
      </ConfigProvider>
    );
  }
}
