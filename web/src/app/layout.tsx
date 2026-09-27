import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Serif_SC } from "next/font/google";
import { StoryChrome } from "@/components/ui/StoryChrome";
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
  title: {
    default: "QDQC · 鹊渡情长",
    template: "%s · QDQC",
  },
  description:
    "Que dure, que câlin. Quiet days, quiet cuddles. 相逢鹊渡，相守情长。一张 NFC 卡打开的数字爱情画册。",
  applicationName: "QDQC",
  keywords: ["QDQC", "鹊渡情长", "More Days Together", "NFC", "love story"],
  authors: [{ name: "QDQC" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "QDQC",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "QDQC · 鹊渡情长",
    description: "相逢鹊渡，相守情长。Quiet days, quiet cuddles.",
    type: "website",
    locale: "zh_CN",
    siteName: "QDQC",
  },
  twitter: {
    card: "summary_large_image",
    title: "QDQC · 鹊渡情长",
    description: "Que dure, que câlin. More Days Together.",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${display.variable} ${chinese.variable} antialiased`}>
        <StoryChrome>{children}</StoryChrome>
      </body>
    </html>
  );
}
