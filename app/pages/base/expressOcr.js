/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-11-16 15:45:34
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Spin, Icon, message, Upload, Row, Col, Table } from "antd";
import DrawPolygon from "@components/DrawPolygon/DrawPolygon";
import DrawLine from "@components/DrawLine";
import { expressBill } from "@apis/expressOcr";
import "@styles/expressOcr.less";
// import { func } from "prop-types";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ExpressOcr extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
      isRequesting: false,
      imageUrl: "",
      data: [],
      polygonPostcodePoints: [],
      polygonAddressPoints: [],
      polygonNamePoints: [],
      polygonSvgWidth: "500",
      polygonSvgHeight: "510",
      scaleX: 1.0,
      scaleY: 1.0,
      postcodePositions: {
        //绘制邮编虚线对应起点和终点
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
      addressPositions: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
      namePositions: {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
    };
  }
  componentDidMount() {
    this.bill_width = "500"; //運單默認寬度
    this.bill_height = "510"; //運單默認高度
    this.box_w = "500";
    this.box_h = "510";
    // 分别记录postcode,address,name起点和终点坐标，用于计算鼠标滚动时，重新计算对应虚线两点坐标
    // this.postcodePoints_start = { x: 0, y: 0 };
    // this.postcodePoints_end = { x: 0, y: 0 };
    // this.addressPoints_start = { x: 0, y: 0 };
    // this.addressPoints_end = { x: 0, y: 0 };
    // this.namePoints_start = { x: 0, y: 0 };
    // this.namePoints_end = { x: 0, y: 0 };
    //用于记录根容器滚动位置
    // this.origin_scrollLeft = 0;
    // this.origin_scrollTop = 0;
    this.timer = null; //用于控制绘制虚线时机，下一轮 event loop 开始执行，确保可以获取到dom元素
    this.root_container = document.getElementById("root");
    // this.root_container.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    // 清理定时器，清理不需要使用的变量
    // this.root_container.removeEventListener("scroll", this.handleScroll);
    this.root_container = null;
    clearTimeout(this.timer);
    this.timer = null;
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
      postcodePositions: {
        //绘制邮编虚线对应起点和终点
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
      addressPositions: {
        //绘制邮编虚线对应起点和终点
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
      namePositions: {
        //绘制邮编虚线对应起点和终点
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      },
      polygonPostcodePoints: [],
      polygonAddressPoints: [],
      polygonNamePoints: [],
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
        // 新建图片元素计算原图片宽高
        let image = new Image();
        image.onload = () => {
          let imgWidth = image.width;
          let imgHeight = image.height;
          this.bill_width = imgWidth;
          this.bill_height = imgHeight;
        };
        image.src = imageUrl;
        const nowTime = `${Date.now()}`;
        const requestObj = {
          request_id: nowTime,
          appid: nowTime, // 管理员分配,字符串
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
    const { t } = this.props;
    if (data.data && data.data.code == 0) {
      const ocrResponse = data.data.data;
      if (!ocrResponse.address && !ocrResponse.name && !ocrResponse.postcode) {
        tableData = [];
      } else {
        tableData = [
          {
            key: "1",
            fields: t("postcode"),
            fieldsName: "postcode",
            result: ocrResponse.postcode && ocrResponse.postcode.text,
            confidence: ocrResponse.postcode && ocrResponse.postcode.score,
          },
          {
            key: "2",
            fields: t("address"),
            fieldsName: "address",
            result: ocrResponse.address && ocrResponse.address.text,
            confidence: ocrResponse.address && ocrResponse.address.score,
          },
          {
            key: "3",
            fields: t("name"),
            fieldsName: "name",
            result: ocrResponse.name && ocrResponse.name.text,
            confidence: ocrResponse.name && ocrResponse.name.score,
          },
        ];
      }
      this.computeSvgSize(
        (ocrResponse.postcode && ocrResponse.postcode["bbox"]) || [],
        (ocrResponse.address && ocrResponse.address["bbox"]) || [],
        (ocrResponse.name && ocrResponse.name["bbox"]) || []
      );
    } else {
      that.tableData = [
        {
          key: "1",
          fields: "error code",
          fieldsName: "error code",
          result: "something error ",
          confidence: 0,
        },
      ];
    }

    this.setState({
      data: Object.assign([], tableData),
    });
  }
  // 获取元素位置信息，getBoundingClientRect获取的是针对当前窗口的相对位
  getMyBoundingClientRects(tags) {
    return tags.map((tag) => {
      let tagElem = document.querySelector(tag);
      return tagElem && tagElem.getBoundingClientRect();
    });
  }

  /*
   * @name:
   * @msg: 绘制虚线
   * @param {*}
   * @return {*}
   */
  computeSvgLine = (postcodePoints, addressPoints, namePoints) => {
    // 获取选区坐标
    // 前面timer清理掉，以免多次产生多个定时器
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // 获取绘制的多边形位置信息，getBoundingClientRect获取的是针对当前窗口的相对位
      let rootScrollTop = document.getElementById("root").scrollTop;
      const polygonBoundElems = this.getMyBoundingClientRects([
        "#polygonPostcode",
        "#polygonAddress",
        "#polygonName",
      ]);
      // 获取右边表格对应结果元素位置信息
      const dashedLineBoundElems = this.getMyBoundingClientRects([
        "#border_postcode",
        "#border_address",
        "#border_name",
      ]);
      // 获取this.root_container 开始滚动坐标
      // this.origin_scrollLeft = this.root_container.scrollLeft;
      // this.origin_scrollTop = this.root_container.scrollTop;
      function setLineStartEnd(
        points,
        polygonBoundElems,
        dashedLineBoundElems,
        index
      ) {
        if (points.length) {
          const startPositions = polygonBoundElems[index];
          const endPositions = dashedLineBoundElems[index];
          let start = {
            x: (startPositions && startPositions.x + startPositions.width) || 0,
            y: (startPositions && startPositions.y - 55 + rootScrollTop) || 0,
          };
          let end = {
            x: (endPositions && endPositions.x) || 0,
            y: (endPositions && endPositions.y - 60 + rootScrollTop) || 0,
          };
          return { start, end };
          // 记录第一次的原始值
        }
      }

      const postcodePositions = setLineStartEnd(
        postcodePoints,
        polygonBoundElems,
        dashedLineBoundElems,
        0
      );
      const addressPositions = setLineStartEnd(
        addressPoints,
        polygonBoundElems,
        dashedLineBoundElems,
        1
      );
      const namePositions = setLineStartEnd(
        namePoints,
        polygonBoundElems,
        dashedLineBoundElems,
        2
      );
      // savePointsOfStartEnd(postcodePositions, addressPositions, namePositions);
      this.setState({
        postcodePositions,
        addressPositions,
        namePositions,
      });
    });
  };
  computeSvgSize = (postcodePoints, addressPoints, namePoints) => {
    let source_w = this.bill_width;
    let source_h = this.bill_height;
    let dWidth = this.box_w;
    let dHeight = this.box_h;
    if (
      source_w > source_h ||
      (source_w == source_h && this.box_w < this.box_h)
    ) {
      dHeight = (source_h * dWidth) / source_w;
    } else if (
      source_w < source_h ||
      (source_w == source_h && this.box_w > this.box_h)
    ) {
      dWidth = (source_w * dHeight) / source_h;
    }
    let scaleX = 1;
    let scaleY = 1;
    scaleX = dWidth / source_w;
    scaleY = dHeight / source_h;
    // 选区polygon points赋值
    let polygonPostcodePoints = [];
    let polygonAddressPoints = [];
    let polygonNamePoints = [];
    postcodePoints.forEach((item) => {
      polygonPostcodePoints.push(item.x, item.y);
    });
    addressPoints.forEach((item) => {
      polygonAddressPoints.push(item.x, item.y);
    });
    namePoints.forEach((item) => {
      polygonNamePoints.push(item.x, item.y);
    });
    this.setState({
      polygonPostcodePoints,
      polygonAddressPoints,
      polygonNamePoints,
      polygonSvgWidth: dWidth,
      polygonSvgHeight: dHeight,
      scaleX,
      scaleY,
    });
    this.computeSvgLine(postcodePoints, addressPoints, namePoints);
  };

  // handleScroll = (ev) => {
  //   let scrollTop = ev.target.scrollTop;
  //   let scrollLeft = ev.target.scrollLeft;
  //   this.scrollTop = scrollTop;
  //   this.scrollLeft = scrollLeft;
  //   let diffX = Math.abs(this.origin_scrollLeft - scrollLeft);
  //   let diffY = Math.abs(this.origin_scrollTop - scrollTop);
  //   //重新计算polygon的坐标
  //   //postcode
  //   if (this.postcodeOfPoints.length) {
  //     // 横坐标处理
  //     if (this.origin_scrollLeft > scrollLeft) {
  //       this.postcodePoints.start.x = this.postcodePoints_start.x + diffX;
  //       this.postcodePoints.end.x = this.postcodePoints_end.x + diffX;
  //     } else {
  //       this.postcodePoints.start.x = this.postcodePoints_start.x - diffX;
  //       this.postcodePoints.end.x = this.postcodePoints_end.x - diffX;
  //     }

  //     if (this.origin_scrollTop > scrollTop) {
  //       this.postcodePoints.start.y = this.postcodePoints_start.y + diffY;
  //       this.postcodePoints.end.y = this.postcodePoints_end.y + diffY;
  //     } else {
  //       this.postcodePoints.start.y = this.postcodePoints_start.y - diffY;
  //       this.postcodePoints.end.y = this.postcodePoints_end.y - diffY;
  //     }
  //   }
  //   //address
  //   if (this.addressOfPoints.length) {
  //     if (this.origin_scrollLeft > scrollLeft) {
  //       this.addressPoints.start.x = this.addressPoints_start.x + diffX;
  //       this.addressPoints.end.x = this.addressPoints_end.x + diffX;
  //     } else {
  //       this.addressPoints.start.x = this.addressPoints_start.x - diffX;
  //       this.addressPoints.end.x = this.addressPoints_end.x - diffX;
  //     }

  //     if (this.origin_scrollTop > scrollTop) {
  //       this.addressPoints.start.y = this.addressPoints_start.y + diffY;
  //       this.addressPoints.end.y = this.addressPoints_end.y + diffY;
  //     } else {
  //       this.addressPoints.start.y = this.addressPoints_start.y - diffY;
  //       this.addressPoints.end.y = this.addressPoints_end.y - diffY;
  //     }
  //   }
  //   //name
  //   if (this.nameOfPoints.length) {
  //     if (this.origin_scrollLeft > scrollLeft) {
  //       this.namePoints.start.x = this.namePoints_start.x + diffX;
  //       this.namePoints.end.x = this.namePoints_end.x + diffX;
  //     } else {
  //       this.namePoints.start.x = this.namePoints_start.x - diffX;
  //       this.namePoints.end.x = this.namePoints_end.x - diffX;
  //     }

  //     if (this.origin_scrollTop > scrollTop) {
  //       this.namePoints.start.y = this.namePoints_start.y + diffY;
  //       this.namePoints.end.y = this.namePoints_end.y + diffY;
  //     } else {
  //       this.namePoints.start.y = this.namePoints_start.y - diffY;
  //       this.namePoints.end.y = this.namePoints_end.y - diffY;
  //     }
  //   }
  // };

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("fields"),
        dataIndex: "fields",
        key: "fields",
        align: "left",
        width: 140,
        render: (text) => <a>{text}</a>,
      },
      {
        title: t("result"),
        dataIndex: "result",
        align: "left",
        key: "result",
        render: (text, record) => (
          <p
            id={`border_${record.fieldsName}`}
            className={record.result ? `border_${record.fieldsName}` : ""}
          >
            <span>{text}</span>
          </p>
        ),
      },
      {
        title: t("confidence"),
        dataIndex: "confidence",
        align: "left",
        key: "confidence",
        width: 120,
        render: (text) => (text ? <span>{text}%</span> : ""),
      },
    ];
    const uploadButton = (
      <div className="uploadButton">
        <Icon
          style={{ fontSize: "36px", color: "#11aae4", margin: "0 0 10px 0" }}
          type={this.state.loading ? "loading" : "inbox"}
        />
        <div className="ant-upload-text">{t("upload-tip")}</div>
      </div>
    );
    const {
      imageUrl,
      isRequesting,
      data,
      polygonPostcodePoints,
      polygonAddressPoints,
      polygonNamePoints,
      polygonSvgWidth,
      polygonSvgHeight,
      scaleX,
      scaleY,
      postcodePositions,
      addressPositions,
      namePositions,
    } = this.state;
    return (
      <div className="express-container">
        <section className="express-wrap">
          <div className="express-banner">
            <div className="express-title">
              <h1>{t("banner-title")}</h1>
              <p>{t("banner-desc")}</p>
            </div>
          </div>
          <div className="express-main">
            <DrawLine
              postcodePoints={postcodePositions}
              addressPoints={addressPositions}
              namePoints={namePositions}
            ></DrawLine>
            <Spin spinning={isRequesting}>
              <Row gutter={16} className="main-content">
                <Col span={12}>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://imageregdemo.nrihkerp.com"
                    accept="image/jpg, image/jpeg, image/png"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                  >
                    <DrawPolygon
                      polygonPostcodePoints={polygonPostcodePoints}
                      polygonAddressPoints={polygonAddressPoints}
                      polygonNamePoints={polygonNamePoints}
                      polygonSvgWidth={polygonSvgWidth}
                      polygonSvgHeight={polygonSvgHeight}
                      scaleX={scaleX}
                      scaleY={scaleY}
                      imageUrl={imageUrl}
                    ></DrawPolygon>
                    {!imageUrl && uploadButton}
                  </Upload>
                </Col>
                <Col span={12}>
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    className="table-content"
                  />
                </Col>
              </Row>
            </Spin>
          </div>
        </section>
      </div>
    );
  }
}

export default withTranslation("expressOcr")(ExpressOcr);
