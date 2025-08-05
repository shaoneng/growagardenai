// /app/components/I18nProvider.jsx
"use client"; // <--- 这是关键！将该组件标记为客户端组件

import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";  // 使用 @ 别名可以更清晰地导入

export default function I18nProvider({ children }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}