import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareView } from "@/components/compare/CompareView";
import { getPerfumes } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Comparar perfumes",
  description: "Compare dois perfumes lado a lado: notas em comum, perfil olfativo estimado, dados oficiais e desempenho.",
  alternates: { canonical: "/comparar" },
};

export default async function ComparePage() {
  return (
    <main id="conteudo" className="catalog-page">
      <header className="catalog-head">
        <p className="eyebrow">
          <span>✦</span> Comparações
        </p>
        <h1 className="stage-title">Lado a lado</h1>
      </header>
      <Suspense fallback={null}>
        <CompareView perfumes={await getPerfumes()} />
      </Suspense>
    </main>
  );
}
