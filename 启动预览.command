#!/bin/zsh
# ============================================================================
# PACKGO 网站 2 · 一键启动本地预览
#
# 双击本文件即可（不需要在终端里敲命令，也不需要 pnpm）。
# 启动后会自动打开浏览器：http://localhost:3100
# 关掉弹出的终端窗口 = 停止服务。
# ============================================================================

set -u
cd "$(dirname "$0")" || exit 1

# 保证能找到 node / npm（Homebrew 与系统默认路径都加上）
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

PORT=3100
URL="http://localhost:${PORT}"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ 找不到 node。请先安装 Node.js（https://nodejs.org）。"
  echo "按回车关闭。"
  read -r _
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "❌ 还没有安装依赖（node_modules 不存在）。"
  echo "请让 Codex 执行一次依赖安装后再试。"
  echo "按回车关闭。"
  read -r _
  exit 1
fi

# 如果已经在运行，直接开浏览器
if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "✅ 网站 2 预览已经在运行：${URL}"
  open "${URL}"
  exit 0
fi

echo "正在启动 PACKGO 网站 2 预览…"
echo "地址：${URL}"
echo "（关掉这个窗口就会停止服务）"
echo

( sleep 4; open "${URL}" ) &
exec npm run dev
