/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2021-06-20 22:40:14
 */
import { hashHistory } from 'react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { setCurrentNavItem, setCurrentNav } from '@actions/common';
import './Card.less';
// 声明组件  并对外输出
@connect(state => ({
  currentNavItem: state.currentNavItem,
}))
export default class Card extends Component {
  // constructor(props) {
  //   super(props);
  // }
  handleClickCardItem = (id, event) => {
    event.stopPropagation();
    // 这里的路径数据也可以通过props传过来
    const map = new Map([
      [1, { path: '/expressOcr', nav: '2_1' }],
      [2, { path: '/expressOcr', nav: '2_1' }],
      [3, { path: '/performOcr', nav: '2_3' }],
      [4, { path: '/customizeTemp', nav: '2_4' }],
      [5, { path: '/T_GeneralOcr', nav: '2_5' }],
      // [6, { path: '/G_GeneralOcr', nav: '2_6' }],
    ]);
    const pathInfo = map.get(id);
    window.sessionStorage.setItem('currentNavItem', pathInfo.nav);
    this.props.dispatch(setCurrentNavItem(pathInfo.nav));
    this.props.dispatch(setCurrentNav(pathInfo.nav.substr(0, 1)));
    hashHistory.push(pathInfo.path);
  };
  render() {
    const listItems = this.props.cardList.map(item => (
      <Col className="gutter-row" span={8} key={item.id}>
        <div
          className="gutter-box"
          onClick={this.handleClickCardItem.bind(this, item.id)}
        >
          <img src={item.image} alt="image" />
          <div className="desc_content">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        </div>
      </Col>
    ));
    return (
      <Row
        className="cards-row"
        gutter={[16, { xs: 8, sm: 16, md: 16, lg: 16 }]}
      >
        {listItems}
      </Row>
    );
  }
}
