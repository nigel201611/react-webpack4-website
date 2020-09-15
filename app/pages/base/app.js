import React, { Component } from "react";
import { connect } from "react-redux";
import { hashHistory } from "react-router";
import { message, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import "@styles/base.less";

import Header from "./app/header";

@connect((state, props) => ({}))
export default class App extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
  }
  // 组件已经加载到dom中
  componentDidMount() {}
  render() {
    const { location, children } = this.props;
    return (
      <ConfigProvider locale={zhCN}>
        <div id="container">
          <Header></Header>
        </div>
      </ConfigProvider>
    );
  }
}
