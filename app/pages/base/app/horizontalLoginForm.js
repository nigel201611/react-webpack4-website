import React, { Component } from 'react';
import { hashHistory /* , Link */ } from 'react-router';
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import { login } from '@actions/common';

@connect(state => ({
  loginResponse: state.loginResponse,
}))
@Form.create({
  name: 'horizontal_login',
})
class HorizontalLoginForm extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount() {
    // this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        // values.password = md5(values.password);
        this.props.dispatch(login(
          values,
          (res) => {
            this.setState({ loading: false });
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem(
              'userInfo',
              JSON.stringify(res.data.userInfo),
            );
            const name =
                (res.data.userInfo && res.data.userInfo.username) || '';
            this.props.setUserName(name);
            //  如果从其他页面登录的，需要记录当前页面，登录后，跳转当前页面
            const hashPath = window.location.hash;
            const path = hashPath.substr(1);
            // 这样进去不会触发组件的 componentDidMount？？？
            hashHistory.replace({ pathname: path });
          },
          (res) => {
            message.warning(res.errmsg);
            this.setState({ loading: false });
          },
        ));
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                min: 4,
                max: 10,
                message: '4-10 characters',
              },
            ],
          })(<Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                min: 4,
                max: 16,
                message: '4-16 characters',
              },
            ],
          })(<Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={this.state.loading} htmlType="submit">
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default HorizontalLoginForm;
