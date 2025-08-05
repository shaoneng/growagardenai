// /src/app/layout.tsx (Correct Version)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import I18nProvider from "./components/I18nProvider";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garden Growth Advisor",
  description: "Your AI-driven mentor for garden games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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