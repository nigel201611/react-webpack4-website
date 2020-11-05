import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cards from '@components/Card/Card';
import { Row, Col } from 'antd';
import { withTranslation } from 'react-i18next';
import '@styles/home.less';
import { debounce, getElemOffsetTop } from '@utils/common';
import { setCurrentNavItem } from '@actions/common';

@connect(state => ({}))
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
    this.rootElem = document.getElementById('root');
    this.init();
  }

  componentWillUnmount() {
    // window.onscroll = null;
    this.rootElem.removeEventListener('scroll', this.handleScroll, true);
  }

  init() {
    // window.onscroll = () => debounce(this.handleScroll(), 600);
    this.rootElem.addEventListener('scroll', this.handleScroll, true);
    // document.body.onscroll = () => debounce(this.handleScroll(), 600);
    // document.body.onscroll = this.handleScroll;
    // document.body.addEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const self = this;
    function scroll() {
      const ocrTitleElem = self.ocrTitleRef.current;
      const aiTitleElem = self.aiTitleRef.current;
      const iotTitleElem = self.iotTitleRef.current;
      const cardsElem = document.querySelector('.cards-row');
      self.judgeScrollTop(
        [ocrTitleElem, aiTitleElem, iotTitleElem, cardsElem],
        'mainMod',
      );
      // self.judgeWhichSection();
    }
    debounce(scroll, 600)();
  };

  judgeWhichSection() {
    const ocrSectionElem = document.getElementById('ocr_category_content');
    const iotSectionElem = document.getElementById('iot_category_content');
    const aiSectionElem = document.getElementById('ai_category_content');
    const scrollTopH = this.getScrollTopAndH(this.rootElem);
    let index = '1';
    if (getElemOffsetTop(ocrSectionElem) < scrollTopH) {
      index = '2';
    }
    if (getElemOffsetTop(iotSectionElem) < scrollTopH) {
      index = '3';
    }
    if (getElemOffsetTop(aiSectionElem) < scrollTopH) {
      index = '4';
    }
    this.props.dispatch(setCurrentNavItem(index));
  }

  getScrollTopAndH(elem) {
    const scrollTop = elem.scrollTop;
    const rootH = elem.offsetHeight;
    return scrollTop + rootH;
  }

  judgeScrollTop(elemArr, animateType) {
    // let scrollTop =
    //   document.documentElement.scrollTop || document.body.scrollTop;
    // let winH =
    //   document.documentElement.offsetHeight || document.body.offsetHeight;
    // 当前滚动高度+当前元素高度
    const scrollTopH = this.getScrollTopAndH(this.rootElem);
    elemArr.forEach((elem, index) => {
      // 获取当前元素相对文档顶部距离 ocrTitleElem.offsetTop
      const offsetTop = getElemOffsetTop(elem);
      if (scrollTopH > offsetTop) {
        const childrenList = Array.from(elem.children);
        childrenList.forEach((child) => {
          if (child && !child.classList.contains('animated')) {
            child.classList.add('animated', animateType);
          }
        });
      }
    });
  }
  render() {
    const cardList = this.props.t('cardList', { returnObjects: true });
    return (
      <div className="home_wrap">
        <section className="ocr_category_content" id="ocr_category_content">
          <div className="ocr_title" ref={this.ocrTitleRef}>
            <h1>{this.props.t('ocr_nav')}</h1>
            <p>{this.props.t('ocr_desc')}</p>
          </div>
          <div className="ocr_main">
            <Cards cardList={cardList} />
          </div>
        </section>

        <section className="iot_category_content" id="iot_category_content">
          <div className="iot_title" ref={this.iotTitleRef}>
            <h1>{this.props.t('iot_nav')}</h1>
            <ul>
              <li>1.{this.props.t('iot_desc1')}</li>
              <li>2.{this.props.t('iot_desc2')}</li>
            </ul>
          </div>
        </section>

        <section className="ai_category_content" id="ai_category_content">
          <Row gutter={16}>
            <Col className="column-item" span={12}>
              <div className="iot_h1" ref={this.aiTitleRef}>
                <h1>{this.props.t('ai_nav')}</h1>
                <p>{this.props.t('ai_desc')}</p>
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

export default withTranslation('home')(Home);
