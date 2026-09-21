import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  summary?: string;
  children: ReactNode;
  tone?: "default" | "muted" | "ink";
}

/**
 * 统一的版块容器：眉标 + 标题 + 一句话说明 + 内容。
 * 版块节奏（留白、字号、栅格）是全站一致性的基础。
 */
export function Section({ id, eyebrow, title, summary, children, tone = "default" }: SectionProps) {
  return (
    <section id={id} className={`section section--${tone}`}>
      <div className="container">
        {(eyebrow || title) && (
          <header className="section__head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="section__title">{title}</h2>}
            {summary && <p className="section__summary">{summary}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
