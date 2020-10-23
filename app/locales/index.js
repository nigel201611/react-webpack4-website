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

import zh_CN_modalForm from "@locales/zh_CN/modalForm";
import ja_JP_modalForm from "@locales/ja_JP/modalForm";
import en_US_modalForm from "@locales/en_US/modalForm";

export default {
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
    modalForm: {
      ...zh_CN_modalForm,
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
    modalForm: {
      ...ja_JP_modalForm,
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
    modalForm: {
      ...en_US_modalForm,
    },
  },
};
