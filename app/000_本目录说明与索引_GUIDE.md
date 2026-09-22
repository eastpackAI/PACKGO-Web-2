# app/｜本目录说明与索引

Next.js App Router 目录（网站 2 自己的，不引用网站 1）。

| 文件 | 职责 |
|---|---|
| `layout.tsx` | 根布局：`<html lang="zh-CN">`、站点元信息（title / description / keywords）、引入全站样式；**2026-09-22 起 `robots: index/follow = true`** —— 原先的 `noindex,nofollow` 会被云端抓取器（含 ChatGPT 读取）当作"不要使用本页"，是"云端读不到网站"的首要原因，故改为可索引 |
| `page.tsx` | **首页**：按顺序装配各版块（首屏 → 形态 → Packy → 制造 → 平台 → 行业展厅 → 品类 → 关于） |
| `globals.css` | 全站样式：设计令牌、版块节奏、栅格、卡片、响应式；**本工程自己的样式表** |

规则：本目录只做「页面装配与布局」，不写业务文案；文案一律来自 `content/site.ts`。
新增页面时，先在本 Guide 登记，再新建文件。
