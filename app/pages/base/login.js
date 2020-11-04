/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-11-03 16:45:21
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { hashHistory /* , Link */ } from "react-router";
import { withTranslation } from "react-i18next";
import { Spin, Form, Icon, Input, Button, Row, message } from "antd";
import { regExpConfig } from "@reg";
import { login } from "@actions/common";
// import md5 from "md5";
import QueuiAnim from "rc-queue-anim";
import Ship from "@components/Ship/Ship";
import "@styles/login.less";

const FormItem = Form.Item;

@connect((state) => ({
  config: state.config,
  loginResponse: state.loginResponse,
}))
@Form.create({
  onFieldsChange(props, items) {},
})
class Login extends Component {
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
        this.props.dispatch(
          login(
            values,
            (res) => {
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
          )
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
                            message: "the user name is 4-10 characters",
                          },
                          {
                            pattern: regExpConfig.policeNo,
                            message:
                              "the account consists of 4-10 digits or letters",
                          },
                        ],
                      })(
                        <Input
                          prefix={<Icon type="user" />}
                          placeholder="please enter the user name"
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
                            message: "password is 4-16 characters",
                          },
                          {
                            pattern: regExpConfig.pwd,
                            message:
                              "the password consists of 4-16 digits or letters",
                          },
                        ],
                      })(
                        <Input
                          prefix={<Icon type="lock" />}
                          placeholder="please enter the password"
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

export default withTranslation("login")(Login);
