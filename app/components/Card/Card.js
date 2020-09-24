/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2020-09-24 14:28:13
 */
import { hashHistory } from "react-router";
import React, { Component } from "react";
import { Row, Col } from "antd";
import "./Card.less";
// 声明组件  并对外输出
export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClickCardItem = (id, event) => {
    event.stopPropagation();
    const map = new Map([
      [1, "/expressOcr"],
      [2, "/expressOcr"],
      [3, "/T_GeneralOcr"],
      [4, "T_GeneralOcr"],
      [5, "T_GeneralOcr"],
      [6, "T_GeneralOcr"],
    ]);
    hashHistory.push(map.get(id));
  };
  render() {
    const listItems = this.props.cardList.map((item) => {
      return (
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
