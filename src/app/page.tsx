import { CinematicExperience } from "@/components/experience/CinematicExperience";
import { HomeTrail } from "@/components/trail/HomeTrail";
import { getFeatured } from "@/data/catalog";

export default async function Home() {
  const featured = await getFeatured();
  return (
    <main id="conteudo">
      <CinematicExperience perfumes={featured} />

      <HomeTrail />

      <p className="sr-only">Perfumes em destaque: {featured.map((p) => p.fullName).join(", ")}.</p>
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
