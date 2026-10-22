import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        A Zênite é um portal editorial independente. Não vendemos perfumes. Alguns links levam a lojas e podem ser links de
        afiliado — eles são sempre identificados.
      </p>
      <nav aria-label="Rodapé" className="site-footer-nav">
        <Link href="/catalogo">Catálogo</Link>
        <Link href="/comparar">Comparar</Link>
        <Link href="/mapa-olfativo">Mapa olfativo</Link>
        <Link href="/guias">Guias</Link>
        <Link href="/privacidade">Privacidade e afiliados</Link>
      </nav>
      <p>© {2026} Zênite — Perfumes Cósmicos</p>
    </footer>
  );
}
