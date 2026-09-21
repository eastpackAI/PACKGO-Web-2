/**
 * 把 `next build`（静态导出）产出的 `out/` 打包成可以直接上传的
 * Hugging Face **Static Space** 目录：`hf-space/`。
 *
 * 用法（两步）：
 *   npm run build:static
 *   npm run hf:pack
 *
 * 产出：
 *   hf-space/README.md   ← 带 Hugging Face Space 元信息（sdk: static）
 *   hf-space/index.html  ← 首页
 *   hf-space/_next/**    ← 构建资源
 *   hf-space/hero|products|factory/** ← 图片
 *
 * 注意：`hf-space/` 是**构建产物**，已在 .gitignore 里，不进仓库。
 */

import { cp, mkdir, readFile, writeFile, access, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "out");
const spaceDir = join(root, "hf-space");

if (!existsSync(outDir)) {
  console.error("❌ 找不到 out/。请先运行：npm run build:static");
  process.exit(1);
}
await access(join(outDir, "index.html")).catch(() => {
  console.error("❌ out/index.html 不存在，静态导出似乎没有成功。");
  process.exit(1);
});

// 每次重新生成：先清掉上一次的产物，保证目录内容与本次构建完全一致。
// 安全边界：只允许删除本项目内的 hf-space/。
if (!spaceDir.startsWith(root + "/")) {
  console.error("❌ 安全边界：目标目录不在项目内，已中止。", spaceDir);
  process.exit(1);
}
await rm(spaceDir, { recursive: true, force: true });
await mkdir(spaceDir, { recursive: true });

/**
 * 过滤规则：`public/` 里为了满足工作区「每个目录一份说明」的门禁，
 * 放了若干 `000_本目录说明与索引_GUIDE.md`。这些是**仓库内部文档，不应对外发布**，
 * 因此打包时一律剔除（顺带剔除 macOS 的 .DS_Store）。
 */
const shouldShip = (src) => {
  const name = src.split("/").pop() ?? "";
  if (name === ".DS_Store") return false;
  if (/^000_.*\.md$/.test(name)) return false;
  return true;
};

await cp(outDir, spaceDir, { recursive: true, force: true, filter: shouldShip });

const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const readme = `---
title: PACKGO 网站 2 预览
emoji: 📦
colorFrom: yellow
colorTo: gray
sdk: static
pinned: false
license: other
---

# PACKGO 网站 2 · 内测预览

本 Space 是 **PACKGO 网站 2** 的内测预览静态包，由 \`${pkg.name}\` 构建生成。

- 生成方式：\`npm run build:static\` + \`npm run hf:pack\`
- 内容口径：内测预览版，**尚未对外发布**；页面图片为 AI 生成的占位素材
- 正式事实源不在本站，而在本地 \`AI_WORKSPACE\` 治理台账

重新生成：修改源码后重新运行上面两条命令，再把本目录内容重新上传即可。
`;

await writeFile(join(spaceDir, "README.md"), readme, "utf8");

console.log("✅ 已生成 Hugging Face Space 目录：");
console.log("   ", spaceDir);
console.log("   上传时把该目录里的**全部内容**放到 Space 仓库根目录即可。");
