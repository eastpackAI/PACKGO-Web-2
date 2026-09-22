"use client";

import { useState } from "react";
import { PackyOpenButton } from "./PackyDrawer";
import { brand, nav } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="wordmark" href="#top" aria-label={`${brand.name} 首页`}>
          <span className="wordmark__mark" aria-hidden />
          <span className="wordmark__text">{brand.wordmark}</span>
        </a>

        <nav className="site-nav" aria-label="主导航">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--ghost" href="#about">
            {brand.stageNote}
          </a>
          <PackyOpenButton label={brand.primaryCta} />
        </div>

        <button
          type="button"
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">打开导航</span>
          <span className={`burger${open ? " burger--open" : ""}`} aria-hidden />
        </button>
      </div>

      {open && (
        <div className="container">
          <nav id="mobile-nav" className="site-nav site-nav--mobile" aria-label="移动导航">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <PackyOpenButton label={brand.primaryCta} className="btn btn--primary" />
          </nav>
        </div>
      )}
    </header>
  );
}
