"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { workbench } from "@/content/site";
import { Section } from "./Section";
import { PackyOpenButton, askPacky, noteToPacky } from "./PackyDrawer";

type Note = { at: string; text: string };
type Quote = { qty: number; at: string };

type Project = {
  id: string;
  name: string;
  company: string;
  email: string;
  kind: string;
  useCase: string;
  dueAt: string;
  layers: string;
  printing: string;
  finishes: string[];
  lamination: string;
  note: string;
  quotes: Quote[];
  createdAt: string;
  notes: Note[];
};

type Artwork = { id: string; name: string; size: number; at: string; dataUrl?: string };

const STORE_KEY = "packgo-workbench-v2";
const MAX_BYTES = 2 * 1024 * 1024;

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);
const day = (iso: string) =>
  new Date(iso).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
const kb = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
const money = (n: number) => n.toLocaleString("zh-CN");

const emptyForm = {
  name: "",
  company: "",
  email: "",
  kind: workbench.kinds[0] as string,
  useCase: "",
  dueAt: "",
  layers: workbench.specs.layers[4] as string,
  printing: workbench.specs.printing[6] as string,
  finishes: [] as string[],
  lamination: workbench.specs.lamination[2] as string,
  note: "",
};

export function WorkbenchSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [tiers, setTiers] = useState<number[]>([]);
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const [msg, setMsg] = useState("");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  // 连续快速点击（同一帧内多次写入）时，闭包里的 projects 会是旧值，导致丢数据。
  // 这里用 ref 保存"最新一次真正写下去的值"，所有追加类操作都基于它计算。
  const projectsRef = useRef<Project[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect -- 仅在挂载后执行一次的本地恢复，
     与服务端预渲染保持一致（做法与 PackyDrawer 相同） */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { projects?: Project[]; artworks?: Artwork[] };
        projectsRef.current = parsed.projects ?? [];
        setProjects(parsed.projects ?? []);
        setArtworks(parsed.artworks ?? []);
        if ((parsed.projects ?? []).length) setOpen(false);
      }
    } catch {
      /* 读不到就当第一次用 */
    }
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persist = useCallback((nextProjects: Project[], nextArtworks: Artwork[]) => {
    projectsRef.current = nextProjects;
    setProjects(nextProjects);
    setArtworks(nextArtworks);
    try {
      window.localStorage.setItem(
        STORE_KEY,
        JSON.stringify({ projects: nextProjects, artworks: nextArtworks }),
      );
      return true;
    } catch {
      setMsg(workbench.artworks.tooLarge);
      return false;
    }
  }, []);

  const allQuotes = useMemo(
    () =>
      projects
        .flatMap((p) => p.quotes.map((q) => ({ ...q, projectId: p.id, projectName: p.kind })))
        .sort((a, b) => String(b.at).localeCompare(String(a.at))),
    [projects],
  );
  /** 询价记录默认只列最近 3 条，多了再展开。 */
  const visibleQuotes = showAllQuotes ? allQuotes : allQuotes.slice(0, 3);

  const stats = useMemo(() => {
    const last = [...projects.map((p) => p.createdAt), ...artworks.map((a) => a.at)].sort().pop();
    return [
      { k: "我的项目", v: String(projects.length) },
      { k: "我的图稿", v: String(artworks.length) },
      { k: "报价记录", v: String(allQuotes.length) },
      { k: "最近更新", v: last ? day(last) : "—" },
    ];
  }, [projects, artworks, allQuotes]);

  const registered = projects.length > 0;

  function specQuestion(field: string) {
    askPacky(`我不确定「${field}」怎么选，帮我推荐一下。`);
  }

  function toggleTier(v: number) {
    setTiers((prev) => {
      const on = !prev.includes(v);
      if (on) noteToPacky(`客户选了报价档：${money(v)} 个`);
      return on ? [...prev, v].sort((a, b) => a - b) : prev.filter((x) => x !== v);
    });
  }

  function formSummary() {
    const lines = [
      `品类：${form.kind}`,
      form.useCase ? `用途：${form.useCase}` : "",
      `材质层数：${form.layers}`,
      `印刷：${form.printing}`,
      `其他工艺：${form.finishes.length ? form.finishes.join("、") : "暂时不做"}`,
      `表面处理：${form.lamination}`,
      tiers.length ? `数量档：${tiers.map((t) => money(t)).join(" / ")} 个` : "",
      form.dueAt ? `期望交期：${form.dueAt}` : "",
    ].filter(Boolean);
    const note = form.note.trim();
    return [note ? `需求说明：${note}` : "", lines.join("\n")].filter(Boolean).join("\n\n");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setMsg(workbench.form.missing);
      return;
    }
    const project: Project = {
      id: uid(),
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      quotes: tiers.map((t) => ({ qty: t, at: now() })),
      createdAt: now(),
      notes: [],
    };
    const ok = persist([project, ...projectsRef.current], artworks);
    setMsg(ok ? workbench.form.saved : "");
    setForm({ ...emptyForm });
    setTiers([]);
    setOpen(false);
  }

  function addNote(id: string) {
    const text = (noteDraft[id] ?? "").trim();
    if (!text) return;
    const next = projectsRef.current.map((p) =>
      p.id === id ? { ...p, notes: [...p.notes, { at: now(), text }] } : p,
    );
   persist(next, artworks);
    setNoteDraft((d) => ({ ...d, [id]: "" }));
  }

  function addTierTo(id: string, qty: number) {
    const next = projectsRef.current.map((p) =>
      p.id === id && !p.quotes.some((q) => q.qty === qty)
        ? { ...p, quotes: [...p.quotes, { qty, at: now() }].sort((a, b) => a.qty - b.qty) }
        : p,
    );
    persist(next, artworks);
    noteToPacky(`客户在工作台加了一个报价档：${money(qty)} 个`);
  }

  function onFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const accepted: Artwork[] = [];
    let blocked = "";
    Array.from(files).forEach((f) => {
      if (f.size > MAX_BYTES) {
        blocked = `${f.name}：${workbench.artworks.tooLarge}`;
        return;
      }
      const item: Artwork = { id: uid(), name: f.name, size: f.size, at: now() };
      accepted.push(item);
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const url = String(reader.result ?? "");
          setArtworks((prev) => {
            const next = prev.map((a) => (a.id === item.id ? { ...a, dataUrl: url } : a));
            persist(projectsRef.current, next);
            return next;
          });
        };
        reader.readAsDataURL(f);
      }
    });
    if (accepted.length) persist(projectsRef.current, [...accepted, ...artworks]);
    setMsg(
      blocked || (accepted.length ? `已加入 ${accepted.length} 个文件（存在你自己的浏览器里）。` : ""),
    );
    if (fileRef.current) fileRef.current.value = "";
  }

  function clearAll() {
    if (!window.confirm("清空这台设备上保存的工作台内容？（不影响你已经发给 PACKGO 的信息）")) return;
    try {
      window.localStorage.removeItem(STORE_KEY);
    } catch {
      /* 忽略 */
    }
    setProjects([]);
    projectsRef.current = [];
    setArtworks([]);
    setMsg("");
    setOpen(true);
  }

  return (
    <Section
      id="workbench"
      eyebrow={workbench.eyebrow}
      title={workbench.title}
      summary={workbench.summary}
    >
      {/* ① 顶部概况置前 */}
      <div className="wb-top">
        <div className="wb-id">
          <span className="wb-id__who">
            {registered ? `${workbench.identity.registered}：${projects[0].name}` : workbench.identity.guest}
          </span>
          <span className="wb-id__hint">{workbench.identity.hint}</span>
        </div>
        <div className="wb-stats">
          {stats.map((s) => (
            <div key={s.k} className="wb-stat">
              <span className="wb-stat__v">{s.v}</span>
              <span className="wb-stat__k">{s.k}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="wb-guest">{workbench.guestNote}</p>

      {msg ? <p className="wb-msg">{msg}</p> : null}

      {/* ② 登记我的需求 */}
      <div className="wb-block">
        <button type="button" className="wb-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <span>{workbench.form.title}</span>
          <span className="wb-toggle__sign">{open ? "收起" : "展开"}</span>
        </button>
        {open ? (
          <form className="wb-form" onSubmit={submit}>
            <p className="wb-form__hint">{workbench.form.hint}</p>

            <div className="wb-grid">
              <label>
                <span>{workbench.form.labels.name}</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={workbench.form.placeholders.name}
                />
              </label>
              <label>
                <span>{workbench.form.labels.company}</span>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder={workbench.form.placeholders.company}
                />
              </label>
              <label>
                <span>{workbench.form.labels.email}</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={workbench.form.placeholders.email}
                />
              </label>
              <label>
                <span>{workbench.form.labels.kind}</span>
                <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                  {workbench.kinds.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{workbench.form.labels.useCase}</span>
                <input
                  value={form.useCase}
                  onChange={(e) => setForm({ ...form, useCase: e.target.value })}
                  placeholder={workbench.form.placeholders.useCase}
                />
              </label>
              <label>
                <span>{workbench.form.labels.dueAt}</span>
                <input
                  type="date"
                  value={form.dueAt}
                  onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
                />
              </label>
            </div>

            {/* 规格：给"已经做过、清楚自己要什么"的客户 */}
            <div className="wb-grid wb-grid--specs">
              <label>
                <span>
                  {workbench.form.labels.layers}
                  <button
                    type="button"
                    className="wb-ask"
                    aria-label="问 Packy：材质层数怎么选"
                    onClick={() => specQuestion("材质层数")}
                  >
                    {workbench.form.askPackyShort}
                  </button>
                </span>
                <select value={form.layers} onChange={(e) => setForm({ ...form, layers: e.target.value })}>
                  {workbench.specs.layers.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>
                  {workbench.form.labels.printing}
                  <button
                    type="button"
                    className="wb-ask"
                    aria-label="问 Packy：印刷色数怎么选"
                    onClick={() => specQuestion("印刷色数")}
                  >
                    {workbench.form.askPackyShort}
                  </button>
                </span>
                <select value={form.printing} onChange={(e) => setForm({ ...form, printing: e.target.value })}>
                  {workbench.specs.printing.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>
                  {workbench.form.labels.lamination}
                  <button
                    type="button"
                    className="wb-ask"
                    aria-label="问 Packy：亮膜还是哑膜"
                    onClick={() => specQuestion("亮膜还是哑膜")}
                  >
                    {workbench.form.askPackyShort}
                  </button>
                </span>
                <select
                  value={form.lamination}
                  onChange={(e) => setForm({ ...form, lamination: e.target.value })}
                >
                  {workbench.specs.lamination.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="wb-field">
              <span className="wb-field__label">
                {workbench.form.labels.finishes}
                <button
                  type="button"
                  className="wb-ask"
                  aria-label="问 Packy：其他工艺怎么选"
                  onClick={() => specQuestion("其他工艺（烫金、击凸、触感膜…）")}
                >
                  {workbench.form.askPackyShort}
                </button>
              </span>
              <div className="wb-chips">
                {workbench.specs.finishes.map((f) => {
                  const on = form.finishes.includes(f);
                  return (
                    <button
                      type="button"
                      key={f}
                      className={`wb-chip${on ? " is-on" : ""}`}
                      aria-pressed={on}
                      onClick={() =>
                        setForm({
                          ...form,
                          finishes: on
                            ? form.finishes.filter((x) => x !== f)
                            : [...form.finishes, f],
                        })
                      }
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="wb-askline">{workbench.form.askPacky}</p>

            {/* 数量与报价 */}
            <div className="wb-field">
              <span className="wb-field__label">{workbench.qty.title}</span>
              <p className="wb-moq">⚠ {workbench.qty.moqNote}</p>
              <div className="wb-chips">
                {workbench.qty.tiers.map((t) => {
                  const on = tiers.includes(t.v);
                  return (
                    <button
                      type="button"
                      key={t.v}
                      className={`wb-chip wb-chip--qty${on ? " is-on" : ""}`}
                      aria-pressed={on}
                      onClick={() => toggleTier(t.v)}
                    >
                      {t.label} 个
                    </button>
                  );
                })}
                <span className="wb-chip wb-chip--off" title={workbench.qty.below.note}>
                  {workbench.qty.below.label} 个（{workbench.qty.below.note}）
                </span>
              </div>
              <p className="wb-note">{workbench.qty.pickHint}</p>
            </div>

            {/* 需求说明 + 发送给 Packy */}
            <div className="wb-field">
              <span className="wb-field__label">{workbench.form.labels.note}</span>
              <textarea
                className="wb-notearea"
                rows={4}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder={workbench.form.placeholders.note}
              />
              <div className="wb-actions">
                <button
                  type="button"
                  className="btn wb-send"
                  onClick={() => askPacky(formSummary())}
                  title={workbench.form.noteSendHint}
                >
                  {workbench.form.noteSend}
                </button>
                <span className="wb-note">{workbench.form.noteSendHint}</span>
              </div>
            </div>

            <div className="wb-actions">
              <button type="submit" className="btn btn--primary">
                {workbench.form.submit}
              </button>
              {registered ? (
                <button type="button" className="wb-link" onClick={clearAll}>
                  {workbench.form.reset}
                </button>
              ) : null}
            </div>
          </form>
        ) : null}
      </div>

      {/* ③ 我的项目：收起 / 展开，展开看进度、卡点、报价、规格 */}
      <div className="wb-block">
        <h3 className="wb-h">{workbench.projects.title}</h3>
        {!loaded ? null : projects.length ? (
          <div className="wb-projects">
            {projects.map((p) => {
              const isOpen = !!expanded[p.id];
              return (
                <article key={p.id} className="wb-project">
                  <header className="wb-project__head">
                    <span className="wb-project__kind">{p.kind}</span>
                    <span className="wb-project__stage">阶段 1/{workbench.stages.length} · {workbench.stages[0].name}</span>
                    <span className="wb-project__stage wb-project__stage--soft">
                      报价记录 {p.quotes.length}
                    </span>
                    <button
                      type="button"
                      className="wb-project__toggle"
                      aria-expanded={isOpen}
                      title={workbench.projects.expandHint}
                      onClick={() => setExpanded((v) => ({ ...v, [p.id]: !isOpen }))}
                    >
                      {isOpen ? workbench.projects.collapse : workbench.projects.expand}
                    </button>
                  </header>
                  <h4 className="wb-project__title">
                    {p.useCase || p.kind}
                    {p.dueAt ? ` · 期望交期 ${p.dueAt}` : ""}
                  </h4>
                  <p className="wb-project__meta">
                    {p.layers}｜{p.printing}｜{p.lamination}｜
                    {p.finishes.length ? p.finishes.join("、") : "无其他工艺"}
                    {p.quotes.length ? `｜${p.quotes.map((q) => money(q.qty)).join(" / ")} 个` : ""}
                  </p>

                  {isOpen ? (
                    <div className="wb-project__body">
                      <div className="wb-sub">
                        <h5 className="wb-sub__h">{workbench.projects.progressTitle}</h5>
                        <ol className="wb-stages">
                          {workbench.stages.map((s, i) => (
                            <li
                              key={s.name}
                              className={
                                i === 0 ? "is-current" : i === 1 ? "is-next" : "is-todo"
                              }
                            >
                              <span className="wb-stages__name">
                                {i + 1}. {s.name}
                              </span>
                              {i <= 1 ? <span className="wb-stages__desc">{s.desc}</span> : null}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="wb-sub">
                        <h5 className="wb-sub__h">{workbench.projects.blockerTitle}</h5>
                        <p className="wb-blocker">{workbench.projects.blockerNone}</p>
                        <p className="wb-note">{workbench.projects.blockerCommon}</p>
                      </div>

                      <div className="wb-sub">
                        <h5 className="wb-sub__h">{workbench.projects.specTitle}</h5>
                        <dl className="wb-specs">
                          <div>
                            <dt>用途</dt>
                            <dd>{p.useCase || "未填"}</dd>
                          </div>
                          <div>
                            <dt>材质层数</dt>
                            <dd>{p.layers}</dd>
                          </div>
                          <div>
                            <dt>印刷</dt>
                            <dd>{p.printing}</dd>
                          </div>
                          <div>
                            <dt>其他工艺</dt>
                            <dd>{p.finishes.length ? p.finishes.join("、") : "暂时不做"}</dd>
                          </div>
                          <div>
                            <dt>表面处理</dt>
                            <dd>{p.lamination}</dd>
                          </div>
                          {p.note ? (
                            <div>
                              <dt>需求说明</dt>
                              <dd>{p.note}</dd>
                            </div>
                          ) : null}
                        </dl>
                      </div>

                      <div className="wb-sub">
                        <h5 className="wb-sub__h">{workbench.projects.quotesTitle}</h5>
                        <div className="wb-chips">
                          {workbench.qty.tiers.map((t) => {
                            const on = p.quotes.some((q) => q.qty === t.v);
                            return (
                              <button
                                type="button"
                                key={t.v}
                                className={`wb-chip wb-chip--qty${on ? " is-on" : ""}`}
                                aria-pressed={on}
                                onClick={() => addTierTo(p.id, t.v)}
                                title="点一下＝把这个数量档加进报价记录"
                              >
                                {on ? "✓ " : "＋ "}
                                {t.label} 个
                              </button>
                            );
                          })}
                        </div>
                        <p className="wb-note">{workbench.qty.recordNote}</p>
                      </div>

                      <ul className="wb-timeline">
                        <li>
                          <span className="wb-timeline__at">{day(p.createdAt)}</span>
                          登记需求（{p.name}
                          {p.company ? ` · ${p.company}` : ""}）
                        </li>
                        {p.notes.map((n) => (
                          <li key={n.at + n.text}>
                            <span className="wb-timeline__at">{day(n.at)}</span>
                            {n.text}
                          </li>
                        ))}
                      </ul>
                      <div className="wb-noterow">
                        <input
                          value={noteDraft[p.id] ?? ""}
                          onChange={(e) => setNoteDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                          placeholder={workbench.projects.noteLabel}
                        />
                        <button type="button" className="btn" onClick={() => addNote(p.id)}>
                          {workbench.projects.noteAdd}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="wb-note">{workbench.projects.expandHint}</p>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="wb-empty">{workbench.projects.empty}</p>
        )}
      </div>

      {/* ④ 询价记录：默认只列最近 3 条，多了展开 */}
      <div className="wb-block">
        <h3 className="wb-h">
          {workbench.qty.recordTitle}
          {allQuotes.length ? <span className="wb-h__count">共 {allQuotes.length} 条</span> : null}
        </h3>
        {allQuotes.length ? (
          <>
            <table className="wb-table">
              <thead>
                <tr>
                  <th>{workbench.qty.recordCols.at}</th>
                  <th>{workbench.qty.recordCols.qty}</th>
                  <th>{workbench.qty.recordCols.project}</th>
                  <th>{workbench.qty.recordCols.state}</th>
                </tr>
              </thead>
              <tbody>
                {visibleQuotes.map((q) => (
                  <tr key={`${q.projectId}-${q.qty}`}>
                    <td>{day(q.at)}</td>
                    <td>{money(q.qty)} 个</td>
                    <td>{q.projectName}</td>
                    <td>
                      <span className="wb-quote-state">{workbench.qty.recordStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="wb-actions">
              {allQuotes.length > 3 ? (
                <button
                  type="button"
                  className="wb-link"
                  onClick={() => setShowAllQuotes((v) => !v)}
                  title={workbench.qty.recordLatest}
                >
                  {showAllQuotes
                    ? workbench.qty.recordLess
                    : `${workbench.qty.recordMore}（${allQuotes.length}）`}
                </button>
              ) : null}
              <span className="wb-note">{workbench.qty.recordLatest}</span>
            </div>
          </>
        ) : (
          <p className="wb-empty">{workbench.qty.recordEmpty}</p>
        )}
        <p className="wb-note">{workbench.qty.recordNote}</p>
      </div>

      {/* ⑤ 我的图稿 */}
      <div className="wb-block">
        <h3 className="wb-h">{workbench.artworks.title}</h3>
        <p className="wb-note">{workbench.artworks.note}</p>
        <div className="wb-artgrid">
          {artworks.map((a) => (
            <figure key={a.id} className="wb-art">
              <div className="wb-art__box">
                {a.dataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={a.dataUrl} alt={a.name} />
                ) : (
                  <span className="wb-art__file">文件</span>
                )}
              </div>
              <figcaption>
                <span className="wb-art__name">{a.name}</span>
                <span className="wb-art__meta">
                  {kb(a.size)} · {day(a.at)}
                </span>
              </figcaption>
            </figure>
          ))}
          <label className="wb-art wb-art--add">
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf,.ai,.psd,.zip"
              onChange={(e) => onFiles(e.target.files)}
            />
            <span className="wb-art__plus">＋</span>
            <span>{workbench.artworks.pick}</span>
          </label>
        </div>
        {!artworks.length ? <p className="wb-empty">{workbench.artworks.empty}</p> : null}
      </div>

      {/* ⑥ 问 Packy */}
      <div className="wb-chatbox">
        <div>
          <b>{workbench.chat.title}</b>
          <p className="wb-note">{workbench.chat.hint}</p>
          <p className="wb-note">{workbench.chat.pinHint}</p>
        </div>
        <PackyOpenButton className="btn btn--primary" label={workbench.chat.button} />
      </div>

      <p className="wb-boundary">{workbench.storageNote}</p>
    </Section>
  );
}
