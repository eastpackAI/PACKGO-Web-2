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

## 对外预览包（Hugging Face Space）

本地 `localhost:3100` 只有本机能看，云端 AI 打不开。要让别人（或云端 GPT）看到效果，
可以打包成一个**静态预览包**上传到 Hugging Face 的 Static Space：

```bash
npm run build:static   # 静态导出 → out/
npm run hf:pack        # 打包 → hf-space/（含 Space 用的 README.md）
```

然后把 `hf-space/` 里的**全部内容**上传到 Space 仓库根目录即可（详见该目录里的 README）。
`hf-space/` 是构建产物，不进仓库；源码改了重新跑上面两条命令即可。

## 内容在哪

首页所有文案在 `content/site.ts`；组件只负责版式，不散写文案。

首页图片目前是 **AI 生成的占位素材**（`public/hero`、`public/products`、`public/factory`），
待真实拍摄素材到位后替换；替换只改 `content/site.ts` 里的路径，不动组件。

详见 `000_本目录说明与索引_GUIDE.md`。
