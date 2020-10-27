/*
 * @Author: nigel
 * @Date: 2020-10-27 14:54:04
 * @LastEditTime: 2020-10-27 17:26:40
 */
import React, { Component } from "react";
import { Modal, Checkbox } from "antd";
import { withTranslation } from "react-i18next";
import "./ModalList.less";
class ModalList extends Component {
  render() {
    const {
      visible,
      onConfirm,
      onCancel,
      t,
      tableData,
      templateIndex,
      changeTemplateIndex,
    } = this.props;
    return (
      <Modal
        visible={visible}
        closable={true}
        keyboard={true}
        title={t("modal-title")}
        okText={t("confirm")}
        onOk={onConfirm}
        onCancel={onCancel}
        mask={true}
        maskClosable={false}
        footer={null}
      >
        <ul className="templateList">
          {tableData.map((item, index) => {
            return (
              <li
                key={item.temp_id}
                className={
                  "listItem " +
                  (index != tableData.length - 1 && tableData.length > 1
                    ? "borderB"
                    : "")
                }
              >
                <span className="item-desc">
                  {item.temp_id}
                  {item.blockItem.map((block, index2) => {
                    return (
                      <p key={block.block_id}>
                        {"(" + (index2 + 1) + ")"}
                        <span>
                          {t("ocr_engine")}:{block.ocr_engine}
                        </span>
                        {" ,"}
                        <span>
                          {t("area_name")}:{block.name}
                        </span>
                      </p>
                    );
                  })}
                </span>
                <span
                  className="template-image"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                ></span>
                <Checkbox
                  defaultChecked={
                    index === 0 && tableData.length === 1 ? true : false
                  }
                  checked={templateIndex == index ? true : false}
                  onChange={changeTemplateIndex}
                  data-index={index}
                  className="checkbox"
                >
                  选择
                </Checkbox>
              </li>
            );
          })}
        </ul>
      </Modal>
    );
  }
}

export default withTranslation("modalList", { withRef: true })(ModalList);
