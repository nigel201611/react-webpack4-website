/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-10-19 17:13:55
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Spin, Icon, message, Upload, Row, Col, Table, Tag } from "antd";
import "@styles/customizeTemplate.less";
import { expressBill } from "@apis/expressOcr";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const columns = [
  {
    title: "Fields",
    dataIndex: "fields",
    key: "fields",
    align: "left",
    width: 100,
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Result",
    dataIndex: "result",
    align: "left",
    key: "result",
    render: (text, record) => (
      <p
        id={"border_" + record.fields}
        className={record.result ? "border_" + record.fields : ""}
      >
        <span>{text}</span>
      </p>
    ),
  },
  {
    title: "Confidence",
    dataIndex: "confidence",
    align: "left",
    key: "confidence",
    width: 120,
    render: (text) => (text ? <span>{text}%</span> : ""),
  },
];
class CustomizeTemp extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
      isRequesting: false,
      imageUrl: "",
      data: [],
    };
  }

  beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG/JPG file!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must smaller than 5MB!");
    }

    this.setState({
      imageUrl: "",
      data: [],
    });
    return isJpgOrPng && isLt5M;
  };

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      if (this.state.isRequesting) {
        return;
      }
      getBase64(info.file.originFileObj, (imageUrl) => {
        let nowTime = Date.now() + "";
        let requestObj = {
          request_id: nowTime,
          appid: nowTime, //管理员分配,字符串
          image: imageUrl,
          options: { scene: "all" },
        };
        this.setState({
          imageUrl,
          loading: false,
          isRequesting: true,
        });
        expressBill(
          requestObj,
          (res) => {
            this.handleTableData(res);
            this.setState({ isRequesting: false });
          },
          (res) => {
            //   如果返回401，或者token失效，提醒有用户去登录，由用户决定是否去登陆
            message.warning(res.errmsg);
            this.setState({ isRequesting: false });
          }
        );
      });
    }
    if (info.file.status === "error") {
      this.setState({ loading: false });
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  handleTableData(data) {
    let tableData = [];
    if (data.data && data.data.code == 0) {
      let ocrResponse = data.data.data;
      if (!ocrResponse.address && !ocrResponse.name && !ocrResponse.postcode) {
        tableData = [];
      } else {
        tableData = [
          {
            key: "1",
            fields: "postcode",
            result: ocrResponse.postcode && ocrResponse.postcode["text"],
            confidence: ocrResponse.postcode && ocrResponse.postcode["score"],
          },
          {
            key: "2",
            fields: "address",
            result: ocrResponse.address && ocrResponse.address["text"],
            confidence: ocrResponse.address && ocrResponse.address["score"],
          },
          {
            key: "3",
            fields: "name",
            result: ocrResponse.name && ocrResponse.name["text"],
            confidence: ocrResponse.name && ocrResponse.name["score"],
          },
        ];
      }
    } else {
      that.tableData = [
        {
          key: "1",
          fields: "error code",
          result: "something error ",
          confidence: 0,
        },
      ];
    }

    this.setState({
      data: Object.assign([], tableData),
    });
  }
  componentDidMount() {}
  render() {
    const uploadButton = (
      <div>
        <Icon
          style={{ fontSize: "36px", color: "#11aae4", margin: "0 0 10px 0" }}
          type={this.state.loading ? "loading" : "inbox"}
        />
        <div className="ant-upload-text">
          支持JPG/JPEG/PNG,limit 5MB,图片清晰，文字尽可能呈水平
        </div>
      </div>
    );
    const { imageUrl, isRequesting, data } = this.state;
    return (
      <div className="page-container">
        <section className="page-wrap">
          <div className="page-banner">
            <div className="page-title">{/* <h1>自定OCR模板</h1> */}</div>
          </div>
          <div className="page-main"></div>
        </section>
      </div>
    );
  }
}

export default withTranslation("customizeTemp")(CustomizeTemp);
