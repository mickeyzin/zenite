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
    </main>
  );
}
