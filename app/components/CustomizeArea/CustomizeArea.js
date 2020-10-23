/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: ,: 2020-10-23 15:50:40
 */
import React, { Component } from "react";
import ModalForm from "@components/ModalForm/ModalForm";
import { notification } from "antd";
import { uuid } from "@utils/common";
import { saveTemplate } from "@apis/userTemplate";
import { withTranslation } from "react-i18next";
import "./CustomizeArea.less";
class CustomizeArea extends Component {
  constructor(props) {
    super(props);
    this.customizeZoneRef = React.createRef();
    this.imgElemRef = React.createRef();
    this.state = {
      cusAreaModalVisible: false,
      isSaving: false, //标识当前是否处于保存模板数据中，并且给出保存动效
    };
  }

  componentDidMount() {
    this.uploadImgType = this.props.uploadImgType;
    this.origin = {
      x: 0,
      y: 0,
    }; //鼠标刚开始按下的点
    this.editImageArr = []; //保存自定区域起点和宽高{x:0,y:0,width:100,height:100}
    this.userCustomizeArr = []; //保存用户自定区域相关参数
    this.userDataImage = []; //保存用户自定区域base64数据,后面用于拼接到resDetectDataArr，展示数据
    this.TemplateData = []; //保存模板数据，模板里可能包含多个自定区域数据 blockItem:[{"block_id":"20200901181925pwxa1jykfid","name":"地址","ocr_engine":"expressbill","block":{"x":93,"y":176,"width":235,"height":113}}]
    this.curPoints = null; //当前用户自定区域数据{x,y,width,height}
    this.startXY = { x: 0, y: 0 }; //保存用户按下鼠标起点x,y注意和offsetX区别
    this.endXY = { x: 0, y: 0 }; //保存用户按下鼠标终点x,y注意和offsetX区别，和startXY一起用于准确计算宽高
    this.dragInfoWidthHeight = {
      width: 0,
      height: 0,
    };
    this.curDiv = null; //保存当前绘制的框图
    this.editCustomBlockFlag = false; //标识是否二次修改自定区域
    this.curId = ""; //标识当前修改的id
    this.blockItem = null; //标识当前根据id找到的自定区域块数据
    this.type = "expressbill"; //标识当前识别类型
    this.customBlockForm = {
      //用于再次编辑区域，回显表单数据
      name: "", //自定区域名称
      OCR_engine: "expressbill", //当前ocr引擎类型,默认运单
    };
    this.myCanvas = document.createElement("canvas");
    this.myCtx = this.myCanvas.getContext("2d");
    this.addEditableFunc();
    this.initEvent();
  }

  componentWillUnmount() {
    //卸载该组件前判断当前用户是否由自定区域，是否已经保存，如果保存了直接离开，没保存，弹窗让用户确认
    console.log("componentWillUnmount");
  }
  // 初始化一些事件
  initEvent = () => {
    let oBox = this.customizeZoneRef.current;
    //rect_item
    oBox.onclick = (ev) => {
      let { target } = ev;
      if (target.className.indexOf("rect_item") > -1) {
        //可以重新打开自动区域编辑模态框
        this.curId = target.id;
        this.blockItem = this.TemplateData.find(function (item) {
          return item.block_id == target.id;
        });
        // 根据自定区域id找到对应数据，然后回显到编辑的表单中
        this.customBlockForm.name = this.blockItem.name;
        this.customBlockForm.OCR_engine = this.blockItem.ocr_engine;
        const { form } = this.formRef.props;
        form.setFieldsValue({
          ...this.customBlockForm,
        });
        this.curDiv = target;
        this.setState({
          cusAreaModalVisible: true,
        });
        this.editCustomBlockFlag = true;
      }
    };
  };

  /**
   * @name: addEditableFunc
   * @msg: 自定区域编辑功能添加相关事件，初始化
   * @param {}
   * @return:
   */
  addEditableFunc() {
    let oBox = this.customizeZoneRef.current;
    //鼠标按下，获取初始点
    oBox.onmousedown = (ev) => {
      //事件延迟性，如果用户框选了区域后，再次选择识别类型下拉框，这里的this.type还是上次的，并没有及时获取到
      //那么需要提示用户选择对应类型
      ev = ev || window.event;
      let { target } = ev;
      if (target.className == "img-wrap") {
        //1.获取按下的点
        let x1 = ev.offsetX;
        let y1 = ev.offsetY;
        //记录鼠标按下的点
        this.origin = {
          x: x1,
          y: y1,
        };
        // console.log(x1,y1);
        this.startXY = {
          x: ev.x,
          y: ev.y,
        };
        // 初始化当前拖拽尺寸
        this.dragInfoWidthHeight = { width: 0, height: 0 };
        this.editCustomBlockFlag = false;
        //2.创建div
        let oDiv = document.createElement("div");
        this.curDiv = oDiv;
        oDiv.setAttribute("class", "rect_item");
        oBox.onmousemove = (e) => {
          // 会不断触发
          e = e || window.event;
          this.endXY = {
            x: e.x,
            y: e.y,
          };
          let x1 = this.origin.x,
            y1 = this.origin.y;
          // 鼠标移动的点处理，为啥往右下移动过程中，横坐标会变小,offsetX有问题
          let width = Math.abs(this.endXY.x - this.startXY.x);
          let height = Math.abs(this.endXY.y - this.startXY.y);
          //对width和height做限制至少大于25
          this.dragInfoWidthHeight = {
            width,
            height,
          };
          //3.设置div的样式,2,61分别矫正位置用
          oDiv.style.left = x1 + "px";
          oDiv.style.top = y1 + "px";
          oDiv.style.width = width + "px";
          oDiv.style.height = height + "px";
          oDiv.style.border = "2px solid #409EFF";
          oDiv.style.background = "rgba(64,158,255,0.4)";
          oDiv.style.position = "absolute";
          oBox.appendChild(oDiv);
          if (width <= 30) {
            oBox.removeChild(oDiv);
          }
        };

        oBox.onmouseup = () => {
          let x1 = this.origin.x,
            y1 = this.origin.y;
          // 记录用户自定义区域的原点和宽高
          // 对width和height做限制,至少大于25
          let { width, height } = this.dragInfoWidthHeight;
          if (width > 30) {
            let pointsInfo = {
              x: x1,
              y: y1,
              width: width,
              height: height,
            };
            this.curPoints = pointsInfo;
            //弹出自定区域编辑
            //用户点击下也会触发，需要处理
            this.showModal();
            // this.dialogCustomBlockVisible = true;
          }
        };
      }
    };
    //在鼠标抬起后终止onmousemove事件
    document.onmouseup = function () {
      oBox.onmousemove = null;
      oBox.onmouseup = null;
    };
  }
  /*
   * @name:
   * @msg: 显示编辑模态框
   * @param {*}
   * @return {*}
   */
  showModal = () => {
    this.setState({
      cusAreaModalVisible: true,
    });
  };
  /*
   * @name: 自定区域编辑取消
   * @msg: 取消自定区域编辑
   * @param {*}
   * @return {*}
   */
  handleCancel = () => {
    // 取消，需要清理本次绘制的自定区域
    let oBox = this.customizeZoneRef.current;
    // 判断下取消是二次修改
    if (!this.editCustomBlockFlag) {
      oBox.removeChild(this.curDiv);
    }
    this.setState({ cusAreaModalVisible: false });
  };

  /*
   * @name: 自定区域编辑确认
   * @msg: 自定区域编辑确认，收集用户输入的数据
   * @param {*}
   * @return {*}
   */
  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // console.log("Received values of form: ", values);
      this.customBlockForm = values;
      // 用户编辑完自定区域后，进行相关数据的收集
      this.getUserInputData();
      form.resetFields();
      this.setState({ cusAreaModalVisible: false });
    });
  };

  /**
   * @name: getImageByPointsInfo
   * @msg: 通过(x,y,width,height)数据获取自定区域图片base64数据
   * @param {}
   * @return:
   */
  getImageByPointsInfo = (points) => {
    let image = new Image();
    image.src = this.props.imageUrl;
    let { x, y, width, height } = points;
    let canvas = document.createElement("canvas"); //创建canvas元素
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    let ctx = canvas.getContext("2d");
    // 裁剪图片
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    // 将canvas转化base64
    return canvas.toDataURL(this.uploadImgType, 1.0);
  };

  getUserInputData = () => {
    let pointsInfo = this.curPoints;
    let imageData = this.getImageByPointsInfo(pointsInfo);
    let blockItem = {
      block_id: uuid(),
      name: this.customBlockForm.name,
      ocr_engine: this.customBlockForm.OCR_engine,
      block: pointsInfo,
      image: imageData, //保存到数据库或者本地，不需要保存这个字段数据
    };
    // 给当前正在编辑的区域，添加唯一标识id，用于下次重新编辑进行区分
    this.curDiv.setAttribute("id", blockItem.block_id);
    this.changeCurDivBg(this.curDiv, this.customBlockForm.OCR_engine);
    // 如果用户是新增，那么就添加到TemplatedData中,否则修改原有区域数据即可
    this.TemplateData.push(blockItem);
    this.editImageArr.push(pointsInfo);
  };

  changeCurDivBg = (curDiv, OCR_engine) => {
    let curDivBg = "rgba(64,158,255,0.4)";
    let curBorder = "2px solid #409EFF";
    switch (OCR_engine) {
      case "expressbill":
        curDivBg = "rgba(7,190,20,0.2)";
        curBorder = "2px solid #07be14";
        break;
      case "postcode":
        curDivBg = "rgba(214,1,253,0.2)";
        curBorder = "2px solid #d601fd";
        break;
      case "name":
        curDivBg = "rgba(253,1,1,0.2)";
        curBorder = "2px solid #fd0101";
        break;
    }
    curDiv.style.border = curBorder;
    curDiv.style.background = curDivBg;
  };

  /**
   * @name: saveCustomize
   * @msg: 保存当前自定区域模板数据
   * 用户也可以对保存的模板重新编辑，查看，删除
   * @return:
   */
  saveCustomize = () => {
    //处理保存的数据
    //保存为模板数据到数据库
    //判斷當前保存模板是新增還是修改,如果temp_id存在則爲修改，否則新增
    let oBox = this.customizeZoneRef.current;
    let temp_id = oBox.getAttribute("data-temp_id");
    // editImageArr有数据，说明用户在当前模板自定了区域数据
    if (this.editImageArr.length) {
      let blockData = this.TemplateData.map((item) => {
        return {
          block_id: item.block_id,
          name: item.name,
          ocr_engine: item.ocr_engine,
          block: item.block,
        };
      });
      // 用户原图转换base64
      let imgElem = this.imgElemRef.current;
      let { width, height } = imgElem;
      this.myCanvas.width = width;
      this.myCanvas.height = height;
      this.myCtx.drawImage(imgElem, 0, 0, width, height);
      let imgbase64 = this.myCanvas.toDataURL(this.uploadImgType, 1.0);
      // 模板数据
      let templateData = {
        temp_id: temp_id || uuid(),
        blockItem: blockData,
        image: imgbase64, //用户上传的原图片base64数据
      };
      // 保存templateData到数据库中
      this.setState({
        isSaving: true,
      });
      saveTemplate(
        templateData,
        (res) => {
          //保存成功给出提示
          this.setState({
            isSaving: false,
          });
          let { status, data } = res;
          console.log(res);
          if (status == 200) {
            if (data.data > 0) {
              notification["success"]({
                message: this.props.t("tip-text"),
                description: this.props.t("save-succ"),
              });
            } else if (data.data == -1) {
              //提示已经超过保存模板数量限制，最多保存10个模板，请删除旧再试
              notification["warning"]({
                message: this.props.t("tip-text"),
                description: this.props.t("over_limit"),
              });
            } else {
              //提示保存失败，请尝试重新保存！！！！
              notification["error"]({
                message: this.props.t("tip-text"),
                description: this.props.t("save-fail"),
              });
            }
          }
        },
        (res) => {
          // errmsg: "Invalid login status,Please log in first"
          // errno: 401
          notification["error"]({
            message: this.props.t("tip-text"),
            description: res.errmsg,
          });
          this.setState({
            isSaving: false,
          });
        }
      );
      oBox.setAttribute("data-temp_id", templateData.temp_id);
      // 如果用户当前保存太多模板数据，由于原图base64较大，有可能造成本地缓存不够，需要考虑下是否限制保存的数量
      // 限制保存10个模板，后面如果需要再开启更多
    } else {
      notification["warning"]({
        message: this.props.t("tip-text"),
        description: this.props.t("no-cur-area"),
      });
    }
  };
  /*
   * @name: ,:
   * @msg: 获取对modalForm实例引用
   * @param {*}
   * @return {*}
   */
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };
  /**
   * @name: handleClearArea
   * @msg:清除用户所有自定区域
   * @param {}
   * @return:
   */
  clearArea = () => {
    //清除盒子下新增的子节点
    let oBox = this.customizeZoneRef.current;
    oBox.innerHTML = "";
    this.editImageArr = [];
    this.TemplateData = [];
  };

  render() {
    let { imageUrl, bill_width, bill_height } = this.props;
    let { cusAreaModalVisible } = this.state;
    return (
      <div className="usercustomize_area">
        <img
          ref={this.imgElemRef}
          className="imgElem"
          height={bill_height}
          width={bill_width}
          src={imageUrl}
        />
        <ModalForm
          wrappedComponentRef={this.saveFormRef}
          visible={cusAreaModalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
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
  }
}

export default withTranslation("customizeArea", { withRef: true })(
  CustomizeArea
);
