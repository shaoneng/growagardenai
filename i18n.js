// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    // 我们将把翻译文件放在 public/locales 目录下
    // 这样Next.js可以像处理静态文件一样处理它们
    // lng: 'en' // 如果你想强制使用某种语言，可以取消注释
    fallbackLng: 'en', // 如果检测到的语言不可用，则使用英语
    debug: process.env.NODE_ENV === 'development', // 只在开发模式下开启debug

    interpolation: {
      escapeValue: false, // React已经可以防范XSS
    },
    
    // 定义默认的 "namespace"，通常一个功能模块一个文件
    ns: ['common'],
    defaultNS: 'common',

    resources: {
      // 在这里直接定义初始的英文资源
      // 稍后我们也会展示如何从JSON文件中加载
      en: {
        common: {
          // 下一步我们将填充这个对象
        }
      }
    }
  });

export default i18n;