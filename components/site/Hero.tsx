import Image from "next/image";
import { brand } from "@/content/site";
import { PackyOpenButton } from "./PackyDrawer";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="eyebrow">{brand.industryNote}</p>
          <h1 className="hero__title">{brand.headline}</h1>
          <p className="hero__support">{brand.support}</p>

          <div className="hero__actions">
            <PackyOpenButton className="btn btn--primary btn--lg" label={brand.primaryCta} />
            <a className="btn btn--outline btn--lg" href="#solutions">
              {brand.secondaryCta}
            </a>
          </div>

          <p className="hero__note">{brand.tagline}</p>
        </div>

        <figure className="hero__media">
          <Image
            src={brand.heroImage.src}
            alt={brand.heroImage.alt}
            width={2016}
            height={1152}
            priority
            sizes="(max-width: 900px) 100vw, 46vw"
            className="hero__image"
          />
          <figcaption className="media-note">{brand.heroImage.note}</figcaption>
        </figure>
      </div>

      <div className="container">
        <div className="hero__band" role="presentation">
          <div className="hero__band-items">
            <span>软包装袋</span>
            <span>彩盒与纸盒</span>
            <span>标签与贴纸</span>
            <span>无纺布袋 / 纸袋</span>
            <span>真实产线影像</span>
            <span>两级精准报价</span>
          </div>
        </div>
      </div>
    </section>
  );
}
