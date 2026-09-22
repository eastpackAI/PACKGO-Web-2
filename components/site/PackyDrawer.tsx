"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { packy, workbench } from "@/content/site";

type Msg = { role: "customer" | "packy" | "note"; text: string };

const STORAGE_KEY = "packgo-packy-thread-v1";
const PIN_KEY = "packgo-packy-pinned-v1";
const seed: Msg[] = [
  { role: "customer", text: packy.sample.customer },
  { role: "packy", text: packy.sample.packy },
];

/** 静态站内的引导式回复：按关键词给下一步建议（真正的 AI 由后端接入后替换这一层）。 */
function guideReply(text: string): string {
  const t = text || "";
  if (/材质|层数|几层/.test(t)) {
    return "材质层数按内容物来定：一般咖啡袋用 PET / 铝箔 / PE 三层就够了；只装干果或茶叶的可以两层；要避光、要长保质期的上三层以上。您这款主要担心的是避光、防潮，还是成本？";
  }
  if (/印刷|几色|专色/.test(t)) {
    return "印刷先定颜色数量：1–4 色用常规印法，4 色以上或要专色（比如品牌金）就走专色或多工艺。您有品牌色号（CMYK 或 Pantone）吗？";
  }
  if (/工艺|烫金|击凸|凹凸|触感|UV|压纹/.test(t)) {
    return "工艺是加分项，先确定要不要：烫金显得贵气、击凸有手感、触感膜摸起来柔、局部 UV 会亮。建议先挑一个主工艺，别一次上太多。您最想突出的是哪一点？";
  }
  if (/亮膜|哑膜|表面处理/.test(t)) {
    return "亮膜更亮更耐用、哑膜更高级更耐指纹。食品袋多数选亮膜，礼盒类多选哑膜。您这次偏货架展示还是送礼场景？";
  }
  if (/数量|起订|多少只|多少个|5000|2000/.test(t)) {
    return "常规起订量是 5,000 个。数量越大单价越低，所以一般会同时算 5,000 / 10,000 / 15,000 / 20,000 几档给你对比。要 2,000 这种低于起订量的，我需要单独问工厂能不能排。您先按哪个量规划？";
  }
  if (/报价|报价单|多少钱|价格|费用/.test(t)) {
    return "报价需要先定三件事：规格尺寸、材料结构、数量。您可以在工作台把这几项选好（每选一个数量档就会生成一条报价记录），我先给一版初步报价看方向，工厂确认成本后再给精准报价。";
  }
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
  const [pinned, setPinned] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const lastNote = useRef<{ text: string; at: number }>({ text: "", at: 0 });

  /** 记一条"客户在看/点了/填了"（置顶时自动记，或由页面显式触发）。10 秒内同样内容不重复记。 */
  const pushNote = useCallback((text: string) => {
    const now = Date.now();
    if (lastNote.current.text === text && now - lastNote.current.at < 10000) return;
    lastNote.current = { text, at: now };
    setMessages((prev) => [...prev, { role: "note", text }]);
  }, []);

  // 打开入口：任何地方 dispatch 一个 packy:open 事件即可
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("packy:open", openHandler);
    return () => window.removeEventListener("packy:open", openHandler);
  }, []);

  // 外部问话：packy:ask 带 {text} —— 页面上的「发送给 Packy」就走这条路
  useEffect(() => {
    const askHandler = (e: Event) => {
      const text = String((e as CustomEvent<{ text?: string }>).detail?.text || "").trim();
      if (!text) return;
      setOpen(true);
      setMessages((prev) => [
        ...prev,
        { role: "customer", text },
        { role: "packy", text: guideReply(text) },
      ]);
    };
    window.addEventListener("packy:ask", askHandler as EventListener);
    return () => window.removeEventListener("packy:ask", askHandler as EventListener);
  }, []);

  // 外部备注：packy:note 带 {text} —— 例如客户选了某个数量档
  useEffect(() => {
    const noteHandler = (e: Event) => {
      const text = String((e as CustomEvent<{ text?: string }>).detail?.text || "").trim();
      if (text) pushNote(text);
    };
    window.addEventListener("packy:note", noteHandler as EventListener);
    return () => window.removeEventListener("packy:note", noteHandler as EventListener);
  }, [pushNote]);

  // 本地保存完整上下文（刷新、换页回来都还在）
  /* eslint-disable react-hooks/set-state-in-effect -- 仅在挂载后执行一次的本地恢复，避免服务端预渲染与浏览器内容不一致（水合不匹配） */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed as Msg[]);
      }
      if (window.localStorage.getItem(PIN_KEY) === "1") setPinned(true);
    } catch {
      /* 读不到就用默认示例 */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* 忽略隐私模式等写入失败 */
    }
  }, [messages]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PIN_KEY, pinned ? "1" : "0");
    } catch {
      /* 忽略 */
    }
  }, [pinned]);

  // 关闭：Esc（置顶时不关，客户还在逛）
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pinned) setOpen(false);
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [pinned]);

  // 点空白处收回（置顶时不收回；点 Packy 自己的按钮也不收回）
  useEffect(() => {
    if (!open || pinned) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".packy-drawer")) return;
      if (target.closest("[data-packy-keep-open]")) return;
      setOpen(false);
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [open, pinned]);

  // 置顶时：客户点过什么
  useEffect(() => {
    if (!open || !pinned) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest(".packy-drawer")) return;
      const el = target.closest("a, button, label, summary") as HTMLElement | null;
      if (!el) return;
      const label = (el.dataset.packyLabel || el.textContent || "").replace(/\s+/g, " ").trim();
      if (!label || label.length > 40) return;
      pushNote(`客户点了：${label}`);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [open, pinned, pushNote]);

  // 置顶时：客户正在看哪一版块
  useEffect(() => {
    if (!open || !pinned) return;
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const id = el.id || "";
          if (!id || seen.has(id)) return;
          seen.add(id);
          const title = (el.querySelector("h2, h1")?.textContent || id).replace(/\s+/g, " ").trim();
          if (!title || title.length > 40) return;
          pushNote(`客户在看：${title}`);
        });
      },
      { threshold: 0.4 },
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [open, pinned, pushNote]);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages]);

  // 打开时给页面让出右手边一条，内容不会被对话栏压住（手机端不挤，见 CSS 断点）
  useEffect(() => {
    document.body.classList.toggle("packy-open", open);
    return () => document.body.classList.remove("packy-open");
  }, [open]);

  if (!open) return null;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((prev) => [...prev, { role: "customer", text }, { role: "packy", text: guideReply(text) }]);
  };

  return (
    <>
      {/* 视觉上的压暗，但不挡点击——客户要能一边开着 Packy、一边继续浏览整个页面 */}
      <div className="packy-drawer__backdrop" aria-hidden />
      <aside
        className={`packy-drawer${pinned ? " packy-drawer--pinned" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label="Packy 对话"
      >
        <div className="packy-drawer__head">
          <span className="packy-demo__dot" aria-hidden />
          <span className="packy-drawer__name">Packy</span>
          <span className="packy-drawer__hint">每轮只说 1～2 件事</span>
          <button
            type="button"
            className={`packy-drawer__pin${pinned ? " is-on" : ""}`}
            aria-pressed={pinned}
            title={workbench.chat.pinHint}
            onClick={() => setPinned((v) => !v)}
          >
            {pinned ? workbench.chat.unpin : workbench.chat.pin}
          </button>
          <button className="packy-drawer__close" onClick={() => setOpen(false)} aria-label="关闭对话">
            关闭
          </button>
        </div>

        {pinned ? <p className="packy-drawer__pinned">{workbench.chat.pinnedNote}</p> : null}

        <div className="packy-drawer__list" ref={listRef}>
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.role}`}
              className={
                m.role === "customer"
                  ? "bubble bubble--customer"
                  : m.role === "note"
                    ? "bubble bubble--note"
                    : "bubble bubble--packy"
              }
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
      data-packy-keep-open
      onClick={() => window.dispatchEvent(new CustomEvent("packy:open"))}
    >
      {label}
    </button>
  );
}

/** 把一个问题直接送进 Packy 对话栏（页面上的「问 Packy」入口都用这个）。 */
export function askPacky(text: string) {
  window.dispatchEvent(new CustomEvent("packy:ask", { detail: { text } }));
}

/** 只记一条观察，不产生回复（例如"客户选了 10,000 档"）。 */
export function noteToPacky(text: string) {
  window.dispatchEvent(new CustomEvent("packy:note", { detail: { text } }));
}
