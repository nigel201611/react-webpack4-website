/*
 * @Author: nigel
 * @Date: 2020-10-27 14:54:04
 * @LastEditTime: 2020-11-05 11:13:32
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
        closable
        keyboard
        title={t("modal-title")}
        okText={t("confirm")}
        onOk={onConfirm}
        onCancel={onCancel}
        mask
        maskClosable={false}
        footer={null}
        width={600}
      >
        <ul className="templateList">
          {tableData.map((item, index) => (
            <li
              key={item.temp_id}
              className={`listItem ${
                index != tableData.length - 1 && tableData.length > 1
                  ? "borderB"
                  : ""
              }`}
            >
              <span className="item-desc">
                {`${t("temp_name")} ${item.temp_name}`}
                {item.blockItem.map((block, index2) => (
                  <p key={block.block_id}>
                    {`(${index2 + 1})  `}
                    <span>
                      {t("ocr_engine")}:{block.ocr_engine}
                    </span>
                    {" ,"}
                    <span>
                      {t("area_name")}:{block.name}
                    </span>
                  </p>
                ))}
              </span>
              <span
                className="template-image"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
              />
              <Checkbox
                defaultChecked={!!(index === 0 && tableData.length === 1)}
                checked={templateIndex == index}
                onChange={changeTemplateIndex}
                data-index={index}
                className="checkbox"
              >
                {t("choice")}
              </Checkbox>
            </li>
          ))}
        </ul>
      </Modal>
    );
  }
}

export default withTranslation("modalList", { withRef: true })(ModalList);
