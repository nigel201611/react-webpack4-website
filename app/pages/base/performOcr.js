/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: 2020-11-16 15:06:49
 */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Icon, message, Steps, Button, Spin, notification } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { selectTemplate } from '@apis/userTemplate';
import '@styles/performOcr.less';
import UploadComp from '@components/UploadComp/UploadComp';
import CustomizeArea from '@components/CustomizeArea/CustomizeArea';
import ModalList from '@components/ModalList/ModalList';
import TableList from '@components/TableList/TableList';

const { Step } = Steps;
const steps = [
  {
    title: 'upload',
    content: 'First-content',
    icon: <PictureOutlined />,
  },
  {
    title: 'select-template',
    description: 'selectTemp-desc',
    content: 'Second-content',
    icon: <Icon type="solution" />,
  },
  {
    title: 'perform-ocr',
    content: 'Third-content',
    icon: <Icon type="scan" />,
  },
];

class PerformOcr extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.customizeAreaRef = React.createRef();
    this.modalListRef = React.createRef();
    this.state = {
      loading: false,
      isRequesting: false,
      performOcrRequesting: false, // 标识当前是否正在执行OCR识别
      imageUrl: '',
      current: 0, // 当前步骤索引
      bill_width: '680', // 運單默認寬度
      bill_height: '400', // 運單默認高度
      uploadImgType: 'image/jpeg',
      templateDataArr: [], // 模板对象数据
      modalListVisible: false, // 控制modalList显示
      templateIndex: 0, // 用户选择的模板索引，默认第一个
      responseData: [], // 保存执行ocr结果数据
    };
  }

  componentDidMount() {
    this.fixSizeW = 1680; // 控制用户上传图片宽度，宽大于2024，固定尺寸为2024,小于2024，原图片显示。
    this.fixSizeH = 1680;
    this.OriginImageUrl = ''; // 保存用户上传未处理的图片数据
    this.calibrating = false; // 控制图片校准标识，防止过频
  }
  componentWillUnmount() {
    URL.revokeObjectURL(this.OriginImageUrl);
    this.customizeAreaRef = null;
  }
  /*
   * @name: prev
   * @msg: 控制steps返回
   * @param {*}
   * @return {*}
   */
  prev = () => {
    const current = this.state.current - 1;
    const { templateDataArr, templateIndex } = this.state;
    // 返回上一步，应该显示用户之前选择的模板
    this.setState({ current }, () => {
      if (current === 1 && templateDataArr.length) {
        this.handleClearArea();
        this.hanldeDrawCustomArea(templateDataArr[templateIndex].blockItem);
      }
    });
  };

  beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/JPG file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }

    this.setState({
      imageUrl: '',
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
    const myCanvas = document.createElement('canvas');
    const myCtx = myCanvas.getContext('2d');
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
      // 去掉dll校准，添加此处代码，否则注释掉
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
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // 对上传成功，如果尺寸过大做些控制
      const fileObj = info.file.originFileObj;
      this.OriginImageUrl = URL.createObjectURL(fileObj);
      this.setState({
        uploadImgType: fileObj.type,
      });
      // 上传成功调用校准接口校准下图片，file.raw
      this.calibrationImage(fileObj);
      // 请求用户模板数据
      this.selectUserTemplate();
    }
    if (info.file.status === 'error') {
      this.setState({ loading: false });
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  /**
   * @name: selectUserTemplate
   * @msg: 查找登录用户的所有模板
   * @param {type}
   * @return {type}
   */
  selectUserTemplate = () => {
    if (this.state.isRequesting) {
      return;
    }
    this.setState({
      isRequesting: true,
    });
    selectTemplate(
      {},
      (res) => {
        this.setState({
          isRequesting: false,
        });
        const { errno, data } = res;
        if (errno == 0) {
          if (data !== null) {
            const templateDataArr = data;
            templateDataArr.forEach((item, index) => {
              let blockItem = item.blockItem;
              blockItem = blockItem.replace(/\\/, '');
              templateDataArr[index].blockItem = JSON.parse(blockItem);
            });
            this.setState(
              {
                templateDataArr: templateDataArr,
              },
              () => {
                // 默认第一个模板
                // 绘制区域前，先清理之前的
                this.handleClearArea();
                this.hanldeDrawCustomArea(templateDataArr[0].blockItem);
              },
            );
          } else {
            // 提示没有模板数据
            notification.warning({
              message: this.props.t('tips'),
              description: this.props.t('no_data'),
            });
          }
        }
        // this.tableData
      },
      (err) => {
        notification.error({
          message: this.props.t('tips'),
          description: err.errmsg,
        });
        this.setState({
          isRequesting: false,
        });
      },
    );
  };

  handleClearArea = () => {
    // 清除盒子下新增的子节点
    this.customizeAreaRef.current.clearArea();
  };
  hanldeDrawCustomArea = (blockItems) => {
    this.customizeAreaRef.current.drawCustomizeArea(blockItems);
  };

  setRequestStatus = (status) => {
    this.setState({
      performOcrRequesting: status,
    });
  };
  /*
   * @name: setResponseData
   * @msg: 获取识别结果数据
   * @param {*}
   * @return {*}
   */
  setResponseData = (responseData) => {
    // responseData = responseData.map((item) => {
    //   item.text = item.text.map((value, index) => {
    //     value.id = index;
    //   });
    //   return item;
    // });
    this.setState({
      responseData,
      current: 2,
    });
  };

  performOcr = () => {
    this.customizeAreaRef.current.requestOcrEngine();
  };
  /*
   * @name: showTemplate
   * @msg: 查看模板，显示用户当前模板数据，模态框显示模板数据列表
   * @param {*}
   * @return {*}
   */
  showTemplate = () => {
    this.setState({
      modalListVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({ modalListVisible: false });
  };

  /*
   * @name: handleCreate
   * @msg: 用户执行OCR，第二步中，查看模板，选择模板，如果一个没选，那么给出提示，请至少选择一个，默认第一个
   * @param {*}
   * @return {*}
   */
  handleConfirm = () => {
    console.log('confirm');
    this.setState({ modalListVisible: false });
  };
  /*
   * @name: changeTemplateIndex
   * @msg: 用户选择不同模板
   * @param {*}
   * @return {*}
   */
  changeTemplateIndex = (event) => {
    const templateIndex = event.target['data-index'];
    const checked = event.target.checked;
    if (checked) {
      // 绘制区域前，先清理之前的
      this.handleClearArea();
      this.hanldeDrawCustomArea(this.state.templateDataArr[templateIndex].blockItem);
      this.setState({
        templateIndex: templateIndex,
      });
    }
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
      isRequesting,
      modalListVisible,
      templateDataArr,
      templateIndex,
      performOcrRequesting,
      responseData,
    } = this.state;
    const uploadButton = (
      <div>
        <Icon
          style={{ fontSize: '36px', color: '#11aae4', margin: '0 0 10px 0' }}
          type={loading ? 'loading' : 'inbox'}
        />
        <div className="ant-upload-text">{t('upload-tips')}</div>
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
          <Spin spinning={isRequesting}>
            <CustomizeArea
              imageUrl={imageUrl}
              bill_height={bill_height}
              bill_width={bill_width}
              uploadImgType={uploadImgType}
              setRequestStatus={this.setRequestStatus}
              setResponseData={this.setResponseData}
              disableEditFunc
              ref={this.customizeAreaRef}
            />
          </Spin>
        );
        break;
      case 2:
        steps[current].content = <TableList tableData={responseData} />;
        break;
    }
    return (
      <div className="page-container">
        <section className="page-wrap">
          <div className="page-banner">
            <div className="page-title">
              <h1>{t('banner-title')}</h1>
              <p>{t('banner-desc')}</p>
              <span className="steps-action">
                {current === 1 && (
                  <>'                   '<Button onClick={this.prev}>{t('back-upload')}</Button>'
                    <Button
                      type="primary"
                      disabled={!templateDataArr.length}
                      onClick={this.showTemplate}
                    >
                      {t('show-template')}
                    </Button>'                   '<Button
                      type="primary"
                      loading={performOcrRequesting}
                      onClick={this.performOcr}
                    >
                      {t('perform-ocr')}
                    </Button>'                 '</>
                )}
                {current === 2 && (
                  <>'                   '<Button type="primary" onClick={this.prev}>
                    {t('stepback')}
                  </Button>'                 '</>
                )}
              </span>
            </div>
          </div>
          <div className="page-main">
            <ModalList
              ref={this.modalListRef}
              templateIndex={templateIndex}
              changeTemplateIndex={this.changeTemplateIndex}
              visible={modalListVisible}
              onCancel={this.handleCancel}
              onConfirm={this.handleConfirm}
              tableData={templateDataArr}
            />
            <Steps size="small" current={current}>
              {steps.map(item => (
                <Step
                  key={item.title}
                  title={t(item.title)}
                  description={t(item.description)}
                  icon={item.icon}
                />
              ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
          </div>
        </section>
      </div>
    );
  }
}

export default withTranslation('performOcr')(PerformOcr);
