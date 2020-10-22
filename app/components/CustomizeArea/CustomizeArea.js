/*
 * @Author: nigel
 * @Date: 2020-09-14 10:59:58
 * @LastEditTime: ,: 2020-10-22 16:34:40
 */
import React, { Component } from "react";
import { ModalForm } from "@components/ModalForm/ModalForm";
import "./CustomizeArea.less";
export default class CustomizeArea extends Component {
  constructor(props) {
    super(props);
    this.customizeZoneRef = React.createRef();
    this.state = {
      cusAreaModalVisible: false,
    };
  }

  componentDidMount() {
    this.origin = {
      x: 0,
      y: 0,
    }; //鼠标刚开始按下的点
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
    this.addEditableFunc();
  }

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
      console.log("Received values of form: ", values);

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
    return canvas.toDataURL("image/jpeg", 1.0);
  };

  getUserInputData = () => {
    let pointsInfo = this.curPoints;
    let imageData = this.getImageByPointsInfo(pointsInfo);
    let blockItem = {
      block_id: this.uuid(),
      name: this.customBlockForm.name,
      ocr_engine: this.customBlockForm.OCR_engine,
      block: pointsInfo,
      image: imageData, //保存到数据库或者本地，不需要保存这个字段数据
    };
    this.curDiv.setAttribute("id", blockItem.block_id);
    this.changeCurDivBg(this.curDiv, this.customBlockForm.OCR_engine);
    this.TemplateData.push(blockItem);
    this.editImageArr.push(pointsInfo);
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

  render() {
    let { imageUrl, bill_width, bill_height } = this.props;
    let { cusAreaModalVisible } = this.state;
    return (
      <div className="usercustomize_area">
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
