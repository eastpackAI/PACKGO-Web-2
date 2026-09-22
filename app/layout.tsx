import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PACKGO｜一站式包装定制 — 软包装袋、彩盒、标签、纸袋与无纺布袋",
  description:
    "PACKGO 一站式包装定制：软包装袋、彩盒、标签贴纸、纸袋与无纺布袋。立足龙港包装产业带、直接对接真实工厂——从需求确认、结构建议、打样确认到量产交付，一位专属包装经理跟到底：报价有依据、进度看得见、复购更省事。",
  keywords: ["包装定制", "软包装袋", "彩盒", "标签贴纸", "无纺布袋", "包装报价", "PACKGO"],
  // 2026-09-22：原先为"内测不对外"设为 noindex,nofollow；经诊断确认它会**直接导致云端
  // 抓取器（含 ChatGPT 的读取）拒绝使用本页**，是"Cloud ChatGPT 读不到网站"的首要原因。
  // 现改为可索引：页面内容可被抓取与引用；是否被搜索引擎收录由搜索方决定。
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
