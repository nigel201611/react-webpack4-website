import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import { connect } from 'react-redux';
// import zhCN from 'antd/es/locale/zh_CN';
// import jp from 'antd/es/locale/ja_JP';
import enUS from 'antd/es/locale/en_US';

import '@styles/base.less';
import Header from './app/header';
// import Main from "./home";
import Footer from './app/footer';
import ErrorBoundary from './ErrorBoundary';
@connect(state => ({
  currentNav: state.config.currentNav,
}))
export default class App extends Component {
  constructor(props, context) {
    super(props);
  }
  // componentDidMount() {
  //   console.log(this.props.location);
  // }
  render() {
    return (
      <ConfigProvider locale={enUS}>
        <ErrorBoundary>
          <div id="container">
            <Header />
            <div className="main_wrap">{this.props.children}</div>
            <Footer />
          </div>
        </ErrorBoundary>
      </ConfigProvider>
    );
  }
}
