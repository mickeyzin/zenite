import Link from "next/link";
import { ZeniteTrail } from "./ZeniteTrail";

/**
 * Percurso depois da apresentação. Cada seção ganha uma estrela da Linha Zênite.
 * Os textos descrevem o que cada área terá; tudo está marcado como "Em breve"
 * até a Fase 5 (catálogo e resenhas) e seguintes.
 */
const SECTIONS: { id: string; label: string; title: string; text: string; phase: string; href?: string; cta?: string }[] = [
  {
    id: "catalogo",
    label: "Catálogo",
    title: "Explore por notas, famílias e ocasiões",
    text: "Busca por nome, marca, nota olfativa, concentração, estação, ocasião e perfil — com filtros e ordenação.",
    phase: "Fase 5",
    href: "/catalogo",
    cta: "Abrir o catálogo",
  },
  {
    id: "resenhas",
    label: "Resenhas",
    title: "Resenhas completas e verificáveis",
    text: "Pirâmide olfativa, evolução, perfil estimado, desempenho e perfumes semelhantes. Dados oficiais, avaliação editorial e opinião de usuários sempre separados.",
    phase: "Fase 5",
    href: "/perfumes/lattafa-art-of-universe",
    cta: "Ler uma resenha",
  },
  {
    id: "mapeamento",
    label: "Mapeamento olfativo",
    title: "Descubra o seu mapa olfativo",
    text: "Sete perguntas sobre famílias, notas que você ama e evita, intensidade e ocasião. O resultado mostra o seu perfil e os perfumes do catálogo mais compatíveis, com a justificativa.",
    phase: "Fase 7",
    href: "/mapa-olfativo",
    cta: "Fazer o quiz",
  },
  {
    id: "comparacoes",
    label: "Comparações",
    title: "Lado a lado, com justificativa",
    text: "Perfumes comparados por notas, acordes e ocasiões, com justificativa — sem afirmar que são idênticos quando não há evidência.",
    phase: "Fase 5",
    href: "/comparar",
    cta: "Comparar perfumes",
  },
  {
    id: "guias",
    label: "Guias de perfumaria",
    title: "Aprenda a escolher melhor",
    text: "Concentrações, famílias olfativas, como testar na pele e como fazer um perfume durar mais.",
    phase: "Guias",
    href: "/guias",
    cta: "Ler os guias",
  },
  {
    id: "ofertas",
    label: "Ofertas de parceiros",
    title: "Onde encontrar, com transparência",
    text: "Em cada resenha: ofertas de lojas parceiras com links de afiliado identificados, da mais barata para a mais cara, sempre com a data do preço.",
    phase: "Ofertas",
    href: "/catalogo",
    cta: "Escolher um perfume",
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
              {s.href ? (
                <Link href={s.href} className="btn-ghost trail-link">
                  {s.cta} <span aria-hidden>→</span>
                </Link>
              ) : (
                <p className="trail-soon">
                  Em breve <span aria-hidden>·</span> {s.phase}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </ZeniteTrail>
  );
}
