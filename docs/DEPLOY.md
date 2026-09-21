# PACKGO 网站 2 · 部署说明（Hostinger / 任意 Node 托管）

> 建立日期：2026-09-21
> 目标：**部署一次就长期用，以后改代码不再搬迁**。

## 一、两种托管形态，先分清

| 形态 | 跑的是什么 | 能做什么 | 适合 |
|---|---|---|---|
| **Node.js Web App**（Hostinger 的 Web App 部署） | 真正的 Next.js 服务端（`next start`） | 静态页 + 以后的服务端能力（表单接收、Packy 对话、订单查询等） | ✅ **我们选这条** |
| **静态托管**（把 `out/` 丢上去） | 只有 HTML/CSS/JS 文件 | 只能展示 | 临时看效果 |

⚠️ 关键前提：Hostinger 官方 FAQ 写明 **只有 Cloud 计划与共享 Business 计划支持 Node.js**。
低于这两档（例如 Premium）**没有 Node.js 能力**，只能走静态托管。

## 二、目标结构（一次接好，以后不搬）

```text
本地 PACKGO-Web-2（Codex 在这里改代码）
        │  git push
        ▼
GitHub 私有仓库（版本管理 + 变更留痕）
        │  Hostinger 连接 GitHub
        ▼
Hostinger Node.js Web App（自动重新部署）
        │
        ▼
子域名（建议 web2.eastpacksolutions.com）或 Hostinger 临时域名
```

**为什么用子域名**：`eastpacksolutions.com` 主域名上现在有一个在建的 WordPress，
用子域名可以**完全不碰它**，也不动主域名的解析记录（只新增一条子域记录）。

## 三、工程已经为托管做好准备

| 项 | 状态 |
|---|---|
| 启动端口 | `npm start` 已改为读环境变量 `PORT`（默认 3100）——托管平台给什么端口就用什么端口，不用改代码 |
| 构建 | `npm run build`（标准 Next 构建）；Hostinger 的 Node 应用一般就是 `npm install && npm run build && npm start` |
| 静态导出（备选） | `npm run build:static`（产出 `out/`，给纯静态托管或 Hugging Face 预览用） |
| 依赖管理 | 本机终端没有 pnpm；部署时让平台用 **npm** 安装即可（`package.json` 兼容两者） |

## 四、部署前必须先确认的三件事

1. **套餐档位**：hPanel 里的套餐是不是 Cloud 或 Business（不是的话没有 Node.js）；
2. **域名方案**：新建子域名（如 `web2.eastpacksolutions.com`），不要覆盖主域名上的 WordPress；
3. **授权**：这一步是**公网发布**，需要 Owner 明确授权后才执行（当前系统状态：未授权）。

## 五、明确不做的事

1. 不修改 `eastpacksolutions.com` 主域名的 DNS 与现有 WordPress；
2. 不动 Hostinger 账单、套餐与账号设置；
3. 不在本机服务上开放公网端口（本机预览仍只监听回环）。
