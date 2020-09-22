/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-22 19:19:05
 */
import React, { Component } from "react";
import { hashHistory /* , Link */ } from "react-router";
import { withTranslation } from "react-i18next";
import { Spin, Form, Icon, Input, Button, Row, message } from "antd";
import "@styles/expressOcr.less";
class ExpressOcr extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  render() {
    return (
      <div className="express-container">
        <div className="express-main">
          <section className="express-wrap">
            <div className="express-banner"></div>
          </section>
        </div>
      </div>
    );
  }
}

export default withTranslation("expressOcr")(ExpressOcr);
