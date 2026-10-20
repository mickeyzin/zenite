import { ZeniteTrail } from "./ZeniteTrail";

/**
 * Percurso depois da apresentação. Cada seção ganha uma estrela da Linha Zênite.
 * Os textos descrevem o que cada área terá; tudo está marcado como "Em breve"
 * até a Fase 5 (catálogo e resenhas) e seguintes.
 */
const SECTIONS = [
  {
    id: "catalogo",
    label: "Catálogo",
    title: "Explore por notas, famílias e ocasiões",
    text: "Busca por nome, marca, nota olfativa, concentração, estação, ocasião, perfil e intensidade — com filtros e ordenação.",
    phase: "Fase 5",
  },
  {
    id: "resenhas",
    label: "Resenhas",
    title: "Resenhas completas e verificáveis",
    text: "Pirâmide olfativa, evolução, fixação, projeção e versatilidade. Dados oficiais, avaliação editorial e opinião de usuários sempre separados.",
    phase: "Fase 5",
  },
  {
    id: "mapeamento",
    label: "Mapeamento olfativo",
    title: "Converse com a IA da Zênite",
    text: "Diga o que procura — “um fresco para o verão”, “algo que lembre o meu favorito” — e receba recomendações explicadas, a partir do catálogo.",
    phase: "Fase 7",
  },
  {
    id: "comparacoes",
    label: "Comparações",
    title: "Lado a lado, com justificativa",
    text: "Perfumes semelhantes comparados por notas, acordes, intensidade e ocasiões, sem afirmar que são idênticos quando não há evidência.",
    phase: "Fase 5",
  },
  {
    id: "guias",
    label: "Guias de perfumaria",
    title: "Aprenda a escolher melhor",
    text: "Concentrações, famílias olfativas, como testar na pele e como fazer um perfume durar mais.",
    phase: "Em planejamento",
  },
  {
    id: "ofertas",
    label: "Ofertas de parceiros",
    title: "Onde encontrar, com transparência",
    text: "Ofertas de lojas parceiras com links de afiliado identificados, critérios de ordenação claros e a data da última atualização de preço.",
    phase: "Fase 8",
  },
];

export function HomeTrail() {
  return (
    <ZeniteTrail>
      <section className="trail-intro" aria-labelledby="trail-title">
        <p className="eyebrow justify-center">
          <span>✦</span> Linha Zênite
        </p>
        <h2 id="trail-title" className="stage-title text-center">
          Siga a linha pelo universo Zênite
        </h2>
      </section>
      {SECTIONS.map((s, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        return (
          <section key={s.id} id={s.id} className={`trail-section side-${side}`} aria-labelledby={`${s.id}-title`}>
            <div className="trail-card">
              <span className="trail-star-anchor" data-zenite-star="left" aria-hidden />
              <p className="eyebrow">
                <span>{String(i + 1).padStart(2, "0")}</span> {s.label}
              </p>
              <h3 id={`${s.id}-title`} className="trail-title">
                {s.title}
              </h3>
              <p className="trail-text">{s.text}</p>
              <p className="trail-soon">
                Em breve <span aria-hidden>·</span> {s.phase}
              </p>
            </div>
          </section>
        );
      })}
    </ZeniteTrail>
  );
}
