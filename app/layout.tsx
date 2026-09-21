import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PACKGO｜一站式包装定制 — 软包装袋、彩盒、标签、纸袋与无纺布袋",
  description:
    "PACKGO 以龙港包装产业带的真实制造能力为基础，把产品知识、材料工艺、工厂能力、真实报价与生产履约组织成一个入口；Packy 作为客户侧的 AI 包装经理，负责把你的需求变成可报价、可打样、可生产的方案。",
  keywords: ["包装定制", "软包装袋", "彩盒", "标签贴纸", "无纺布袋", "包装报价", "PACKGO"],
  robots: { index: false, follow: false },
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
