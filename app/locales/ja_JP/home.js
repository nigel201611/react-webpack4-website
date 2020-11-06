export default {
  ocr_nav: "OCR 識別",
  iot_nav: "IOT 物聯",
  ai_nav: "AI アルゴリズム",
  iot_desc1:
    "ESLの値札は電子値札を使ってリアルタイムで倉庫の在庫を表示します。携帯電話のスキャンコードは在庫を動的に変更します。また、自分でデータを表示することもできます。",
  iot_desc2:
    "温湿度センサーが温湿度の度数を先端の界面に伝えて表示し、リアルタイムで温湿度を測定する…",
  ocr_desc:
    "NRI共通OCRの識別、OCRテンプレート、送り状の識別、郵便番号の識別、T-共通、G-共通OCRの識別",
  ai_desc:
    "AIアルゴリズムの分野では、アルゴリズムエンジニアが異なる業界分野に対して着地して応用する。右側は煙探知監視アルゴリズムとその他の分野で応用されています。",
  cardList: [
    {
      id: 1,
      image: require("@images/home/jpexpress.png"),
      title: "日本語送り状の識別",
      desc:
        "'日本語送り状の識別'日本語送り状の画像をアップロードし、対応する郵便番号、住所、氏名データを識別する",
    },
    // {
    //   id: 2,
    //   image: "../images/home/jppostcode.jpg",
    //   title: "日本語郵便番号の識別",
    //   desc:
    //     "'日本語の郵便番号の識別'は日本語の郵便番号の写真をアップロードし、対応する郵便番号のデータを識別する（印刷と手書きの郵便番号を含む）。",
    // },
    {
      id: 3,
      image: require("@images/home/customTemplate.jpg"),
      title: "自定OCRテンプレート",
      desc:
        "「自定OCRテンプレート」は、所望のテンプレートをカスタマイズし、「OCR実行」で同じフォーマットの画像を選択して、自分の欲しいデータを識別することができます。",
    },
    {
      id: 4,
      image: require("@images/home/executeocr.jpg"),
      title: "OCRを実行",
      desc:
        " 'OCRを実行する'は自分で決めたテンプレートに基づいて、同じテンプレートのフォーマットの画像をアップロードすることを選択し、自分が欲しい画像データを識別する。",
    },
    {
      id: 5,
      image: require("@images/home/tengxunocr.png"),
      title: "T-汎用認識",
      desc:
        "'T-汎用識別'画像をアップロードし、T-汎用エンジンで対応画像データを識別し、印刷、手書き、英語などの文字に対して",
    },
    {
      id: 6,
      image: require("@images/home/ai_algorithorm.png"),
      title: "G-汎用認識",
      desc:
        "'G-汎用識別'画像をアップロードし、G-汎用エンジンで対応画像データを識別し、印刷、手書き、英語などの文字に対して",
    },
  ],
};
