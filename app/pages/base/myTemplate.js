/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: ,: 2020-10-23 18:56:15
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Table, Divider, notification } from "antd";
import "@styles/myTemplate.less";
import { selectTemplate, deleteTemplate } from "@apis/userTemplate";
class MyTemplate extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      isRequesting: false,
      tableData: [],
    };
  }

  componentDidMount() {
    this.columns = [
      {
        title: "template_id",
        dataIndex: "temp_id",
        key: "temp_id",
        align: "left",
      },
      {
        title: "template_image",
        dataIndex: "image",
        key: "image",
        align: "left",
        render: (text, record) => (
          <span>
            <img class="template_image" src={record.image} />
          </span>
        ),
      },
      //   {
      //     title: "blockItem",
      //     dataIndex: "blockItem",
      //     key: "blockItem",
      //     // render: (text, record) => <p>{record.blockItem}</p>,
      //   },
      {
        title: "user_action",
        key: "action",
        align: "left",
        render: (text, record) => (
          <span>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </span>
        ),
      },
    ];

    this.selectUserTemplate();
  }

  componentWillUnmount() {}

  /**
   * @name: selectUserTemplate
   * @msg: 查找登录用户的所有模板
   * @param {type}
   * @return {type}
   */
  selectUserTemplate = () => {
    if (this.state.isRequesting) {
      return;
    }
    this.setState({
      isRequesting: true,
    });
    selectTemplate(
      {},
      (res) => {
        this.setState({
          isRequesting: false,
        });
        let { errno, errmsg, data } = res;
        if (errno == 0) {
          if (data !== null) {
            let templateDataArr = data;
            templateDataArr.forEach((item, index) => {
              let blockItem = item.blockItem;
              blockItem = blockItem.replace(/\\/, "");
              templateDataArr[index].blockItem = JSON.parse(blockItem);
            });
            this.setState({
              tableData: templateDataArr,
            });
          } else {
            //提示没有模板数据
          }
        }
        // this.tableData
      },
      (err) => {
        this.setState({
          isRequesting: false,
        });
      }
    );
  };

  render() {
    const { tableData } = this.state;
    return (
      <div className="container">
        <div className="main">
          <Table columns={this.columns} dataSource={tableData} />
        </div>
      </div>
    );
  }
}

export default withTranslation("myTemplate")(MyTemplate);
