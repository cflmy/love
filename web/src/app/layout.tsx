import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const chinese = Noto_Serif_SC({
  variable: "--font-serif-chinese",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "QDQC · 鹊渡情长",
  description:
    "Que dure, que câlin. Quiet days, quiet cuddles. 相逢鹊渡，相守情长。",
  applicationName: "QDQC",
};

export const viewport: Viewport = {
  themeColor: "#050810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${display.variable} ${chinese.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
