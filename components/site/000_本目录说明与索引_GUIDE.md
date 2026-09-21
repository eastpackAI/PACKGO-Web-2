# components/site/｜本目录说明与索引

官网版块组件。每个文件对应首页的一个版块，顺序与 `app/page.tsx` 一致。

| 文件 | 对应版块 |
|---|---|
| `Section.tsx` | 统一版块容器（眉标 + 标题 + 一句话说明 + 内容）——全站版式一致性的基础 |
| `Header.tsx` | 页头：品牌字标、主导航、右侧 CTA、移动端菜单（唯一的客户端组件） |
| `Hero.tsx` | 首屏：定位 H1、支撑段、双 CTA、能力条 |
| `FormatGrid.tsx` | 主要包装形态四宫格 + 三项能力条 |
| `PackySection.tsx` | Packy 专区：能力点、三类客户路线、对话示例 |
| `ManufacturingSection.tsx` | 真实制造与材料：材料结构 / 工艺设备 / 真实影像 / 质检证据 |
| `PlatformSection.tsx` | 平台七个环节（深色版块） |
| `IndustrySolutions.tsx` | 行业解决方案展厅 + 通用包装展厅 |
| `CategoryGrid.tsx` | 产品品类网格 |
| `AboutSection.tsx` | 关于 PACKGO：两段说明 + 三个事实 |
| `Footer.tsx` | 页脚：品牌、四列链接、内测说明、版权行 |

规则：组件为服务端组件（`Header.tsx` 除外，它需要交互状态）；不在这里写业务文案。
