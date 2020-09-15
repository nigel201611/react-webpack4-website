/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-09-15 16:33:45
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { hashHistory /* , Link */ } from "react-router";
import { Spin, Form, Icon, Input, Button, Row, message } from "antd";
import { regExpConfig } from "@reg";
// import { login } from "@actions/common";
import { login } from "@apis/common";
// import md5 from "md5";
import QueuiAnim from "rc-queue-anim";

import Ship from "@components/ship/ship";
import "@styles/login.less";

const FormItem = Form.Item;

@connect((state, props) => ({
  config: state.config,
  loginResponse: state.loginResponse,
}))
@Form.create({
  onFieldsChange(props, items) {},
})
export default class Login extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({ username: "demo", password: "demo" });
  }

  // #region 收缩业务代码功能

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const query = this.props.form.getFieldsValue();
        this.setState({ loading: true });
        // values.password = md5(values.password);
        login(
          values,
          (res) => {
            console.log(res);
            this.setState({ loading: false });
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem(
              "userInfo",
              JSON.stringify(res.data.userInfo)
            );
            hashHistory.push("/");
          },
          (res) => {
            message.warning(res.msg);
            this.setState({ loading: false });
          }
        );
      }
    });
  }

  // #endregion

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-container">
        <div className="login-main">
          <QueuiAnim delay={300} type="bottom" key="row">
            <h3 className="title">NRI Demo Platform</h3>
            <Row>
              <Spin spinning={this.state.loading}>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                  <div>
                    <FormItem hasFeedback>
                      {getFieldDecorator("username", {
                        rules: [
                          {
                            required: true,
                            min: 4,
                            max: 10,
                            message: "用户名为4-10个字符",
                          },
                          {
                            pattern: regExpConfig.policeNo,
                            message: "账号4-10位数字或字母组成",
                          },
                        ],
                      })(
                        <Input
                          prefix={<Icon type="user" />}
                          placeholder="请输入用户名"
                          type="text"
                        />
                      )}
                    </FormItem>
                    <FormItem hasFeedback>
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            min: 4,
                            max: 16,
                            message: "密码为4-16个字符",
                          },
                          {
                            pattern: regExpConfig.pwd,
                            message: "密码由4-16位数字或者字母组成",
                          },
                        ],
                      })(
                        <Input
                          prefix={<Icon type="lock" />}
                          placeholder="请输入密码"
                          type="password"
                        />
                      )}
                    </FormItem>
                    <FormItem>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="cert-btn"
                      >
                        LOGIN
                      </Button>
                    </FormItem>
                  </div>
                </Form>
              </Spin>
            </Row>
          </QueuiAnim>
        </div>
        <Ship />
      </div>
    );
  }
}
