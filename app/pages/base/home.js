import React, { Component } from "react";
import Cards from "@components/Card/Card";
import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import "@styles/home.less";
import { debounce, getElemOffsetTop } from "@utils/common";

class Home extends Component {
  static defaultProps = {};
  static propTypes = {};

  constructor(props) {
    super(props);
    this.ocrTitleRef = React.createRef();
    this.iotTitleRef = React.createRef();
    this.aiTitleRef = React.createRef();
  }
  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  init() {
    window.onscroll = () => debounce(this.handleScroll(), 600);
  }

  handleScroll() {
    let ocrTitleElem = this.ocrTitleRef.current;
    let aiTitleElem = this.aiTitleRef.current;
    let iotTitleElem = this.iotTitleRef.current;
    let cardsElem = document.querySelector(".cards-row");
    this.judgeScrollTop(
      [ocrTitleElem, aiTitleElem, iotTitleElem, cardsElem],
      "mainMod"
    );
    this.judgeWhichSection();
  }

  judgeWhichSection() {
    let ocrSectionElem = document.getElementById("ocr_category_content");
    let iotSectionElem = document.getElementById("iot_category_content");
    let aiSectionElem = document.getElementById("ai_category_content");
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    let winH =
      document.documentElement.offsetHeight || document.body.offsetHeight;
    if (getElemOffsetTop(ocrSectionElem) < scrollTop + winH) {
      this.props.setCurrentNav(1);
    }
    if (getElemOffsetTop(iotSectionElem) < scrollTop + winH) {
      this.props.setCurrentNav(2);
    }
    if (getElemOffsetTop(aiSectionElem) < scrollTop + winH) {
      this.props.setCurrentNav(3);
    }
  }

  judgeScrollTop(elemArr, animateType) {
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    let winH =
      document.documentElement.offsetHeight || document.body.offsetHeight;

    elemArr.forEach((elem, index) => {
      //获取当前元素相对文档顶部距离 ocrTitleElem.offsetTop
      let offsetTop = getElemOffsetTop(elem);
      if (scrollTop + winH > offsetTop) {
        let childrenList = Array.from(elem.children);
        childrenList.forEach((child) => {
          if (child && !child.classList.contains("animated")) {
            child.classList.add("animated", animateType);
          }
        });
      }
    });
  }
  render() {
    const cardList = this.props.t("cardList", { returnObjects: true });
    return (
      <div className="main_wrap">
        <section className="ocr_category_content" id="ocr_category_content">
          <div className="ocr_title" ref={this.ocrTitleRef}>
            <h1>{this.props.t("ocr_nav")}</h1>
            <p>{this.props.t("ocr_desc")}</p>
          </div>
          <div className="ocr_main">
            <Cards cardList={cardList}></Cards>
          </div>
        </section>

        <section className="iot_category_content" id="iot_category_content">
          <div className="iot_title" ref={this.iotTitleRef}>
            <h1>{this.props.t("iot_nav")}</h1>
            <ul>
              <li>1.{this.props.t("iot_desc1")}</li>
              <li>2.{this.props.t("iot_desc2")}</li>
            </ul>
          </div>
        </section>

        <section className="ai_category_content" id="ai_category_content">
          <Row gutter={16}>
            <Col className="column-item" span={12}>
              <div className="iot_h1" ref={this.aiTitleRef}>
                <h1>{this.props.t("ai_nav")}</h1>
                <p>{this.props.t("ai_desc")}</p>
              </div>
            </Col>
            <Col className="column-item" span={12}>
              <div className="ai_video">
                <video src="../videos/flower.mp4" controls="controls">
                  Sorry, your browser doesn't support embedded videos.
                </video>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    );
  }
}

export default withTranslation("home")(Home);
