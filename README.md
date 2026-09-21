# PACKGO-Web-2

PACKGO 网站 2 —— 全新独立前端工程（Cubit Packaging 风格方向）。

与 `../PACKGO-Web`（网站 1）**完全独立**：独立依赖、独立组件、独立样式、独立端口（3100）。

## 快速开始

**最简单的方式**：在访达里双击 **`启动预览.command`** —— 会自动启动服务并打开浏览器
（`http://localhost:3100`）。关掉弹出的终端窗口即停止服务。

**命令行方式**（本机终端没有 pnpm，用 npm 即可）：

```bash
cd /Users/zaiyanmiu/AI_WORKSPACE/PACKGO-Web-2
npm run dev      # → http://localhost:3100
```

> 依赖已由 pnpm 安装完成（`node_modules` 现成）。
> 注意：**用 npm 只跑脚本，不要用 npm 装依赖**（会把 pnpm 的依赖结构改掉）。
> 需要增删依赖时交给 Codex 处理。

## 校验

```bash
npm run lint && npm run typecheck && npm run build
```

## 在线预览（云地审核通道）

**固定预览网址：** https://eastpackai.github.io/PACKGO-Web-2/

这个网址给 Owner 和云端 ChatGPT 用来审核当前版本，**不需要本机开着服务**。

链路（已跑通）：本地改代码 → `npm run lint && npm run typecheck && npm run build`
→ `git commit` → `git push origin develop` → GitHub Actions 自动构建（含静态导出）
→ 自动发布到 GitHub Pages → 网址自动更新。

| 项 | 值 |
|---|---|
| 代码仓库 | https://github.com/eastpackAI/PACKGO-Web-2 （**公开**；免费套餐下私有仓库不能用 Pages） |
| 分支 | `main` = 正式基线；`develop` = 预览（自动发布监听此分支） |
| 本地手动生成预览包 | `STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/PACKGO-Web-2 npm run build:static` |

> 说明：Pages 项目站点部署在子路径 `/<仓库名>/` 下，所以静态导出必须带 `NEXT_PUBLIC_BASE_PATH`；
> CI 里已自动传入。CI 还带一道防呆门禁：导出后校验资源地址带前缀，不带就让发布失败，**不要删**。

**备用方案**：打包成 Hugging Face Static Space（`npm run build:static` + `npm run hf:pack` → `hf-space/`）。
当前首选 GitHub Pages，这条只在需要时用。

发布与排障的完整步骤见技能 `packgo-web-publish`（`~/.codex/skills/packgo-web-publish/SKILL.md`）。

## 内容在哪

首页所有文案在 `content/site.ts`；组件只负责版式，不散写文案。

首页图片目前是 **AI 生成的占位素材**（`public/hero`、`public/products`、`public/factory`），
待真实拍摄素材到位后替换；替换只改 `content/site.ts` 里的路径，不动组件。

详见 `000_本目录说明与索引_GUIDE.md`。
