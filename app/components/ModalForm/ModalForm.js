import React, { Component } from "react";
import { Modal, Form, Input, Select } from "antd";
import { withTranslation } from "react-i18next";
const { Option } = Select;
const btnList = [
  { text: "address_bill_dectect", type: "expressbill" },
  { text: "postcode_dectect", type: "postcode" },
  { text: "name_dectect", type: "name" },
  { text: "T_general", type: "T_general" },
  { text: "G_general", type: "G_general" },
];
const ModalForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends Component {
    render() {
      const { visible, onCancel, onCreate, form, t } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={t("modal-title")}
          okText={t("confirm")}
          onCancel={onCancel}
          onOk={onCreate}
          mask={true}
          maskClosable={false}
        >
          <Form layout="vertical">
            <Form.Item label={t("area-name")}>
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input a custom area name!",
                  },
                ],
              })(<Input placeholder="Please input a custom area name" />)}
            </Form.Item>
            <Form.Item label={t("ocr-engine")}>
              {getFieldDecorator("OCR_engine", {
                rules: [
                  {
                    required: true,
                    message: "Please select OCR engine!",
                  },
                ],
              })(
                <Select placeholder="Please select OCR engine" allowClear>
                  {btnList.map((item) => {
                    return (
                      <Option key={item.type} value={item.type}>
                        {t(item.text)}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
export default withTranslation("modalForm", { withRef: true })(ModalForm);
