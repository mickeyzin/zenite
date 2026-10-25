import type { Metadata } from "next";
import { ForYouView } from "@/components/account/ForYouView";
import { getPerfumes } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Para você",
  description: "Recomendações de perfumes feitas a partir do seu mapa olfativo e do seu armário.",
  robots: { index: false, follow: false },
};

export default async function ParaVocePage() {
  return (
    <main id="conteudo" className="catalog-page foryou-page">
      <header className="catalog-head">
        <p className="eyebrow">
          <span>✦</span> Para você
        </p>
        <h1 className="stage-title">Escolhidos para o seu perfil</h1>
        <p className="review-method">
          Calculado a partir do seu mapa olfativo e do seu armário. Marque “Não é pra mim” ou “Já tenho” para ajustar na hora.
        </p>
      </header>
      <ForYouView catalog={await getPerfumes()} />
    </main>
  );
}
