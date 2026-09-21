import { platform } from "@/content/site";
import { Section } from "./Section";

export function PlatformSection() {
  return (
    <Section
      id="platform"
      eyebrow={platform.eyebrow}
      title={platform.title}
      summary={platform.summary}
      tone="ink"
    >
      <div className="grid grid--4 platform-grid">
        {platform.modules.map((m) => (
          <article key={m.no} className="module">
            <span className="module__no">{m.no}</span>
            <h3 className="module__title">{m.title}</h3>
            <p className="module__body">{m.body}</p>
          </article>
        ))}
      </div>
      <p className="platform__highlight">{platform.highlight}</p>
    </Section>
  );
}
