import React, { Component } from "react";
import Cards from "@components/Card/Card";
import { Row, Col } from "antd";
import "@styles/home.less";
import { debounce, getElemOffsetTop } from "../../utils/common";

export default class app extends Component {
  static defaultProps = {};
  static propTypes = {};

  constructor(props) {
    super(props);
    this.ocrTitleRef = React.createRef();
    this.iotTitleRef = React.createRef();
    this.aiTitleRef = React.createRef();
    this.state = {};
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
    this.judgeScrollTop([ocrTitleElem, aiTitleElem, iotTitleElem], "mainMod");
    // this.judgeScrollTop([aiVideoElem], "rightMod");
  }

  judgeScrollTop(elemArr, animateType) {
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    let winH =
      document.documentElement.offsetHeight || document.body.offsetHeight;

    elemArr.forEach((elem) => {
      let firstChild = elem.firstElementChild;
      let lastChild = elem.lastElementChild;
      //获取当前元素相对文档顶部距离 ocrTitleElem.offsetTop
      let offsetTop = getElemOffsetTop(elem);
      if (scrollTop + winH > offsetTop) {
        if (firstChild && !firstChild.classList.contains("animated")) {
          firstChild.classList.add("animated", animateType);
        }
        if (lastChild && !lastChild.classList.contains("animated")) {
          lastChild.classList.add("animated", animateType);
        }
      }
    });
  }
  render() {
    const cardList = [
      {
        id: 1,
        image: "../images/home/jpexpress.png",
        title: "日文运单识别",
        desc: "'日文运单识别'上传日文运单图片，识别对应邮编、地址、姓名数据",
      },
      {
        id: 2,
        image: "../images/home/jppostcode.jpg",
        title: "日文邮编识别",
        desc: "'日文邮编识别'上传日文邮编图片，识别对应邮编数据",
      },
      {
        id: 3,
        image: "../images/home/customTemplate.jpg",
        title: "自定OCR模板",
        desc:
          "'自定OCR模板'可定制想要的模板，并在'执行OCR'中选择同样格式图片，识别得到自己想要的数据",
      },
      {
        id: 4,
        image: "../images/home/executeocr.jpg",
        title: "执行OCR",
        desc:
          " '执行OCR'根据自定好的模板，选择上传同样模板格式图片，识别得到自己想要的图片数据",
      },
      {
        id: 5,
        image: "../images/home/tengxunocr.png",
        title: "T-通用识别",
        desc:
          "'T-通用识别'上传图片，使用T-通用引擎识别对应图片数据，针对印刷，手写，英文等字符",
      },
      {
        id: 6,
        image: "../images/home/ai_algorithorm.png",
        title: "G-通用识别",
        desc:
          "'G-通用识别'上传图片，使用G-通用引擎识别对应图片数据，针对印刷，手写，英文等字符",
      },
    ];
    return (
      <div className="main_wrap">
        <section className="ocr_category_content" id="ocr_category_content">
          <div className="ocr_title" ref={this.ocrTitleRef}>
            <h1>OCR 识别</h1>
            <p>
              NRI通用OCR识别，自定OCR模板，运单识别，邮编识别，T-通用，G-通用OCR识别
            </p>
          </div>
          <div className="ocr_main">
            <Cards cardList={cardList}></Cards>
          </div>
        </section>

        <section className="iot_category_content" id="iot_category_content">
          <div className="iot_title" ref={this.iotTitleRef}>
            <h1>IOT 物联</h1>
            <ul>
              <li>
                1.
                ESL价签使用电子价签实时显示仓库库存，手机扫码动态更改库存，也可自定显示数据。
              </li>
              <li>
                2.
                温湿度传感器将温湿度数据传到前端界面显示，实时对温湿度进行检测...
              </li>
            </ul>
          </div>
        </section>

        <section className="ai_category_content" id="ai_category_content">
          <Row gutter={16}>
            <Col className="column-item" span={12}>
              <div className="iot_h1" ref={this.aiTitleRef}>
                <h1>IOT 算法领域</h1>
                <p>
                  AI 算法领域，算法工程师针对不同行业
                  领域应用落地。右边是烟雾探测监控算法，以及更多其他领域应用...
                </p>
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
