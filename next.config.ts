import type { NextConfig } from "next";

/**
 * 静态导出开关（用于 Hugging Face / 任意静态托管的「预览包」）。
 *
 * - 平时 `npm run dev` 与 `npm run build` **完全不受影响**（走正常 Next 构建）；
 * - 只有 `npm run build:static`（内部设置 STATIC_EXPORT=1）才会走静态导出，
 *   把整站输出到 `out/`，再用 `npm run hf:pack` 打成 Hugging Face Space 目录。
 *
 * 静态导出时 `next/image` 必须关闭优化（unoptimized），因为出口没有 Node 进程。
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
