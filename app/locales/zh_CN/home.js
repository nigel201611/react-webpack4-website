export default {
  ocr_nav: "OCR 识别",
  iot_nav: "IOT 物联",
  ai_nav: "AI 算法领域",
  iot_desc1:
    "ESL价签使用电子价签实时显示仓库库存，手机扫码动态更改库存，也可自定显示数据。",
  iot_desc2:
    "温湿度传感器将温湿度数据传到前端界面显示，实时对温湿度进行检测...",
  ocr_desc:
    "NRI通用OCR识别，自定OCR模板，运单识别，邮编识别，T-通用，G-通用OCR识别",
  ai_desc:
    "算法领域，算法工程师针对不同行业领域应用落地。右边是烟雾探测监控算法，以及更多其他领域应用",
  cardList: [
    {
      id: 1,
      image: require("@images/home/jpexpress.png"),
      title: "日文运单识别",
      desc: "'日文运单识别'上传日文运单图片，识别对应邮编、地址、姓名数据",
    },
    // {
    //   id: 2,
    //   image: "../images/home/jppostcode.jpg",
    //   title: "日文邮编识别",
    //   desc:
    //     "'日文邮编识别'上传一张日文邮编图片，识别对应邮编数据（包括印刷和手写邮编）",
    // },
    {
      id: 3,
      image: require("@images/home/executeocr.jpg"),
      title: "执行OCR",
      desc:
        " '执行OCR'根据自定好的模板，选择上传同样模板格式图片，识别得到自己想要的图片数据",
    },
    {
      id: 4,
      image: require("@images/home/customTemplate.jpg"),
      title: "自定OCR模板",
      desc:
        "'自定OCR模板'可定制想要的模板，并在'执行OCR'中选择同样格式图片，识别得到自己想要的数据",
    },
    {
      id: 5,
      image: require("@images/home/tengxunocr.png"),
      title: "T-通用识别",
      desc:
        "'T-通用识别'上传图片，使用T-通用引擎识别对应图片数据，针对印刷，手写，英文等字符",
    },
    {
      id: 6,
      image: require("@images/home/ai_algorithorm.png"),
      title: "G-通用识别",
      desc:
        "'G-通用识别'上传图片，使用G-通用引擎识别对应图片数据，针对印刷，手写，英文等字符",
    },
  ],
};
