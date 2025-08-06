// /src/app/layout.tsx
import type { Metadata } from "next";
// 1. 引入 Google Fonts
import { Noto_Serif_SC, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import I18nProvider from "./components/I18nProvider";
import { AppProvider } from "@/context/AppContext";

// 2. 配置字体
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-noto-serif-sc", // 创建CSS变量
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins", // 创建CSS变量
});

const GTM_ID = 'GTM-K6Z5MPFM';

export const metadata: Metadata = {
  title: "Grow a Garden AI Advisor | Your Ultimate Strategy Tool",
  description: "Get expert strategy for Grow a Garden with our AI advisor. Optimize your crops, maximize profit, and get a personalized growth blueprint. Try the Grow a Garden AI now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. 将字体变量应用到html标签
    <html lang="zh-CN" className={`${notoSerifSC.variable} ${poppins.variable}`}>
      <head>
        {/* Font Awesome CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        {/* End Google Tag Manager */}    
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Garden Growth Advisor",
            "description": "An AI-powered strategy tool and advisor for the game 'Grow a Garden', helping players optimize their crops and gold.",
            "applicationCategory": "GameApplication",
            "operatingSystem": "Any (Web)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "keywords": "grow a garden ai, ai garden advisor, garden planning ai, ai farming game helper"
          })}}
        />
      </head>
      {/* 4. body 使用中文字体作为基础 */}
      <body className="font-chinese">
        <I18nProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}