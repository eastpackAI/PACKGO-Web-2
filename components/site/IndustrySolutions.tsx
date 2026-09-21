import { generalShowroom, industries } from "@/content/site";
import { Section } from "./Section";

export function IndustrySolutions() {
  return (
    <Section
      id="solutions"
      eyebrow="行业解决方案展厅"
      title="按你的行业进厅，不按我们的产线找路"
      summary="每个展厅都是一整套解决方案空间：主包装、外包装、标签与配套可以在同一个项目里组合，而不是让你在几个「生产线展厅」之间来回跳。"
    >
      <div className="grid grid--4">
        {industries.map((ind) => (
          <article key={ind.id} className="card industry-card">
            <h3 className="card__title">{ind.title}</h3>
            <p className="card__latin">{ind.latin}</p>
            <p className="card__body">{ind.summary}</p>
            <ul className="tick-list">
              {ind.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <article className="showroom-general">
        <div className="showroom-general__main">
          <h3 className="card__title">{generalShowroom.title}</h3>
          <p className="card__latin">{generalShowroom.latin}</p>
          <p className="card__body">{generalShowroom.summary}</p>
        </div>
        <ul className="chip-list">
          {generalShowroom.groups.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </article>
    </Section>
  );
}
