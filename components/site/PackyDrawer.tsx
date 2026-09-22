"use client";

import { useEffect, useRef, useState } from "react";
import { packy } from "@/content/site";

type Msg = { role: "customer" | "packy"; text: string };

const STORAGE_KEY = "packgo-packy-thread-v1";
const seed: Msg[] = [
  { role: "customer", text: packy.sample.customer },
  { role: "packy", text: packy.sample.packy },
];

/** 静态站内的引导式回复：按关键词给下一步建议（真正的 AI 由后端接入后替换这一层）。 */
function guideReply(text: string): string {
  const t = text || "";
  if (/咖啡/.test(t)) {
    return "收到，咖啡包装我们有专项展厅：可以先看包装袋（自立袋 / 平底袋 / 八边封）与外盒、标签、手提配套。请问这次是保持原方案，还是想优化结构或换材料？";
  }
  if (/食品|零食|饼干|茶叶|干果/.test(t)) {
    return "食品类优先看保护与合规：先确认阻隔要求（避光 / 防潮 / 保鲜）、封口方式与外盒信息位。请问内容物的克重或规格大概是多少？";
  }
  if (/化妆品|护肤|精华|面膜/.test(t)) {
    return "化妆品更看重货架呈现与手感：先定盒型与表面工艺（烫金 / 压纹 / 触感膜），再配瓶标或贴纸。请问主打线上还是线下货架？";
  }
  if (/无纺布|纸袋|手提袋/.test(t)) {
    return "配套袋类可以和主包装一起做：无纺布袋、纸袋、手提袋都能成套。请问大概要多少只、什么尺寸？";
  }
  if (/报价|报价单|多少钱|价格|费用/.test(t)) {
    return "报价需要先定三件事：规格尺寸、材料结构、数量。您可以先把这三项发我，我先给一版初步报价看方向，工厂确认成本后再给精准报价。";
  }
  if (/打样|样品/.test(t)) {
    return "打样前我们会把规格、刀版、材料逐项确认，确认后再出样品；样品确认后才进入量产。请问您希望先做结构样还是成品样？";
  }
  if (/交期|多久|时间/.test(t)) {
    return "交期要等排期确认后才能承诺。一般来说样品确认 + 材料到位后才开始排产；您方便告诉我希望的到货时间吗？";
  }
  return "明白了。为了少来回，我先确认一件事：这次主要想解决**保护性能**、**货架呈现**，还是**成本**？选一个方向，我就带您往下看。";
}

export function PackyDrawer() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  // 打开入口：任何地方 dispatch 一个 packy:open 事件即可
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("packy:open", openHandler);
    return () => window.removeEventListener("packy:open", openHandler);
  }, []);

  // 本地保存完整上下文（刷新、换页回来都还在）
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        // 首次挂载后再从 localStorage 恢复，避免服务端预渲染与浏览器内容不一致（水合不匹配）。
        // eslint-disable-next-line react-hooks/set-state-in-effect -- 仅在挂载后执行一次的本地恢复
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed as Msg[]);
      }
    } catch {
      /* 读不到就用默认示例 */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* 忽略隐私模式等写入失败 */
    }
  }, [messages]);

  // 关闭：Esc
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages]);

  if (!open) return null;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((prev) => [...prev, { role: "customer", text }, { role: "packy", text: guideReply(text) }]);
  };

  return (
    <>
      {/* 点空白处自动收回 */}
      <div className="packy-drawer__backdrop" onClick={() => setOpen(false)} aria-hidden />
      <aside className="packy-drawer" role="dialog" aria-modal="false" aria-label="Packy 对话">
        <div className="packy-drawer__head">
          <span className="packy-demo__dot" aria-hidden />
          <span className="packy-drawer__name">Packy</span>
          <span className="packy-drawer__hint">每轮只说 1～2 件事</span>
          <button className="packy-drawer__close" onClick={() => setOpen(false)} aria-label="关闭对话">
            关闭
          </button>
        </div>

        <div className="packy-drawer__list" ref={listRef}>
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.role}`}
              className={m.role === "customer" ? "bubble bubble--customer" : "bubble bubble--packy"}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="packy-drawer__foot">
          <input
            className="packy-drawer__input"
            value={draft}
            placeholder="说说您要做的包装…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className="packy-drawer__send" onClick={send}>
            发送
          </button>
        </div>
        <p className="packy-drawer__note">
          对话会保留在您的浏览器里（刷新不丢）。需要人工确认细节时，我们会转给专属包装经理。
        </p>
      </aside>
    </>
  );
}

/** 打开 Packy 对话栏的按钮（任何地方可用，不再跳转页面）。 */
export function PackyOpenButton({
  label,
  className = "btn btn--primary",
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("packy:open"))}
    >
      {label}
    </button>
  );
}
