import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewView } from "@/components/review/ReviewView";
import { getPerfumeBySlug, getPerfumes } from "@/data/catalog";

export async function generateStaticParams() {
  return (await getPerfumes()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/perfumes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPerfumeBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.fullName} — resenha`,
    description: `Resenha do ${p.fullName}: pirâmide olfativa, perfil estimado, desempenho, perfumes semelhantes e ofertas.`,
    openGraph: p.poster ? { images: [p.poster] } : undefined,
    alternates: { canonical: `/perfumes/${p.slug}` },
  };
}

export default async function PerfumePage({ params }: PageProps<"/perfumes/[slug]">) {
  const { slug } = await params;
  const p = await getPerfumeBySlug(slug);
  if (!p) notFound();

  // Dados estruturados: só o que é verificável (sem nota agregada inventada).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.fullName,
    brand: { "@type": "Brand", name: p.brand },
    category: "Perfume",
    description: p.intro.value,
    ...(p.poster ? { image: p.poster } : {}),
  };

  return (
    <main id="conteudo" className="review-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReviewView perfume={p} catalog={await getPerfumes()} />
    </main>
  );
}
