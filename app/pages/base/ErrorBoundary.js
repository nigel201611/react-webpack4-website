import React, { Component } from 'react';
import { Result } from 'antd';
import '@styles/errorBoundary.less';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    // logErrorToMyService(error, errorInfo);
    console.log(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <Result
          className="error-desc"
          status="500"
          subTitle="Sorry, something went wrong,please contact the developer,thanks"
        />
      );
    }
    return this.props.children;
  }
}
