import Image from "next/image";
import { formatCapabilities, formats } from "@/content/site";
import { Section } from "./Section";

export function FormatGrid() {
  return (
    <Section
      id="formats"
      eyebrow="主要包装形态"
      title="先看形态，再谈细节"
      summary="四种最常见的包装形态；每一条都能往下走到材料、结构、工艺与真实设备。"
    >
      <div className="grid grid--4">
        {formats.map((item) => (
          <article key={item.id} className="card format-card">
            <div className="format-card__media">
              <Image
                src={item.image}
                alt={`${item.title} 示例`}
                fill
                sizes="(max-width: 560px) 100vw, (max-width: 1080px) 50vw, 25vw"
                className="format-card__image"
              />
              <span className="format-card__swatch" style={{ background: item.accent }} aria-hidden />
            </div>
            <h3 className="card__title">{item.title}</h3>
            <p className="card__latin">{item.latin}</p>
            <p className="card__body">{item.summary}</p>
            <ul className="tick-list">
              {item.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="grid grid--3 capability-row">
        {formatCapabilities.map((c) => (
          <div key={c.title} className="capability">
            <h4 className="capability__title">{c.title}</h4>
            <p className="capability__body">{c.note}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
