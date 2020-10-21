/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: ,: 2020-10-21 18:31:40
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Icon, message, Table, Steps, Button } from "antd";
import { PictureOutlined, UngroupOutlined } from "@ant-design/icons";
import "@styles/customizeTemplate.less";
import UploadComp from "@components/UploadComp/UploadComp";
import { expressBill } from "@apis/expressOcr";

const { Step } = Steps;
const steps = [
  {
    title: "上传",
    content: "First-content",
    icon: <PictureOutlined />,
  },
  {
    title: "自定区域",
    content: "Second-content",
    icon: <UngroupOutlined />,
  },
];

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
    this.customizeZoneRef = React.createRef();
    this.imgElemRef = React.createRef();
    this.state = {
      loading: false,
      isRequesting: false,
      imageUrl: "",
      current: 0, //当前步骤索引
      bill_width: "680", //運單默認寬度
      bill_height: "400", //運單默認高度
    };
  }

  componentDidMount() {
    this.editImageArr = []; //保存用户自定区域绘制起点和宽高[{x:0,y:0,width:100,height:100}]
    // 模板数据，模板里可能包含多个自定区域数据 blockItem:
    // [{"block_id":"20200901181925pwxa1jykfid","name":"地址","ocr_engine":"expressbill","block":{"x":93,"y":176,"width":235,"height":113}}]
    this.TemplateData = [];
    this.fixSizeW = 2048; //控制用户上传图片宽度，宽大于1024，固定尺寸为1024,小于1024，原图片显示。
    this.fixSizeH = 2048;
    this.myCanvas = document.createElement("canvas");
    this.myCtx = this.myCanvas.getContext("2d");
    this.OriginImageUrl = ""; //保存用户上传未处理的图片数据
    this.scaleMini = 1; //缩小比例
    this.scaleMax = 1; //放大比例
    this.curDiv = null; //保存当前绘制的框图
    this.editCustomBlockFlag = false; //标识是否二次修改自定区域
    this.curId = ""; //标识当前修改的id
    this.blockItem = null; //标识当前根据id找到的自定区域块数据
    this.matchTemplateItem = null; //模板匹配命中其中一个模板数据
    this.calibrating = false; //控制图片校准标识，防止过频
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev = () => {
    const current = this.state.current - 1;
    console.log(current);
    this.setState({ current });
  };

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
    });
    return isJpgOrPng && isLt5M;
  };
  // 校准图片
  calibrationImage(file) {
    // 加载图片校准
    if (this.calibrating) {
      return;
    }
    let imgElem = new Image();
    let myCanvas = this.myCanvas;
    let myCtx = this.myCtx;
    imgElem.src = this.OriginImageUrl;
    this.calibrating = true;
    imgElem.onload = () => {
      let imgWidth = imgElem.width, //上传图片的宽
        imgHeight = imgElem.height, //上传图片的高
        maxWidth = this.fixSizeW, //图片最大宽
        maxHeight = this.fixSizeH, //图片最大高
        targetWidth = imgWidth, //最后图片的宽
        targetHeight = imgHeight; //最后图片的高
      // 如果图片的宽或者高大于限定的最大宽高
      if (imgWidth > maxWidth || imgHeight > maxHeight) {
        // 宽大于高
        if (imgWidth / imgHeight > maxWidth / maxHeight) {
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (imgHeight / imgWidth));
        }
        // 宽小于高
        else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (imgWidth / imgHeight));
        }
      }
      myCanvas.width = targetWidth; //canvas的宽=图片的宽
      myCanvas.height = targetHeight; //canvas的高=图片的高
      myCtx.clearRect(0, 0, targetWidth, targetHeight); //清理canvas
      myCtx.drawImage(imgElem, 0, 0, targetWidth, targetHeight); //canvas绘图
      // 去掉dll校准，添加此处代码，否则注释掉
      let imageUrl = myCanvas.toDataURL(file.type, 1.0);
      this.calibrating = false;
      this.setState({
        imageUrl,
        loading: false,
        current: 1,
        bill_width: targetWidth,
        bill_height: targetHeight,
      });
      // 调用dll校准
      // this.callCalibrateDll(myCanvas,file);
    };
  }

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // 对上传成功，如果尺寸过大做些控制
      this.OriginImageUrl = URL.createObjectURL(info.file.originFileObj);
      //上传成功调用校准接口校准下图片，file.raw
      this.calibrationImage(info.file.originFileObj);
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
  /**
   * @name: handleClearArea
   * @msg:清除用户所有自定区域
   * @param {}
   * @return:
   */
  handleClearArea = () => {
    //清除盒子下新增的子节点
    let oBox = this.imgOriginRef.current;
    oBox.innerHTML = "";
    this.editImageArr = [];
    this.TemplateData = [];
  };

  render() {
    const { imageUrl, current, bill_width, bill_height, loading } = this.state;
    const uploadButton = (
      <div>
        <Icon
          style={{ fontSize: "36px", color: "#11aae4", margin: "0 0 10px 0" }}
          type={loading ? "loading" : "inbox"}
        />
        <div className="ant-upload-text">
          支持JPG/JPEG/PNG,limit 5MB,图片清晰，文字尽可能呈水平
        </div>
      </div>
    );
    switch (current) {
      case 0:
        steps[current].content = (
          <UploadComp
            onChange={this.handleChange}
            beforeUpload={this.beforeUpload}
          >
            {uploadButton}
          </UploadComp>
        );
        break;
      case 1:
        steps[current].content = (
          <div className="usercustomize_area">
            <div className="img_background_wrap">
              <div
                ref={this.customizeZoneRef}
                className="img-wrap"
                style={{
                  background: `url(${imageUrl}) no-repeat 0 0`,
                  backgroundSize: "cover",
                  width: bill_width + "px",
                  height: bill_height + "px",
                  transform: "rotate(0)",
                }}
              />
            </div>
          </div>
        );
        break;
    }
    return (
      <div className="page-container">
        <section className="page-wrap">
          <div className="page-banner">
            <div className="page-title">
              <h1>自定OCR模板</h1>
              <p>
                1 上传运单图片或其他格式图片; 2
                按住鼠标左键在图片上拖动鼠标绘制不同‘识别选区’; 3
                保存模板，之后可以去‘执行OCR’页面选择
                同格式图片进行识别，模板的自定为后面同类型图片识别提升工作效率。
              </p>
            </div>
          </div>
          <div className="page-main">
            <img
              ref={this.imgElemRef}
              className="imgElem"
              height={bill_height}
              width={bill_width}
              src={imageUrl}
            />
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} icon={item.icon} />
              ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
              {current === 1 && (
                <>
                  <Button type="primary" onClick={this.prev}>
                    返回上传
                  </Button>
                  <Button type="primary" onClick={this.handleClearArea}>
                    清除区域
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => message.success("Processing complete!")}
                  >
                    保存模板
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default withTranslation("customizeTemp")(CustomizeTemp);
