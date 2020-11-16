/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-11-16 14:25:16
 */
import React, { Component } from "react";
import { hashHistory } from "react-router";
import { withTranslation } from "react-i18next";
import { notification, List, Icon, Modal, Spin } from "antd";
import { connect } from "react-redux";
import { editTemplateData, setCurrentNavItem } from "@actions/common";
const { confirm } = Modal;
import "@styles/myTemplate.less";
import { selectTemplate, deleteTemplate } from "@apis/userTemplate";
@connect((state) => ({}))
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
    this.selectUserTemplate();
  }

  UNSAFE_componentWillReceiveProps() {
    this.selectUserTemplate();
  }
  componentWillUnmount() {}

  handleEdit(index) {
    const templateData = this.state.tableData[index];
    this.props.dispatch(setCurrentNavItem("2_4"));
    window.sessionStorage.setItem("currentNavItem", "2_4");
    this.props.dispatch(editTemplateData(templateData));
    hashHistory.push({ pathname: "/customizeTemp" });
  }
  handleDelete(index) {
    const { t } = this.props;
    const { tableData } = this.state;
    const self = this;
    confirm({
      title: t("tips"),
      content: t("confirm_text"),
      onOk() {
        const temp_id = tableData[index].temp_id;
        deleteTemplate({ temp_id: temp_id }, (res) => {
          // console.log(res);
          const { errno, data } = res;
          if (errno === 0) {
            if (data == 1) {
              // 删除成功
              tableData.splice(index, 1);
              self.setState({
                tableData,
              });
              notification.success({
                message: t("tips"),
                description: t("cancel_succ"),
              });
            } else {
              // 提示用户删除失败，检查网络是否正常
              notification.error({
                message: t("tips"),
                description: t("cancel_fail"),
              });
            }
          } else {
            // 提示没有模板数据
          }
        });
      },
    });
  }

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
        const { errno, data } = res;
        if (errno == 0) {
          if (data !== null) {
            const templateDataArr = data;
            templateDataArr.forEach((item, index) => {
              let blockItem = item.blockItem;
              blockItem = blockItem.replace(/\\/, "");
              templateDataArr[index].blockItem = JSON.parse(blockItem);
            });
            this.setState({
              tableData: templateDataArr,
            });
          } else {
            // 提示没有模板数据
            notification.warning({
              message: this.props.t("tips"),
              description: this.props.t("no_data"),
            });
          }
        }
        // this.tableData
      },
      (err) => {
        notification.error({
          message: this.props.t("tips"),
          description: err.errmsg,
        });
        this.setState({
          isRequesting: false,
        });
      }
    );
  };

  render() {
    const { tableData, isRequesting } = this.state;
    const { t } = this.props;
    return (
      <div className="container">
        <div className="main">
          <Spin spinning={isRequesting}>
            <List
              itemLayout="vertical"
              size="large"
              className="templateList"
              pagination={{
                onChange: (page) => {
                  // console.log(page);
                },
                pageSize: 4,
              }}
              dataSource={tableData}
              renderItem={(item, index) => (
                <List.Item
                  key={item.temp_id}
                  actions={[
                    <span key="list-vertical-edit">
                      <Icon type="edit" style={{ marginRight: 8 }} />
                      <span
                        className="action-button"
                        onClick={this.handleEdit.bind(this, index)}
                      >
                        {t("edit")}
                      </span>
                    </span>,
                    <span key="list-vertical-delete">
                      <Icon type="delete" style={{ marginRight: 8 }} />
                      <span
                        className="action-button"
                        onClick={this.handleDelete.bind(this, index)}
                      >
                        {t("delete")}
                      </span>
                    </span>,
                  ]}
                  extra={
                    <div
                      className="template-image"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                      }}
                    />
                  }
                >
                  <List.Item.Meta
                    title={`${t("temp_name")} ${item.temp_name}`}
                    description={t("temp_name") + item.name ? item.item : ""}
                  />
                  {item.blockItem.map((block, index) => (
                    <p key={block.block_id}>
                      {`(${index + 1})` + " "}
                      <span>
                        {t("ocr_engine")}:{block.ocr_engine}
                      </span>{" "}
                      <span>
                        {t("area_name")}:{block.name}
                      </span>
                    </p>
                  ))}
                </List.Item>
              )}
            />
          </Spin>
        </div>
      </div>
    );
  }
}

export default withTranslation("myTemplate")(MyTemplate);
