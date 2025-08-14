// /src/app/layout.tsx
import type { Metadata } from "next";
// 1. 引入 Google Fonts
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import I18nProvider from "./components/layout/I18nProvider";
import { AppProvider } from "@/context/AppContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { ToastProvider } from "./components/layout/ToastProvider";
import GlobalNavigation from "./components/layout/GlobalNavigation";

// 2. 配置字体 - 使用更兼容的字体
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const GTM_ID = 'GTM-K6Z5MPFM';

export const metadata: Metadata = {
  title: "Grow a Garden AI Advisor | Your Ultimate Strategy Tool",
  description: "Get expert strategy for Grow a Garden with our AI advisor. Optimize your crops, maximize profit, and get a personalized growth blueprint. Try the Grow a Garden AI now!",
};

// Cloudflare Pages: unify Edge runtime and dynamic rendering at root to avoid duplicated identifiers
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. 将字体变量应用到html标签
    <html lang="zh-CN" className={`${inter.variable}`}>
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
      {/* 4. body 使用Inter字体作为基础 */}
      <body className="font-sans">
        <I18nProvider>
          <AppProvider>
            <OnboardingProvider>
              <FavoritesProvider>
                <ToastProvider>
                  <GlobalNavigation />
                  {children}
                </ToastProvider>
              </FavoritesProvider>
            </OnboardingProvider>
          </AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
