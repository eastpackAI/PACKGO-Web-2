# .github/｜本目录说明与索引

GitHub 平台配置目录（平台自动读取，本地不需要运行）。

| 路径 | 用途 |
|---|---|
| `workflows/deploy-pages.yml` | **预览通道**：向 `develop` 推送时自动 lint → typecheck → 静态导出 → 发布到 GitHub Pages，产出固定公网预览网址 |

规则：

1. 本目录只放 GitHub 平台配置，不放业务代码；
2. 改 workflow 等于改发布通道，改完要看 Actions 页面的运行结果；
3. 这里不放任何密钥——需要密钥时用仓库 Secrets。
