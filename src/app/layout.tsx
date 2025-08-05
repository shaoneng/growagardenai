// /src/app/layout.tsx (Correct Version)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import I18nProvider from "./components/I18nProvider";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

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