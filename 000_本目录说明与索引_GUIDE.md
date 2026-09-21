# PACKGO-Web-2｜本目录说明与索引

> 建立日期：2026-09-21
> 定位：**PACKGO 网站 2 —— 全新独立前端工程**。

## 一、这是什么

网站 2 是**从零新建**的 PACKGO 官网工程，与 `PACKGO-Web`（网站 1）**完全独立**：

| | PACKGO-Web（网站 1） | PACKGO-Web-2（网站 2 · 本目录） |
|---|---|---|
| 定位 | Spatial / Packy AI 实验与空间智能网站 | 面向客户的正式官网方向（参考 Cubit Packaging 的版式逻辑） |
| 状态 | **保持原样，本轮零修改** | 本轮施工对象 |
| 代码关系 | —— | **不共用**：独立 package.json、独立 node_modules、独立组件、独立样式 |

两个工程**当前不合并**。是否合并、是否共用后端/数据层/Packy，由 Owner 后续单独决定。

## 二、技术栈与端口

- Next.js 16.3.5（App Router）· React 19.3.0 · TypeScript 6.0.3
- 包管理：pnpm 11.19.0（独立 `pnpm-lock.yaml`）
- 开发/预览端口：**3100**（网站 1 用的是别的端口，两者不冲突）

## 三、目录结构

```text
PACKGO-Web-2/
├── 000_本目录说明与索引_GUIDE.md   ← 本文件
├── README.md                        ← 快速上手
├── app/
│   ├── layout.tsx                   ← 根布局与站点元信息
│   ├── page.tsx                     ← 首页（装配各版块）
│   └── globals.css                  ← 全站样式（本工程自己的，不引用网站 1）
├── components/site/                 ← 网站 2 自己的组件
│   ├── Section.tsx                  ← 统一版块容器（眉标 + 标题 + 说明）
│   ├── Header.tsx                   ← 页头（含移动端菜单）
│   ├── Hero.tsx                     ← 首屏
│   ├── FormatGrid.tsx               ← 主要包装形态 + 能力条
│   ├── PackySection.tsx             ← Packy 专区（对应竞品 AI 顾问版块）
│   ├── ManufacturingSection.tsx     ← 真实制造与材料
│   ├── PlatformSection.tsx          ← 平台七个环节
│   ├── IndustrySolutions.tsx        ← 行业展厅 + 通用包装展厅
│   ├── CategoryGrid.tsx             ← 产品品类网格
│   ├── AboutSection.tsx             ← 关于 PACKGO
│   └── Footer.tsx                   ← 页脚
├── content/site.ts                  ← **唯一内容来源**（品牌、导航、各版块文案）
├── scripts/pack-hf-space.mjs        ← 把静态导出打包成 Hugging Face Space 目录
├── 启动预览.command                  ← 一键启动本地预览（双击即可，不需要 pnpm）
├── AGENTS.md / CLAUDE.md            ← **Next.js 16 自动生成**的 AI 协作说明（`next dev` 会重新写回，
│                                       官方建议随代码一起提交以保持工作树干净；内容与工作区根 AGENTS.md 不冲突）
└── public/                          ← 静态资源（现有 6 张 AI 占位素材，见该目录 Guide）
```

## 四、写作与内容规则

1. **文案只在 `content/site.ts` 里改**；组件只读内容层，不在组件里散写文案。
2. **不编造能力**：未建成的部分必须标注「逐步开放 / 内测」，不得写成已具备。
3. **不直接复制网站 1 的前端结构**；页面结构、组件系统与视觉层在本工程内重建。
4. 网站 1 只作为**内容与品牌来源**（品牌信息、已确认业务分类、Packy 产品思想、已确认文案）。

## 五、常用命令

**推荐**：在访达里双击 **`启动预览.command`**（自动启动 + 自动开浏览器，不需要 pnpm）。

```bash
cd PACKGO-Web-2
npm run dev       # 开发预览 → http://localhost:3100（本机终端没有 pnpm，用 npm）
npm run lint      # 代码检查
npm run typecheck # 类型检查
npm run build     # 生产构建
npm run build:static  # 静态导出 → out/（给 Hugging Face 等静态托管用）
npm run hf:pack       # 把 out/ 打包 → hf-space/（可直接上传的 Space 目录）
```

> **依赖管理**：依赖由 pnpm 安装（`node_modules` 现成），但**用 npm 只跑脚本、不要用 npm 装依赖**；
> 增删依赖交给 Codex（它那边有 pnpm）。本机终端没有 pnpm 是正常的。

## 六、与网站 1 的硬边界

- **禁止**修改 `PACKGO-Web` 的任何文件（代码、组件、CSS、路由、配置、依赖、页面、Packy 组件）。
- 任何验收都必须报告：**原 PACKGO-Web 本轮修改文件数量 = 0**。
- 校验方法：对 `PACKGO-Web`（排除 `node_modules` / `.next` / `.git` / `*.tsbuildinfo`）生成 sha256 指纹清单，施工前后逐行比对必须完全一致。

## 七、当前状态（2026-09-21）

| 项 | 状态 |
|---|---|
| 工程创建 | ✅ 独立工程已建立 |
| 首页 | ✅ 八个版块已落地（首屏 / 形态 / Packy / 制造 / 平台 / 行业展厅 / 品类 / 关于） |
| 页面配图 | ✅ 6 张 AI 生成占位素材已接入（首屏 / 四张形态卡 / 制造版块），页面均标注「待真实拍摄替换」 |
| lint / typecheck / build | ✅ 全部通过 |
| 本地预览 | ✅ `127.0.0.1:3100` 返回 200；并提供**一键启动** `启动预览.command` |
| 静态导出 / 外部预览包 | ✅ `npm run build:static` + `npm run hf:pack` 已跑通：纯静态（无 Next 运行时）自检 HTTP 200、图片与 CSS/JS 全部 200；产物为 `hf-space/`（30 个文件，2.8MB，已剔除内部说明文件） |
| 公网预览 | ⛔ **未发布**：托管到 Hugging Face Space 需 Owner 在网页端创建 Space 并上传 `hf-space/`（或提供写入凭证由本机推送）。本地服务仍只监听回环，未对外暴露 |
| 真实素材 | ⛔ 仍缺（现有为 AI 占位；真实产品照、工厂影像待拍） |
| 后续页面 | ⛔ 未建（行业厅详情、品类详情、Packy 真实接入等在后续阶段） |
