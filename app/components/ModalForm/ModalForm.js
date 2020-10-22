import React, { Component } from "react";
import { Modal, Form, Input, Select } from "antd";
const { Option } = Select;
const btnList = [
  { text: "address_bill_dectect", type: "expressbill" },
  { text: "postcode_dectect", type: "postcode" },
  { text: "name_dectect", type: "name" },
  { text: "T_general", type: "T_general" },
  { text: "G_general", type: "G_general" },
];
export const ModalForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="自定区域编辑"
          okText="确认"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="区域名称">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input a custom area name!",
                  },
                ],
              })(<Input placeholder="Please input a custom area name" />)}
            </Form.Item>
            <Form.Item label="OCR引擎">
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
                        {item.text}
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
