/*
 * @Author: nigel
 * @Date: 2020-09-03 15:54:51
 * @LastEditTime: ,: 2020-10-23 17:16:46
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Spin, Icon, message, Upload, Row, Table, Button, Input } from "antd";
import "@styles/tengxunOcr.less";
import { googleOcr } from "@apis/googleOcr";

const columns = [
  {
    title: "#",
    dataIndex: "index",
    key: "index",
    align: "left",
    width: 100,
  },
  {
    title: "Result",
    dataIndex: "itemstring",
    key: "itemstring",
    align: "left",
    render: (text, record) => (
      <p
        id={"border_" + record.fields}
        className={record.result ? "border_" + record.fields : ""}
      >
        <span>{text}</span>
      </p>
    ),
  },
];
const imgArrOrigin = [
  { url: require("@images/ocr_common03.jpg") },
  { url: require("@images/ocr_common04.jpg") },
  { url: require("@images/ocr_common05.jpg") },
  { url: require("@images/ocr_common06.jpg") },
  { url: require("@images/worddetect_3.jpg") },
  { url: require("@images/worddetect_4.jpg") },
];
function getBase64(imagefile, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(imagefile);
}
class GoogleOcr extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.imgOriginRef = React.createRef();
    this.myCanvasRef = React.createRef();
    this.state = {
      loading: false,
      isRequesting: false,
      imgArr: imgArrOrigin,
      imageUrl: imgArrOrigin[0].url,
      img_height: "",
      img_width: "",
      imgObj: {
        backgroundImage: `url(${imgArrOrigin[0].url})`,
      },
      input_url: "",
      curentIndex: 0, //当前激活要识别的图片索引
      tableData: [],
    };
  }

  componentDidMount() {
    this.imgOptions = {}; //中引文体验，多角度，其他语种体验不同选项
    this.box_w = 400;
    this.box_h = 410;
    this.myCtx = this.myCanvasRef.current.getContext("2d");
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

    if (isLt5M && isJpgOrPng) {
      this.setState({
        imageUrl: "",
        tableData: [],
      });
      this.clearCanvasContent();
    }
    return isJpgOrPng && isLt5M;
  };

  handleInputUrlChange = (event) => {
    this.setState({ input_url: event.target.value });
  };

  handleUploadChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      if (this.state.isRequesting) {
        return;
      }

      getBase64(info.file.originFileObj, (imageUrl) => {
        let image = new Image();
        image.onload = () => {
          //限制图片宽
          this.img_width = image.width;
          this.img_height = image.height;
          //这里使用createObjectURL来创建临时图片链接，是为了防止base64格式数据太大，给浏览器造成负担
          let imgUrl = URL.createObjectURL(info.file.originFileObj);
          this.setState(
            {
              loading: false,
              img_width: image.width,
              img_height: image.height,
              imageUrl: imgUrl,
              imgObj: {
                backgroundImage: `url(${imgUrl})`,
              },
            },
            () => {
              this.init();
            }
          );
        };
        image.src = imageUrl;
      });
    }
    if (info.file.status === "error") {
      this.setState({ loading: false });
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  /**
   *@name:init
   * @msg: 根据用户上传、切换不同图片、输入远程链接图片，
   * 单击分析按钮显示识别结果，url代表用户输入的远程图片链接
   * @param {url}
   * @return:
   */
  init(url) {
    // 判断是否有网络图片地址，有的话以网络图片优先
    let { input_url, imageUrl } = this.state;
    if (input_url != "") {
      let http_image_pattern = /^(http:\/\/|https:\/\/){1}.+\.(jpg|jpeg|png|bmp|pdf)$/gi;
      if (http_image_pattern.test(input_url)) {
        //目前对网络图片的框图有些问题，估计没有读取到正确的宽高
        this.setState({
          imageUrl: url,
          imgObj: {
            backgroundImage: `url(${url})`,
          },
        });
        this.clearCanvasContent();
        this.googleGeneralOcr({ url: input_url }, this.imgOptions);
      } else {
        message.warning(t("input_url-tip"));
      }
    } else {
      // 上面上传转换得到的imageUrl是临时图片链接，需要再计算一次，牺牲计算减少内存使用
      // imageUrl可能是临时图片链接，可能是初始化时赋值的图片路径
      this.getImageToBase64Data(imageUrl).then((params) => {
        //默认第一张图,调用接口返回数据
        this.googleGeneralOcr(params, this.imgOptions);
      });
    }
  }
  handleAnalyse = () => {
    if (this.state.isRequesting) {
      return;
    }
    this.init(this.state.input_url);
  };
  googleGeneralOcr(params, options = {}) {
    if (this.isRequesting) {
      return;
    }
    params.options = options;
    this.setState({
      isRequesting: true,
    });
    // 接口请求
    googleOcr(
      params,
      (res) => {
        this.setState({
          isRequesting: false,
        });
        if (res.errno === 0) {
          let resData = res.data;
          let { errorcode } = resData;
          if (errorcode === 0) {
            let responses = resData.responses || [];
            // 确认返回的responses有数据
            if (responses.length) {
              // 默认至于单个请求体，或者一个页面的请求
              let firstPage_response = responses[0] || {};
              let pagesArr = firstPage_response.fullTextAnnotation.pages;
              // pages里保存了blocks，blocks保存了识别出来的每行文字信息或者段落信息，以及对应的每行坐标
              //从blocks取出每行文字以及对应的confidence
              let blocksArr = pagesArr[0].blocks; //由于发送的请求只有一个，所以默认取第一个blocks
              //从blocksArr中获取该页面每行文字信息和坐标
              let coordpointArr = [];
              let items = [];
              for (let i = 0; i < blocksArr.length; i++) {
                let block = blocksArr[i];
                let obj = {
                  itemstring: "",
                  itemconf: "",
                  coordpoint: [],
                };
                // confidence
                obj.itemconf = block["property"]
                  ? block["property"]["detectedLanguages"].confidence
                  : "";
                // 该行对应坐标
                obj.coordpoint = block["boundingBox"].vertices || [];
                // 里面保存了每段或者每行的所有字符，将他们串联起来，保存到itemstring里
                let paragraphs = block.paragraphs[0];
                let words = paragraphs.words;
                obj.itemstring = words.reduce((total, word) => {
                  let symbols = word.symbols;
                  symbols.forEach((element) => {
                    total += element.text;
                  });
                  return total;
                }, "");
                items.push(obj);
                //canvas绘制识别出的文本行在原图中矩形框需要的坐标
                let coordpoint = obj.coordpoint.reduce((total, item) => {
                  let { x, y } = item;
                  return total.concat(x, y);
                }, []);
                coordpointArr.push({ x: coordpoint });
              }
              items = items.map((item, index) => {
                return Object.assign({}, item, { index: index, key: index });
              });
              this.setState({
                tableData: items,
              });
              this.drawRectangleByCanvas(coordpointArr);
              //获取针对该页面的一个总的confidence
              // let avgConfidence =
              //   pagesArr[0].property["detectedLanguages"][0].confidence;
            }
          }
        }
      },
      (res) => {
        // console.warn(error);
        message.warning(res.errmsg);
        this.setState({ isRequesting: false });
      }
    );
  }
  //绘制canvas框图
  drawRectangleByCanvas(coordpointArr) {
    let imgOrigin = this.imgOriginRef.current;
    let source_w = imgOrigin.width;
    let source_h = imgOrigin.height;
    //如果有网络图片,要注意计算网络图片宽高,网络图片有个加载过程
    let { input_url } = this.state;
    if (input_url) {
      let imgElem = new Image();
      imgElem.onload = () => {
        source_w = imgElem.width;
        source_h = imgElem.height;
        //绘制框图
        this.drawRectangle(source_w, source_h, coordpointArr);
      };
      imgElem.src = input_url;
    } else {
      this.drawRectangle(source_w, source_h, coordpointArr);
    }
  }
  drawRectangle(source_w, source_h, coordpointArr) {
    // 求坐标对应比例，因为图片contain到固定盒子里，400*410
    // 保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
    // 图片按照contain模式放到固定盒子的矩形内，需要对图片进行一定的缩放。
    // 原则是：
    // 图片宽高不等，使图片的长边能完全显示出来，则原图片长的一边缩放后等于固定盒子对应一边，等比例求出另外一边，
    // 图片宽高相等，根据固定盒子的宽高来决定缩放后图片的宽高，固定盒子的宽大于高，则缩放后的图片一边等于固定盒子的高度，
    // 对应求出另外一边即可，反之亦然。
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
    //控制canvas画布大小
    this.myCanvasRef.current.width = dWidth;
    this.myCanvasRef.current.height = dHeight;
    this.myCtx.clearRect(0, 0, dWidth, dHeight);
    this.myCtx.scale(scaleX, scaleY);
    for (let i = 0; i < coordpointArr.length; i++) {
      let item = coordpointArr[i].x;
      let x1 = item[0],
        y1 = item[1],
        x2 = item[2],
        y2 = item[3],
        x3 = item[4],
        y3 = item[5],
        x4 = item[6],
        y4 = item[7];
      this.myCtx.strokeStyle = "#00a4ff";
      this.myCtx.lineWidth = 4;
      this.myCtx.beginPath();
      this.myCtx.moveTo(x1, y1);
      this.myCtx.lineTo(x2, y2);
      this.myCtx.lineTo(x3, y3);
      this.myCtx.lineTo(x4, y4);
      this.myCtx.closePath();
      this.myCtx.stroke();
    }
  }
  clearCanvasContent() {
    let imgOrigin = this.imgOriginRef.current;
    let source_w = imgOrigin.width;
    let source_h = imgOrigin.height;
    this.myCanvasRef.current.width = source_w;
    this.myCanvasRef.current.height = source_h;
    this.myCtx.clearRect(0, 0, source_w, source_h);
  }
  // 图片对象转base64
  getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    let dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
  }
  //根据图片路径url新建图片对象，转换base64
  getImageToBase64Data(url) {
    //转换图片为base64
    return new Promise((resolve, reject) => {
      let imgElem = new Image();
      imgElem.onload = () => {
        let img_base64 = this.getBase64Image(imgElem);
        //构造接口请求参数，前端只需要传image或者url即可
        let pramas = {
          image: img_base64,
          url: "",
        };
        //返回接口请求需要的参数
        this.img_width = imgElem.width;
        this.img_height = imgElem.height;
        resolve(pramas);
      };
      imgElem.onerror = () => {
        reject(new Error("Could not load image at " + url));
      };
      imgElem.src = url;
    });
  }
  //处理用户单击选择图片
  handleClickImg = (image, index) => {
    if (this.state.isRequesting) {
      return;
    }
    //清理下canvas
    //消除用戶自己輸入遠程圖片鏈接
    this.clearCanvasContent();
    this.setState(
      {
        input_url: "",
        curentIndex: index,
        imageUrl: image,
        imgObj: {
          backgroundImage: `url(${image})`,
        },
      },
      () => {
        this.init();
      }
    );
  };
  render() {
    const { t } = this.props;
    const {
      imageUrl,
      isRequesting,
      tableData,
      imgArr,
      curentIndex,
      img_height,
      img_width,
      imgObj,
      input_url,
    } = this.state;
    const imgList = imgArr.map((item, index) => {
      return (
        <img
          key={index}
          src={item.url}
          className={
            curentIndex == index ? "pic-item pic-item_active" : "pic-item"
          }
          onClick={this.handleClickImg.bind(this, item.url, index)}
        />
      );
    });
    return (
      <div className="tx-container">
        <section className="tx-wrap">
          <div className="tx-banner">
            <div className="tx-title">
              <h1>{t("banner-title")}</h1>
              <p>{t("banner-desc")}</p>
            </div>
          </div>
          <div className="tx-main">
            <Spin spinning={isRequesting}>
              <Row className="imgList">{imgList}</Row>
              <Row className="input_form">
                <Upload
                  class="generalocr-uploader"
                  action="https://imageregdemo.nrihkerp.com"
                  accept="image/jpg, image/jpeg, image/png"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleUploadChange}
                >
                  <Button type="primary">
                    <Icon type={this.state.loading ? "loading" : "upload"} />
                    {t("upload-btn-text")}
                  </Button>
                </Upload>
                <div className="url_input">
                  <Input
                    value={input_url}
                    onChange={this.handleInputUrlChange.bind(this)}
                    allowClear={true}
                    placeholder={t("input_url_tip")}
                  />
                </div>
                <Button
                  className="analyse-btn"
                  type="primary"
                  onClick={this.handleAnalyse}
                >
                  {t("analyse-btn")}
                </Button>
              </Row>
              <Row gutter={16} className="ocr-result">
                <img
                  ref={this.imgOriginRef}
                  className="imgOrigin"
                  height={img_height}
                  width={img_width}
                  src={imageUrl}
                />
                <div ref={this.imgEditRef} className="ocr_image" style={imgObj}>
                  <canvas ref={this.myCanvasRef} className="ocrGeneralCanvas" />
                </div>
                <div className="result-details">
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                  />
                </div>
              </Row>
            </Spin>
          </div>
        </section>
      </div>
    );
  }
}

export default withTranslation("googleOcr")(GoogleOcr);
