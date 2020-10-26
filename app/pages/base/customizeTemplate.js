/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-10-26 15:58:15
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Icon, message, Steps, Button } from "antd";
import { PictureOutlined, UngroupOutlined } from "@ant-design/icons";
import "@styles/customizeTemplate.less";
import UploadComp from "@components/UploadComp/UploadComp";
import CustomizeArea from "@components/CustomizeArea/CustomizeArea";

const { Step } = Steps;
const steps = [
  {
    title: "upload",
    content: "First-content",
    icon: <PictureOutlined />,
  },
  {
    title: "customize-area",
    content: "Second-content",
    icon: <UngroupOutlined />,
  },
];

// const columns = [
//   {
//     title: "Fields",
//     dataIndex: "fields",
//     key: "fields",
//     align: "left",
//     width: 100,
//     render: (text) => <a>{text}</a>,
//   },
//   {
//     title: "Result",
//     dataIndex: "result",
//     align: "left",
//     key: "result",
//     render: (text, record) => (
//       <p
//         id={"border_" + record.fields}
//         className={record.result ? "border_" + record.fields : ""}
//       >
//         <span>{text}</span>
//       </p>
//     ),
//   },
//   {
//     title: "Confidence",
//     dataIndex: "confidence",
//     align: "left",
//     key: "confidence",
//     width: 120,
//     render: (text) => (text ? <span>{text}%</span> : ""),
//   },
// ];
class CustomizeTemp extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.customizeZoneRef = React.createRef();
    this.customizeAreaRef = React.createRef();
    this.state = {
      loading: false,
      isRequesting: false,
      imageUrl: "",
      current: 0, //当前步骤索引
      bill_width: "680", //運單默認寬度
      bill_height: "400", //運單默認高度
      uploadImgType: "image/jpeg",
      saving: false,
    };
  }

  componentDidMount() {
    this.fixSizeW = 2048; //控制用户上传图片宽度，宽大于1024，固定尺寸为1024,小于1024，原图片显示。
    this.fixSizeH = 2048;
    this.OriginImageUrl = ""; //保存用户上传未处理的图片数据
    this.calibrating = false; //控制图片校准标识，防止过频
    this.templateData =
      (this.props.location &&
        this.props.location.state &&
        this.props.location.state.templateData) ||
      null; //是否有从路由跳转传来参数
    this.handleMyTemplateEdit(this.templateData);
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.OriginImageUrl);
    this.customizeZoneRef = null;
    this.customizeAreaRef = null;
  }
  // 从我的模板通过编辑按钮，跳转过来处理
  handleMyTemplateEdit(templateData) {
    if (templateData && JSON.stringify(templateData) != "{}") {
      //调用自定区域组件方法根据数据绘制自定区域
      let image = templateData.image;
      let imageElem = new Image();
      imageElem.onload = () => {
        let bill_width = imageElem.width;
        let bill_height = imageElem.height;
        this.setState(
          { current: 1, imageUrl: templateData.image, bill_width, bill_height },
          () => {
            let customizeArea = this.customizeAreaRef.current;
            customizeArea.handleEditTemplate(templateData);
          }
        );
      };
      imageElem.src = image;
    }
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev = () => {
    const current = this.state.current - 1;
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
    let myCanvas = document.createElement("canvas");
    let myCtx = myCanvas.getContext("2d");
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
      let fileObj = info.file.originFileObj;
      this.OriginImageUrl = URL.createObjectURL(fileObj);
      this.setState({
        uploadImgType: fileObj.type,
      });
      //上传成功调用校准接口校准下图片，file.raw
      this.calibrationImage(fileObj);
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
  handleClearArea = () => {
    //清除盒子下新增的子节点
    this.customizeAreaRef.current.clearArea();
  };

  setSaveStatus = (status) => {
    this.setState({
      saving: status,
    });
  };

  saveCustTemplate = () => {
    this.customizeAreaRef.current.saveCustomize();
  };

  render() {
    const { t } = this.props;
    const {
      imageUrl,
      current,
      bill_width,
      bill_height,
      loading,
      uploadImgType,
      saving,
    } = this.state;
    const uploadButton = (
      <div>
        <Icon
          style={{ fontSize: "36px", color: "#11aae4", margin: "0 0 10px 0" }}
          type={loading ? "loading" : "inbox"}
        />
        <div className="ant-upload-text">{t("upload-tips")}</div>
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
          <CustomizeArea
            imageUrl={imageUrl}
            bill_height={bill_height}
            bill_width={bill_width}
            uploadImgType={uploadImgType}
            setSaveStatus={this.setSaveStatus}
            ref={this.customizeAreaRef}
          ></CustomizeArea>
        );
        break;
    }
    return (
      <div className="page-container">
        <section className="page-wrap">
          <div className="page-banner">
            <div className="page-title">
              <h1>{t("banner-title")}</h1>
              <p>{t("banner-desc")}</p>
            </div>
          </div>
          <div className="page-main">
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={t(item.title)} icon={item.icon} />
              ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
              {current === 1 && (
                <>
                  <Button type="primary" onClick={this.prev}>
                    {t("back-upload")}
                  </Button>
                  <Button type="primary" onClick={this.handleClearArea}>
                    {t("clear-area")}
                  </Button>
                  <Button
                    type="primary"
                    loading={saving}
                    onClick={this.saveCustTemplate}
                  >
                    {t("save-template")}
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
