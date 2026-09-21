import Image from "next/image";
import { manufacturing } from "@/content/site";
import { Section } from "./Section";

export function ManufacturingSection() {
  return (
    <Section
      id="manufacturing"
      eyebrow={manufacturing.eyebrow}
      title={manufacturing.title}
      summary={manufacturing.summary}
    >
      <figure className="wide-media">
        <Image
          src={manufacturing.image.src}
          alt={manufacturing.image.alt}
          width={2016}
          height={1152}
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="wide-media__image"
        />
        <figcaption className="media-note">{manufacturing.image.note}</figcaption>
      </figure>

      <div className="grid grid--4">
        {manufacturing.pillars.map((p) => (
          <article key={p.title} className="card">
            <h3 className="card__title">{p.title}</h3>
            <p className="card__body">{p.body}</p>
          </article>
        ))}
      </div>
      <p className="footnote">{manufacturing.footnote}</p>
    </Section>
  );
}
