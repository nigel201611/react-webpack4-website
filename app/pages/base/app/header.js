import React, { Component } from "react";
import { hashHistory } from "react-router";
import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";
import { setCurrentNav, setCurrentNavItem } from "@actions/common";
import { withTranslation } from "react-i18next";
import { Modal, message, Row, Col, Menu, Dropdown } from "antd";
import HorizontalLoginForm from "./horizontalLoginForm";

const { SubMenu } = Menu;
import { logout } from "@apis/common";
import logoImage from "@images/logo.png";
// import { store } from "@app/client";
import "@styles/header.less";
import navList from "@apis/navList.js";
const { confirm } = Modal;

@connect((state) => {
  return {
    currentNavItem: state.currentNavItem,
  };
})
class Header extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      navList: navList,
      showLoginBox: false,
      name: "", //用户登录名
    };
  }
  // 登出
  handleLogout = (event) => {
    event.preventDefault();
    const self = this;
    confirm({
      title: self.props.t("tip"),
      content: self.props.t("logoutMesage"),
      onOk() {
        logout({}, (result) => {
          if (result.errno === 0) {
            sessionStorage.clear();
            self.setState({
              name: "",
              showLoginBox: false,
            });
            self.props.dispatch(setCurrentNavItem("1"));
            hashHistory.replace("/");
          } else {
            message.warning(result.msg);
          }
        });
      },
    });
  };
  handleLogin = (event) => {
    event.preventDefault();
    // hashHistory.push("/login");
    this.setState({
      showLoginBox: true,
    });
  };

  // navigateToMyTemplate = (event) => {
  //   event.preventDefault();
  //   hashHistory.push("/myTemplate");
  // };

  handleChangeLang = ({ key }) => {
    this.props.i18n.changeLanguage(key);
  };

  logoClick = () => {
    console.log("nri");
  };
  handleClick = (e) => {
    let { key, item } = e;
    let { props } = item;
    this.props.dispatch(setCurrentNavItem(key));
    window.sessionStorage.setItem("currentNavItem", key);
    let anchorName = props.name;
    let path = props.path;
    if (this.currentPath === path || this.currentPath === "") {
      hashHistory.replace(path);
    } else {
      hashHistory.push(path);
    }
    this.currentPath = path;
    if (anchorName && path === "/home") {
      setTimeout(() => {
        let anchorElement = document.getElementById(anchorName);
        if (anchorElement) {
          anchorElement.scrollIntoView({
            behavior: "smooth",
            block: key == "2" ? "start" : key == "3" ? "center" : "start",
          });
        }
      }, 0);
    }
  };

  scrollToAnchor = (index, anchorName, event) => {
    event.stopPropagation();
    this.props.dispatch(setCurrentNav(index));
    hashHistory.push("/home"); //可以带参数过去，看当前点了那个，然后在home页显示时，根据参数滚动到具体位置
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({
          behavior: "smooth",
          block: index == 1 ? "start" : index == 2 ? "center" : "start",
          // inline: "start",
        });
      }
    }
  };
  getUserName() {
    let name = "";
    const userinfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    userinfo && userinfo.username && (name = userinfo.username);
    this.setState({
      name,
    });
  }
  setUserName = (name) => {
    this.setState({
      name,
    });
  };
  componentDidMount() {
    let currentNavItem = window.sessionStorage.getItem("currentNavItem") || "1";
    // 设置当前菜单
    this.props.dispatch(setCurrentNavItem(currentNavItem));
    this.currentPath = ""; //用于保存當前或者上一個path
    this.getUserName();
  }
  render() {
    const { navList, showLoginBox, name } = this.state;
    let { currentNavItem } = this.props;

    const userinfoMenu = (
      <Menu>
        <Menu.Item>
          <a href="#" onClick={this.handleLogout.bind(this)}>
            {this.props.t("logOut")}
          </a>
        </Menu.Item>
        {/* <Menu.Item>
          <a href="#" onClick={this.navigateToMyTemplate.bind(this)}>
            {this.props.t("myTemplate")}
          </a>
        </Menu.Item> */}
      </Menu>
    );
    const languageMenu = (
      <Menu onClick={this.handleChangeLang}>
        <Menu.Item key="zh_CN">
          <span>中文</span>
        </Menu.Item>
        <Menu.Item key="ja_JP">
          <span>日本語</span>
        </Menu.Item>
        <Menu.Item key="en_US">
          <span>English</span>
        </Menu.Item>
      </Menu>
    );

    return (
      <header id="navbar">
        <div id="navbar-container" className="boxed">
          <Row className="row">
            <Col span={16}>
              <div className="navbar-brand">
                <span className="brand-title" onClick={this.logoClick}>
                  <span className="brand-text">
                    <img className="logo_icon" src={logoImage} alt="NRI logo" />
                    {this.props.t("NRI_title")}
                  </span>
                </span>
                <ul className="navList">
                  {navList.map((item) => {
                    return (
                      <Menu
                        onClick={this.handleClick}
                        selectedKeys={[currentNavItem]}
                        mode="horizontal"
                        key={item.text}
                      >
                        {item.children != undefined && item.children.length ? (
                          <SubMenu
                            popupClassName="subMenu"
                            key={item.id}
                            title={this.props.t(item.nav)}
                          >
                            {item.children.map((child) => {
                              return (
                                <Menu.Item key={child.id} path={child.path}>
                                  {this.props.t(child.nav)}
                                </Menu.Item>
                              );
                            })}
                          </SubMenu>
                        ) : (
                          <Menu.Item
                            key={item.id}
                            name={item.name}
                            path={item.path}
                          >
                            {this.props.t(item.nav)}
                          </Menu.Item>
                        )}
                      </Menu>
                    );
                  })}
                </ul>
              </div>
            </Col>
            <Col span={8} className="col">
              <div className="right">
                <ul>
                  <li>
                    {name ? (
                      <Dropdown overlay={userinfoMenu}>
                        <a
                          className="ant-dropdown-link"
                          onClick={(e) => e.preventDefault()}
                        >
                          {name} <i className="iconfont icon-login"></i>
                        </a>
                      </Dropdown>
                    ) : showLoginBox ? (
                      <HorizontalLoginForm
                        setUserName={this.setUserName}
                      ></HorizontalLoginForm>
                    ) : (
                      <a onClick={this.handleLogin.bind(this)}>
                        {this.props.t("login")}{" "}
                        <i className="iconfont icon-login"></i>
                      </a>
                    )}
                  </li>
                  <li>
                    <Dropdown overlay={languageMenu}>
                      <a
                        className="ant-dropdown-link"
                        onClick={(e) => e.preventDefault()}
                      >
                        {this.props.t("language_set")}
                        <i className="iconfont icon-duoyuyan"></i>
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

export default withTranslation("header")(Header);
