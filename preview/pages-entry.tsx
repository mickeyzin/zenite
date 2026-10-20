import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CatalogView } from "@/components/catalog/CatalogView";
import { CompareView } from "@/components/compare/CompareView";
import { ReviewView } from "@/components/review/ReviewView";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { featuredPerfumes } from "@/data/perfumes";

// Páginas internas da prévia (catálogo, resenha, comparação), com os mesmos componentes do site.
const perfumes = featuredPerfumes.map((p) => ({ ...p, poster: p.poster.replace(/^\//, "") }));
const page = document.body.dataset.page;

function Review() {
  const read = () => perfumes.find((p) => p.slug === location.hash.slice(1)) ?? perfumes[0];
  const [p, setP] = useState(read);
  useEffect(() => {
    const on = () => {
      setP(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  useEffect(() => {
    document.title = `${p.fullName} — resenha · Zênite`;
  }, [p]);
  return (
    <main id="conteudo" className="review-page">
      <ReviewView key={p.slug} perfume={p} catalog={perfumes} />
    </main>
  );
}

function App() {
  return (
    <>
      <SiteHeader />
      {page === "catalogo" && (
        <main id="conteudo" className="catalog-page">
          <header className="catalog-head">
            <p className="eyebrow">
              <span>✦</span> Catálogo
            </p>
            <h1 className="stage-title">Perfumes da Zênite</h1>
            <p className="review-method">O catálogo está começando com os três perfumes da apresentação. O perfil predominante é estimado a partir das notas declaradas.</p>
          </header>
          <CatalogView perfumes={perfumes} />
        </main>
      )}
      {page === "comparar" && (
        <main id="conteudo" className="catalog-page">
          <header className="catalog-head">
            <p className="eyebrow">
              <span>✦</span> Comparações
            </p>
            <h1 className="stage-title">Lado a lado</h1>
          </header>
          <CompareView perfumes={perfumes} />
        </main>
      )}
      {page === "resenha" && <Review />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
