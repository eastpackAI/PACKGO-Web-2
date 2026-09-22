"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { workbench } from "@/content/site";
import { Section } from "./Section";
import { PackyOpenButton } from "./PackyDrawer";

type Note = { at: string; text: string };

type Project = {
  id: string;
  name: string;
  company: string;
  email: string;
  kind: string;
  qty: string;
  dueAt: string;
  note: string;
  createdAt: string;
  notes: Note[];
};

type Artwork = {
  id: string;
  name: string;
  size: number;
  at: string;
  dataUrl?: string;
};

const STORE_KEY = "packgo-workbench-v1";
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

const emptyForm = {
  name: "",
  company: "",
  email: "",
  kind: workbench.kinds[0] as string,
  qty: "",
  dueAt: "",
  note: "",
};

export function WorkbenchSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [open, setOpen] = useState(true);
  const [msg, setMsg] = useState("");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 读回这台设备上先前保存的内容（浏览器本地，不是服务器）。
  /* eslint-disable react-hooks/set-state-in-effect -- 仅在挂载后执行一次的本地恢复，
     与服务端预渲染内容保持一致，做法与 PackyDrawer 相同 */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { projects?: Project[]; artworks?: Artwork[] };
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

  const stats = useMemo(() => {
    const last = [...projects.map((p) => p.createdAt), ...artworks.map((a) => a.at)].sort().pop();
    return [
      { k: "我的项目", v: String(projects.length) },
      { k: "我的图稿", v: String(artworks.length) },
      { k: "待补记录", v: String(projects.filter((p) => p.notes.length === 0).length) },
      { k: "最近更新", v: last ? day(last) : "—" },
    ];
  }, [projects, artworks]);

  const registered = projects.length > 0;

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
      createdAt: now(),
      notes: [],
    };
    const ok = persist([project, ...projects], artworks);
    setMsg(ok ? workbench.form.saved : "");
    setForm({ ...emptyForm });
    setOpen(false);
  }

  function addNote(id: string) {
    const text = (noteDraft[id] ?? "").trim();
    if (!text) return;
    const next = projects.map((p) =>
      p.id === id ? { ...p, notes: [...p.notes, { at: now(), text }] } : p,
    );
    persist(next, artworks);
    setNoteDraft((d) => ({ ...d, [id]: "" }));
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
            persist(projects, next);
            return next;
          });
        };
        reader.readAsDataURL(f);
      }
    });
    if (accepted.length) persist(projects, [...accepted, ...artworks]);
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
      {/* ① 顶部概况置前：不用往上翻就知道自己现在什么状态 */}
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

      {/* ② 登记：游客也能先开始 */}
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
                <span>{workbench.form.labels.qty}</span>
                <input
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: e.target.value })}
                  placeholder={workbench.form.placeholders.qty}
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
            <label className="wb-wide">
              <span>{workbench.form.labels.note}</span>
              <textarea
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder={workbench.form.placeholders.note}
              />
            </label>
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

      {/* ③ 我的项目：阶段 + 记录 */}
      <div className="wb-block">
        <h3 className="wb-h">{workbench.projects.title}</h3>
        {!loaded ? null : projects.length ? (
          <div className="wb-projects">
            {projects.map((p) => (
              <article key={p.id} className="wb-project">
                <header className="wb-project__head">
                  <span className="wb-project__kind">{p.kind}</span>
                  <span className="wb-project__stage">已登记 · 待 PACKGO 确认</span>
                </header>
                <h4 className="wb-project__title">
                  {p.qty ? `${p.qty} · ` : ""}
                  {p.kind}
                  {p.dueAt ? ` · 期望交期 ${p.dueAt}` : ""}
                </h4>
                {p.note ? <p className="wb-project__note">{p.note}</p> : null}
                <ol className="wb-steps">
                  {workbench.stages.map((s, i) => (
                    <li key={s} className={i === 0 ? "is-current" : "is-todo"}>
                      {s}
                    </li>
                  ))}
                </ol>
                <p className="wb-project__next">
                  {workbench.projects.next}：等 PACKGO 与你确认规格与报价，确认后进入打样。
                </p>
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
              </article>
            ))}
          </div>
        ) : (
          <p className="wb-empty">{workbench.projects.empty}</p>
        )}
      </div>

      {/* ④ 我的图稿 */}
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

      {/* ⑤ 问 Packy */}
      <div className="wb-chatbox">
        <div>
          <b>{workbench.chat.title}</b>
          <p className="wb-note">{workbench.chat.hint}</p>
        </div>
        <PackyOpenButton className="btn btn--primary" label={workbench.chat.button} />
      </div>

      {/* ⑥ 边界说明：不假装已经接通后端 */}
      <p className="wb-boundary">{workbench.storageNote}</p>
    </Section>
  );
}
