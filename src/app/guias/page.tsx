import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/data/guides";

export const metadata: Metadata = {
  title: "Guias de perfumaria",
  description: "Aprenda a escolher melhor: concentrações, famílias olfativas, como testar na pele e como fazer o perfume durar mais.",
  alternates: { canonical: "/guias" },
};

export default function GuiasPage() {
  return (
    <main id="conteudo" className="catalog-page guides-page">
      <header className="catalog-head">
        <p className="eyebrow">
          <span>✦</span> Guias
        </p>
        <h1 className="stage-title">Aprenda a escolher melhor</h1>
        <p className="review-method">Conteúdo editorial da Zênite: o essencial de perfumaria, sem complicação.</p>
      </header>
      <ul className="guides-list">
        {GUIDES.map((g, i) => (
          <li key={g.slug}>
            <Link href={`/guias/${g.slug}`} className="guide-card">
              <span className="guide-card-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="guide-card-body">
                <strong>{g.title}</strong>
                <span>{g.description}</span>
                <span className="guide-card-meta">{g.minutes} min de leitura</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
