/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2020-09-17 17:51:47
 */

import React, { Component } from "react";
import { Row, Col } from "antd";
import "./Card.less";
// 声明组件  并对外输出
export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const listItems = this.props.cardList.map((item) => {
      return (
        <Col className="gutter-row" span={8} key={item.id}>
          <div className="gutter-box">
            <img src={item.image} alt="image" />
            <div className="desc_content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        </Col>
      );
    });
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
