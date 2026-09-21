import { categories } from "@/content/site";
import { Section } from "./Section";

export function CategoryGrid() {
  return (
    <Section
      id="categories"
      eyebrow="产品品类"
      title="按品类直接找"
      summary="已经能做的品类在这里；能力范围逐步开放，未开放的不写成已具备。"
      tone="muted"
    >
      <ul className="category-grid">
        {categories.map((c) => (
          <li key={c} className="category-item">
            <span className="category-item__name">{c}</span>
            <span className="category-item__arrow" aria-hidden>
              →
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
