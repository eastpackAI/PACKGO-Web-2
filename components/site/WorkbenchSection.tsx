import Image from "next/image";
import { workbench } from "@/content/site";
import { Section } from "./Section";
import { PackyOpenButton } from "./PackyDrawer";

export function WorkbenchSection() {
  return (
    <Section id="workbench" eyebrow={workbench.eyebrow} title={workbench.title} summary={workbench.summary}>
      <p className="workbench-note">{workbench.demoNote}</p>

      <div className="workbench-stats">
        {workbench.stats.map((s) => (
          <div key={s.k} className="workbench-stat">
            <span className="workbench-stat__value">{s.v}</span>
            <span className="workbench-stat__label">{s.k}</span>
          </div>
        ))}
      </div>

      <div className="grid grid--3 workbench-orders">
        {workbench.orders.map((o) => (
          <article key={o.id} className="workbench-order">
            <header className="workbench-order__head">
              <span className="workbench-order__id">{o.id}</span>
              <span className="workbench-order__stage">{o.stage}</span>
            </header>
            <h3 className="workbench-order__title">{o.title}</h3>
            <div className="workbench-order__bar" aria-hidden>
              <span style={{ width: `${o.progress}%` }} />
            </div>
            <p className="workbench-order__next">{o.next}</p>
            <ol className="workbench-order__steps">
              {o.milestones.map((m, i) => (
                <li
                  key={m}
                  className={
                    i < o.current ? "is-done" : i === o.current ? "is-current" : "is-todo"
                  }
                >
                  {m}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>

      <div className="grid grid--2 workbench-lower">
        <div className="workbench-artworks">
          <h3 className="workbench-block__title">我的图稿（示意）</h3>
          <div className="workbench-artwork-grid">
            {workbench.artworks.map((a) => (
              <figure key={a.name} className="workbench-artwork">
                <div className="workbench-artwork__img">
                  <Image src={a.image} alt={`${a.kind}：${a.name}`} fill sizes="200px" />
                </div>
                <figcaption>
                  <span className="workbench-artwork__kind">{a.kind}</span>
                  <span>{a.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="workbench-timeline">
          <h3 className="workbench-block__title">进度与确认记录（示意）</h3>
          <ol className="workbench-timeline__list">
            {workbench.timeline.map((t) => (
              <li key={t.at}>
                <span className="workbench-timeline__at">{t.at}</span>
                <span className="workbench-timeline__text">{t.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ul className="workbench-benefits">
        {workbench.benefits.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <div className="workbench-cta">
        <PackyOpenButton className="btn btn--primary" label="和 Packy 聊聊我的订单" />
      </div>
    </Section>
  );
}
