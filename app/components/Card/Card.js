/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: 2020-11-02 14:25:44
 */
import { hashHistory } from "react-router";
import React, { Component } from "react";
import { Row, Col } from "antd";
import "./Card.less";
// 声明组件  并对外输出
export default class Card extends Component {
  constructor(props) {
    super(props);
  }
  handleClickCardItem = (id, event) => {
    event.stopPropagation();
    // 这里的路径数据也可以通过props传过来
    const map = new Map([
      [1, { path: "/expressOcr", nav: "2_1" }],
      [2, { path: "/expressOcr", nav: "" }],
      [3, { path: "/customizeTemp", nav: "2_3" }],
      [4, { path: "/performOcr", nav: "2_4" }],
      [5, { path: "/T_GeneralOcr", nav: "2_5" }],
      [6, { path: "/G_GeneralOcr", nav: "2_6" }],
    ]);
    let pathInfo = map.get(id);
    console.log(pathInfo);
    window.sessionStorage.setItem("currentNavItem", pathInfo.nav);
    hashHistory.push(pathInfo.path);
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
