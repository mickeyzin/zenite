import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { featuredPerfumes } from "@/data/perfumes";

export const metadata: Metadata = {
  title: "Catálogo de perfumes",
  description: "Busque perfumes por nome, marca, notas, família olfativa, estação e ocasião. Resenhas editoriais da Zênite.",
  alternates: { canonical: "/catalogo" },
};

export default function CatalogPage() {
  return (
    <main id="conteudo" className="catalog-page">
      <header className="catalog-head">
        <p className="eyebrow">
          <span>✦</span> Catálogo
        </p>
        <h1 className="stage-title">Perfumes da Zênite</h1>
        <p className="review-method">
          O catálogo está começando com os três perfumes da apresentação. O perfil predominante é estimado a partir das notas declaradas.
        </p>
      </header>
      <Suspense fallback={null}>
        <CatalogView perfumes={featuredPerfumes} />
      </Suspense>
    </main>
  );
}
