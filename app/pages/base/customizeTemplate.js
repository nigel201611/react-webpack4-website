/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-11-23 15:13:08
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Icon, message, Steps, Button } from "antd";
import { connect } from "react-redux";
import { PictureOutlined, UngroupOutlined } from "@ant-design/icons";
import "@styles/customizeTemplate.less";
import UploadComp from "@components/UploadComp/UploadComp";
import CustomizeArea from "@components/CustomizeArea/CustomizeArea";
import TableList from "@components/TableList/TableList";
import { editTemplateData } from "@actions/common";

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
  {
    title: "perform-ocr",
    content: "Third-content",
    icon: <Icon type="scan" />,
  },
];
@connect((state) => ({
  currentEditTemplateData: state.currentEditTemplateData,
}))
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
      current: 0, // 当前步骤索引
      bill_width: "680", // 運單默認寬度
      bill_height: "400", // 運單默認高度
      uploadImgType: "image/jpeg",
      saving: false,
      responseData: [], // 保存执行ocr结果数据
      performOcrRequesting: false, // 标识当前是否正在执行OCR识别
    };
  }

  componentDidMount() {
    this.fixSizeW = 1680; // 控制用户上传图片宽度，宽大于1024，固定尺寸为1024,小于1024，原图片显示。
    this.fixSizeH = 1680;
    this.OriginImageUrl = ""; // 保存用户上传未处理的图片数据
    this.calibrating = false; // 控制图片校准，防止过频
    // this.templateData =
    //   (this.props.location &&
    //     this.props.location.state &&
    //     this.props.location.state.templateData) ||
    //   null; // 是否有从路由跳转传来参数
    // this.handleMyTemplateEdit(this.templateData);
    if (
      this.props.currentEditTemplateData &&
      typeof this.props.currentEditTemplateData === "object"
    ) {
      this.handleMyTemplateEdit(this.props.currentEditTemplateData);
    }
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.OriginImageUrl);
    this.customizeZoneRef = null;
    this.customizeAreaRef = null;
    this.props.dispatch(editTemplateData(null));
  }
  // 从我的模板通过编辑按钮，跳转过来处理
  handleMyTemplateEdit(templateData) {
    if (templateData && JSON.stringify(templateData) != "{}") {
      // 调用自定区域组件方法根据数据绘制自定区域
      const image = templateData.image;
      const imageElem = new Image();
      imageElem.onload = () => {
        const bill_width = imageElem.width;
        const bill_height = imageElem.height;
        this.setState(
          { current: 1, imageUrl: templateData.image, bill_width, bill_height },
          () => {
            const customizeArea = this.customizeAreaRef.current;
            customizeArea.handleEditTemplate(templateData);
          }
        );
      };
      imageElem.src = image;
    }
  }

  prev = () => {
    const current = this.state.current - 1;
    // 返回上一步，应该显示用户之前绘制的区域，获取绘制的区域数据
    this.setState({ current });
    // this.setState({ current }, () => {
    //   if (current === 1) {
    //     const blockItems = this.customizeAreaRef.current.getBlockItems();
    //     this.hanldeDrawCustomArea(blockItems);
    //   }
    // });
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
    const imgElem = new Image();
    const myCanvas = document.createElement("canvas");
    const myCtx = myCanvas.getContext("2d");
    imgElem.src = this.OriginImageUrl;
    this.calibrating = true;
    imgElem.onload = () => {
      let imgWidth = imgElem.width, // 上传图片的宽
        imgHeight = imgElem.height, // 上传图片的高
        maxWidth = this.fixSizeW, // 图片最大宽
        maxHeight = this.fixSizeH, // 图片最大高
        targetWidth = imgWidth, // 最后图片的宽
        targetHeight = imgHeight; // 最后图片的高
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
      myCanvas.width = targetWidth; // canvas的宽=图片的宽
      myCanvas.height = targetHeight; // canvas的高=图片的高
      myCtx.clearRect(0, 0, targetWidth, targetHeight); // 清理canvas
      myCtx.drawImage(imgElem, 0, 0, targetWidth, targetHeight); // canvas绘图
      const imageUrl = myCanvas.toDataURL(file.type, 1.0);
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
      const fileObj = info.file.originFileObj;
      this.OriginImageUrl = URL.createObjectURL(fileObj);
      this.setState({
        uploadImgType: fileObj.type,
      });
      // 上传成功调用校准接口校准下图片，file.raw
      this.calibrationImage(fileObj);
    }
    if (info.file.status === "error") {
      this.setState({ loading: false });
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  handleClearArea = () => {
    // 清除盒子下新增的子节点
    this.customizeAreaRef.current.clearArea();
  };

  setSaveStatus = (status) => {
    this.setState({
      saving: status,
    });
  };

  saveCustTemplate = () => {
    this.customizeAreaRef.current.confirmSaveTemplate();
  };
  hanldeDrawCustomArea = (blockItems) => {
    this.customizeAreaRef.current.drawCustomizeArea(blockItems);
  };

  /*
   * @name: setResponseData
   * @msg: 获取识别结果数据
   * @param {*}
   * @return {*}
   */
  setResponseData = (responseData) => {
    this.setState({
      responseData,
      current: 2,
    });
  };
  setRequestStatus = (status) => {
    this.setState({
      performOcrRequesting: status,
    });
  };

  performOcr = () => {
    this.customizeAreaRef.current.requestOcrEngine();
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
      performOcrRequesting,
      responseData,
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
      // case 1:
      //   steps[current].content = (
      //     <CustomizeArea
      //       imageUrl={imageUrl}
      //       bill_height={bill_height}
      //       bill_width={bill_width}
      //       uploadImgType={uploadImgType}
      //       setSaveStatus={this.setSaveStatus}
      //       ref={this.customizeAreaRef}
      //       setRequestStatus={this.setRequestStatus}
      //       setResponseData={this.setResponseData}
      //     />
      //   );
      //   break;
      case 2:
        steps[current].content = <TableList tableData={responseData} />;
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
            <div className="steps-content">
              {current !== 1 && steps[current].content}
              <CustomizeArea
                imageUrl={imageUrl}
                needKeepAlive={current === 1}
                bill_height={bill_height}
                bill_width={bill_width}
                uploadImgType={uploadImgType}
                setSaveStatus={this.setSaveStatus}
                ref={this.customizeAreaRef}
                setRequestStatus={this.setRequestStatus}
                setResponseData={this.setResponseData}
              />
            </div>
            <div className="steps-action">
              {current === 1 && (
                <>
                  <Button onClick={this.prev}>{t("back-upload")}</Button>
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
                  <Button
                    type="primary"
                    loading={performOcrRequesting}
                    onClick={this.performOcr}
                  >
                    {t("perform-ocr")}
                  </Button>
                </>
              )}
              {current === 2 && (
                <>
                  <Button type="primary" onClick={this.prev}>
                    {t("stepback")}
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
