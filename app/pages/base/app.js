import React, { Component } from "react";
import { connect } from "react-redux";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
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
      <ConfigProvider locale={zhCN}>
        <div id="container">
          <Header
            currentNav={this.state.currentNav}
            setCurrentNav={this.setCurrentNavCallback}
          ></Header>
          <Main setCurrentNav={this.setCurrentNavCallback}></Main>
          <Footer></Footer>
        </div>
      </ConfigProvider>
    );
  }
}
