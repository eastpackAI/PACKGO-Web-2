import { brand, footer } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <span className="wordmark wordmark--footer">
              <span className="wordmark__mark" aria-hidden />
              <span className="wordmark__text">{brand.wordmark}</span>
            </span>
            <p>{brand.tagline}</p>
          </div>

          <div className="site-footer__columns">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h3 className="site-footer__col-title">{col.title}</h3>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="site-footer__note">{footer.note}</p>
        <div className="site-footer__bottom">
          <span>{footer.copyright}</span>
          <span>{brand.stageNote}</span>
        </div>
      </div>
    </footer>
  );
}
