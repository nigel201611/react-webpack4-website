import React, { Component } from "react";
import { connect } from "react-redux";
import { hashHistory } from "react-router";
import { Modal, message, Icon, Row, Col, Menu, Dropdown } from "antd";
import { brandName } from "@config";
import { logout } from "@apis/common";
import logoImage from "@images/logo.png";
import "@styles/header.less";
const { confirm } = Modal;

@connect((state, props) => ({
  config: state.config,
  staffResponse: state.staffResponse,
}))
export default class Header extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChangeLang = this.handleChangeLang.bind(this);
    this.navigateToMyTemplate = this.navigateToMyTemplate.bind(this);
  }

  // 组件已经加载到dom中
  componentDidMount() {}
  // 登出
  handleLogout() {
    const { config } = this.props;
    const self = this;
    confirm({
      title: "提示",
      content: "确认退出登录吗？",
      onOk() {
        logout({}, (result) => {
          if (result.errno === 0) {
            sessionStorage.clear();
            config.staff = {};
            hashHistory.push("/login");
          } else {
            message.warning(result.msg);
          }
        });
      },
    });
  }

  navigateToMyTemplate() {
    console.log("我的模板");
  }

  handleChangeLang() {
    console.log("切换语言");
  }

  logoClick = () => {
    console.log("nri");
  };

  render() {
    const userinfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    let name = "";
    userinfo && userinfo.username && (name = userinfo.username);
    const userinfoMenu = (
      <Menu>
        <Menu.Item>
          <a href="#" onClick={this.handleLogout}>
            退出
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="#" onClick={this.navigateToMyTemplate}>
            我的模板
          </a>
        </Menu.Item>
      </Menu>
    );
    const languageMenu = (
      <Menu>
        <Menu.Item>
          <a href="#" onClick={this.handleChangeLang}>
            中文
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="#" onClick={this.handleChangeLang}>
            日本語
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="#" onClick={this.handleChangeLang}>
            English
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <header id="navbar">
        <div id="navbar-container" className="boxed">
          <Row className="row">
            <Col span={20}>
              <div
                className="navbar-brand"
                title={brandName}
                onClick={this.logoClick}
              >
                <span className="brand-title">
                  <span className="brand-text">
                    <img className="logo_icon" src={logoImage} alt="NRI logo" />
                    野村综合研究所
                  </span>
                </span>

                <ul className="navList">
                  <li className="active">
                    <a href="#">OCR 识别</a>
                  </li>
                  <li>
                    <a href="#">AI 算法 </a>
                  </li>
                  <li>
                    <a href="#">IOT 物联</a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col span={4} className="col">
              <div className="right">
                <ul>
                  <li>
                    <Dropdown overlay={userinfoMenu}>
                      <a
                        className="ant-dropdown-link"
                        onClick={(e) => e.preventDefault()}
                      >
                        {name} <i className="iconfont icon-login"></i>
                      </a>
                    </Dropdown>
                  </li>
                  <li>
                    <Dropdown overlay={languageMenu}>
                      <a
                        className="ant-dropdown-link"
                        onClick={(e) => e.preventDefault()}
                      >
                        语言<i className="iconfont icon-duoyuyan"></i>
                      </a>
                    </Dropdown>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </header>
    );
  }
}
