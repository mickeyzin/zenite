import type { Metadata } from "next";
import { QuizView } from "@/components/quiz/QuizView";
import { getPerfumes } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Mapa olfativo",
  description: "Responda a 7 perguntas rápidas sobre famílias, notas, intensidade e ocasião e descubra os perfumes do catálogo da Zênite mais compatíveis com você.",
  alternates: { canonical: "/mapa-olfativo" },
};

export default async function MapaOlfativoPage() {
  return (
    <main id="conteudo" className="catalog-page quiz-page">
      <header className="catalog-head">
        <p className="eyebrow">
          <span>✦</span> Mapeamento olfativo
        </p>
        <h1 className="stage-title">Descubra o seu mapa</h1>
        <p className="review-method">
          Sete perguntas rápidas. As respostas viram um perfil de acordes e são comparadas com o perfil estimado de cada perfume do
          catálogo. Tudo acontece no seu navegador.
        </p>
      </header>
      <QuizView catalog={await getPerfumes()} />
    </main>
  );
}
