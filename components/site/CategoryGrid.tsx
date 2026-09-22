import { categories } from "@/content/site";
import { Section } from "./Section";

export function CategoryGrid() {
  return (
    <Section
      id="categories"
      eyebrow="产品品类"
      title="按品类直接找"
      summary="这些品类都能直接做；如果没找到想要的，把需求说清楚也可以。"
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
