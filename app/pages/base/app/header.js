import React, { Component, PureComponent } from "react";
import { hashHistory } from "react-router";
import { connect } from "react-redux";
import { setCurrentNav } from "@actions/common";
import { withTranslation } from "react-i18next";
import { Modal, message, Row, Col, Menu, Dropdown } from "antd";
import { logout } from "@apis/common";
import logoImage from "@images/logo.png";
// import { store } from "@app/client";
import "@styles/header.less";
const { confirm } = Modal;

@connect((state) => {
  // console.log(state);
  return {
    currentNav: state.currentNav,
  };
})
class Header extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
      currentNav: this.props.currentNav,
      navList: [
        {
          id: 1,
          text: "OCR 识别",
          nav: "ocr_nav",
          name: "ocr_category_content",
        },
        {
          id: 2,
          text: "IOT 物联",
          nav: "iot_nav",
          name: "iot_category_content",
        },
        {
          id: 3,
          text: "AI 算法 ",
          nav: "ai_nav",
          name: "ai_category_content",
        },
      ],
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.navigateToMyTemplate = this.navigateToMyTemplate.bind(this);
  }
  // componentDidMount() {
  //   this.unsubscribe = store.subscribe(() => {});
  // }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  // 登出
  handleLogout() {
    const self = this;
    confirm({
      title: self.props.t("tip"),
      content: self.props.t("logoutMesage"),
      onOk() {
        logout({}, (result) => {
          if (result.errno === 0) {
            sessionStorage.clear();
            hashHistory.push("/login");
          } else {
            message.warning(result.msg);
          }
        });
      },
    });
  }
  handleLogin() {
    hashHistory.push("/login");
  }

  navigateToMyTemplate() {
    console.log("我的模板");
  }

  handleChangeLang = ({ key }) => {
    this.props.i18n.changeLanguage(key);
  };

  logoClick = () => {
    console.log("nri");
  };

  scrollToAnchor = (index, anchorName, event) => {
    event.stopPropagation();
    // this.props.setCurrentNav(index);
    this.props.dispatch(setCurrentNav(index));
    hashHistory.push("/home");//可以带参数过去，看当前点了那个，然后在home页显示时，根据参数滚动到具体位置
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

  render() {
    const userinfo = JSON.parse(sessionStorage.getItem("userInfo")) || {};
    let name = "";
    userinfo && userinfo.username && (name = userinfo.username);
    const userinfoMenu = (
      <Menu>
        <Menu.Item>
          <a href="#" onClick={this.handleLogout}>
            {this.props.t("logOut")}
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="#" onClick={this.navigateToMyTemplate}>
            {this.props.t("myTemplate")}
          </a>
        </Menu.Item>
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
            <Col span={20}>
              <div className="navbar-brand">
                <span className="brand-title" onClick={this.logoClick}>
                  <span className="brand-text">
                    <img className="logo_icon" src={logoImage} alt="NRI logo" />
                    {this.props.t("NRI_title")}
                  </span>
                </span>

                <ul className="navList">
                  {this.state.navList.map((item) => {
                    return (
                      <li
                        key={item.id}
                        onClick={this.scrollToAnchor.bind(
                          this,
                          item.id,
                          item.name
                        )}
                        className={
                          this.props.currentNav === item.id ? "active" : ""
                        }
                      >
                        <a>{this.props.t(item.nav)}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Col>
            <Col span={4} className="col">
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
                    ) : (
                      <a onClick={this.handleLogin}>
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
