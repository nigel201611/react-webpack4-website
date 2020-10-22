//i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh_CN_home from "@locales/zh_CN/home";
import ja_JP_home from "@locales/ja_JP/home";
import en_US_home from "@locales/en_US/home";

import zh_CN_header from "@locales/zh_CN/header";
import ja_JP_header from "@locales/ja_JP/header";
import en_US_header from "@locales/en_US/header";

import zh_CN_login from "@locales/zh_CN/login";
import ja_JP_login from "@locales/ja_JP/login";
import en_US_login from "@locales/en_US/login";

import zh_CN_customizeArea from "@locales/zh_CN/customizeArea";
import ja_JP_customizeArea from "@locales/ja_JP/customizeArea";
import en_US_customizeArea from "@locales/en_US/customizeArea";

const resources = {
  zh_CN: {
    home: {
      ...zh_CN_home, //主页中文信息
    },
    header: {
      ...zh_CN_header,
    },
    login: {
      ...zh_CN_login,
    },
    customizeArea: {
      ...zh_CN_customizeArea,
    },
  },
  ja_JP: {
    home: {
      ...ja_JP_home,
    },
    header: {
      ...ja_JP_header,
    },
    login: {
      ...ja_JP_login,
    },
    customizeArea: {
      ...ja_JP_customizeArea,
    },
  },
  en_US: {
    home: {
      ...en_US_home,
    },
    header: {
      ...en_US_header,
    },
    login: {
      ...en_US_login,
    },
    customizeArea: {
      ...en_US_customizeArea,
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "zh_CN", //默认zh_CN
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
