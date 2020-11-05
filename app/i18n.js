/*
 * @Author: nigel
 * @Date: 2020-09-17 19:46:51
 * @LastEditTime: 2020-10-26 18:18:44
 */
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import locales from '@locales/index.js';

const resources = locales;
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'zh_CN', // 默认zh_CN
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
