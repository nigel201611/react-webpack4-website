import React, { Component } from "react";
import { Modal, Form, Input } from "antd";
import { withTranslation } from "react-i18next";

const TempNameModalForm = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends Component {
    render() {
      const {
        visible,
        onTempNameCancel,
        onTempNameConfirm,
        form,
        t,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={t("modal-title")}
          okText={t("confirm")}
          onCancel={onTempNameCancel}
          onOk={onTempNameConfirm}
          mask={true}
          maskClosable={false}
        >
          <Form layout="vertical">
            <Form.Item label={t("temp_name")}>
              {getFieldDecorator("temp_name", {
                rules: [
                  {
                    required: true,
                    message: "Please input template name!",
                  },
                ],
              })(<Input placeholder="Please input template name" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
export default withTranslation("customizeArea", { withRef: true })(
  TempNameModalForm
);
