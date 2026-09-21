import { packy } from "@/content/site";
import { Section } from "./Section";

export function PackySection() {
  return (
    <Section id="packy" eyebrow={packy.eyebrow} title={packy.title} summary={packy.summary} tone="muted">
      <div className="grid grid--2 packy-grid">
        <div className="packy-abilities">
          {packy.abilities.map((a) => (
            <div key={a.title} className="packy-ability">
              <h3 className="packy-ability__title">{a.title}</h3>
              <p className="packy-ability__body">{a.body}</p>
            </div>
          ))}

          <ul className="route-list">
            {packy.routes.map((r) => (
              <li key={r.label}>
                <strong>{r.label}</strong>
                <span>{r.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="packy-demo" aria-label="Packy 对话示例">
          <div className="packy-demo__head">
            <span className="packy-demo__dot" aria-hidden />
            <span className="packy-demo__name">Packy</span>
            <span className="packy-demo__hint">每轮只说 1～2 件事</span>
          </div>

          <div className="bubble bubble--customer">{packy.sample.customer}</div>
          <div className="bubble bubble--packy">{packy.sample.packy}</div>

          <div className="packy-demo__foot">
            <div className="packy-demo__input" aria-hidden>
              说说您要做的包装…
            </div>
            <span className="packy-demo__send" aria-hidden>
              发送
            </span>
          </div>
        </aside>
      </div>
    </Section>
  );
}
