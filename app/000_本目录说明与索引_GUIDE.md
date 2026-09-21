# app/｜本目录说明与索引

Next.js App Router 目录（网站 2 自己的，不引用网站 1）。

| 文件 | 职责 |
|---|---|
| `layout.tsx` | 根布局：`<html lang="zh-CN">`、站点元信息（title / description / keywords）、引入全站样式；当前设为 `robots: noindex`（内测不对外） |
| `page.tsx` | **首页**：按顺序装配各版块（首屏 → 形态 → Packy → 制造 → 平台 → 行业展厅 → 品类 → 关于） |
| `globals.css` | 全站样式：设计令牌、版块节奏、栅格、卡片、响应式；**本工程自己的样式表** |

规则：本目录只做「页面装配与布局」，不写业务文案；文案一律来自 `content/site.ts`。
新增页面时，先在本 Guide 登记，再新建文件。
