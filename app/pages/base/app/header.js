import React, { Component } from "react";
import { connect } from "react-redux";
import { hashHistory } from "react-router";
import { Modal, message, Row, Col, Menu, Dropdown } from "antd";
import { logout } from "@apis/common";
import { debounce, getElemOffsetTop } from "../../../utils/common";
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
      currentNav: 1, //当前导航索引
      navList: [
        {
          id: 1,
          text: "OCR 识别",
          name: "ocr_category_content",
        },
        {
          id: 2,
          text: "IOT 物联",
          name: "iot_category_content",
        },
        {
          id: 3,
          text: "AI 算法 ",
          name: "ai_category_content",
        },
      ],
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChangeLang = this.handleChangeLang.bind(this);
    this.navigateToMyTemplate = this.navigateToMyTemplate.bind(this);
  }

  // 组件已经加载到dom中
  componentDidMount() {
    window.onscroll = () => debounce(this.handleScroll(), 600);
  }
  componentWillUnmount() {
    window.onscroll = null;
  }
  handleScroll() {
    console.log(1111);

    //根据滚动条滚动位置，判断不同元素是否在视野中，设置导航avtive
    let ocrSectionElem = document.getElementById("ocr_category_content");
    let iotSectionElem = document.getElementById("iot_category_content");
    let aiSectionElem = document.getElementById("ai_category_content");

    console.log(aiSectionElem);
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    let winH =
      document.documentElement.offsetHeight || document.body.offsetHeight;

    if (getElemOffsetTop(ocrSectionElem) < scrollTop + winH) {
      this.setState({
        currentNav: 1,
      });
    }
    if (getElemOffsetTop(iotSectionElem) < scrollTop + winH) {
      this.setState({
        currentNav: 2,
      });
    }
    if (getElemOffsetTop(aiSectionElem) < scrollTop + winH) {
      this.setState({
        currentNav: 3,
      });
    }
  }
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
  handleLogin() {
    hashHistory.push("/login");
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

  scrollToAnchor = (index, anchorName, event) => {
    event.stopPropagation();
    this.setState({
      currentNav: index,
    });
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
              <div className="navbar-brand">
                <span className="brand-title" onClick={this.logoClick}>
                  <span className="brand-text">
                    <img className="logo_icon" src={logoImage} alt="NRI logo" />
                    野村综合研究所
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
                          this.state.currentNav === item.id ? "active" : ""
                        }
                      >
                        <a>{item.text}</a>
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
                        登录 <i className="iconfont icon-login"></i>
                      </a>
                    )}
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
