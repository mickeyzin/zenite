import Link from "next/link";

const NAV = ["Catálogo", "Resenhas", "Mapeamento olfativo", "Guias"];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Zênite — página inicial">
        <svg viewBox="0 0 24 24" aria-hidden className="brand-star">
          <path d="M12 0 L13.4 10.6 L24 12 L13.4 13.4 L12 24 L10.6 13.4 L0 12 L10.6 10.6 Z" />
        </svg>
        <span className="brand-word">ZÊNITE</span>
        <span className="brand-sub">Perfumes Cósmicos</span>
      </Link>
      <nav aria-label="Principal" className="hidden md:block">
        <ul className="flex gap-8">
          {NAV.map((n) => (
            <li key={n}>
              <span className="nav-soon" aria-disabled="true" title="Em breve">
                {n}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
