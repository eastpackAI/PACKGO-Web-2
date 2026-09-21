# scripts/｜本目录说明与索引

构建与打包脚本（供 `package.json` 的 npm scripts 调用）。

| 文件 | 用途 |
|---|---|
| `pack-hf-space.mjs` | 把静态导出产物 `out/` 打包成可上传的 **Hugging Face Static Space** 目录 `hf-space/`；同时生成带 Space 元信息（`sdk: static`）的 `README.md` |

## 相关命令

```bash
npm run build:static   # 静态导出（设 STATIC_EXPORT=1）→ 产出 out/
npm run hf:pack        # 把 out/ 打包成 hf-space/
```

## 安全与边界

1. `hf-space/` 是**构建产物**，已在 `.gitignore`，不进仓库；
2. 打包前会**先清空 `hf-space/`**（脚本内已加边界校验：目标目录必须在项目内，否则中止）；
3. 打包时会**剔除** `public/` 下为了满足工作区目录门禁而放的 `000_本目录说明与索引_GUIDE.md`
   —— 这些是仓库内部文档，不应对外发布；
4. 本目录的脚本**不改动源码**，只做读取与输出。
