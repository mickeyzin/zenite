import { CinematicExperience } from "@/components/experience/CinematicExperience";
import { artOfUniverse, featuredPerfumes } from "@/data/perfumes";

export default function Home() {
  return (
    <main id="conteudo">
      <CinematicExperience perfume={artOfUniverse} index={0} total={3} />

      <section id="depois" className="after-section">
        <p className="eyebrow">
          <span>✦</span> Em construção
        </p>
        <h2 className="stage-title">O restante do universo Zênite</h2>
        <p className="max-w-xl text-[var(--z-muted)] mt-4">
          Esta é a primeira cena da plataforma. As próximas fases trazem os universos do Creed Wild Vetiver e do Prada
          Paradoxe, a Linha Zênite, o catálogo com filtros, o mapeamento olfativo por IA e as ofertas de lojas parceiras.
        </p>
        <ul className="after-grid">
          {["Catálogo", "Resenhas completas", "Mapeamento olfativo", "Comparações", "Guias de perfumaria", "Ofertas de parceiros"].map(
            (t) => (
              <li key={t}>
                <span>{t}</span>
                <small>Em breve</small>
              </li>
            ),
          )}
        </ul>
        <p className="sr-only">Perfumes em destaque: {featuredPerfumes.map((p) => p.fullName).join(", ")}.</p>
      </section>

      <footer className="site-footer">
        <p>
          A Zênite é um portal editorial independente. Não vendemos perfumes. Alguns links levarão a lojas parceiras e
          poderão ser links de afiliado — eles serão sempre identificados.
        </p>
        <p>© 2026 Zênite — Perfumes Cósmicos</p>
      </footer>
    </main>
  );
}
