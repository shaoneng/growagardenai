// /src/app/layout.tsx (Correct Version)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // <-- 1. 导入 Next.js 的 Script 组件
import "./globals.css";
import I18nProvider from "./components/I18nProvider";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });
// 替换为你的 GTM ID
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
    <html lang="en">
      <head>
      {/* Google Tag Manager */}
        {/* 2. 将 GTM 的 <script> 部分添加到 <head> */}
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
        {/* 将结构化数据添加到 head 中 */}
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
      <body className={inter.className}>
        <I18nProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}