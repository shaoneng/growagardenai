// /i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // 开发环境开启 debug
    
    ns: ['common'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false, // React 已经可以防范 XSS
    },
    backend: {
      // 翻译文件的路径
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;