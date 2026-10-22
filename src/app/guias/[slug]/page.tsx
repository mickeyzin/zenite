import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GuideBody } from "@/components/guides/GuideBody";
import { getPerfumes } from "@/data/catalog";
import { getGuide, GUIDES } from "@/data/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guias/[slug]">): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return { title: g.title, description: g.description, alternates: { canonical: `/guias/${g.slug}` }, openGraph: { type: "article" } };
}

export default function GuidePage(props: PageProps<"/guias/[slug]">) {
  return (
    <main id="conteudo" className="catalog-page guide-page">
      <Suspense fallback={<p className="review-loading">Carregando guia…</p>}>
        <GuideArticle params={props.params} />
      </Suspense>
    </main>
  );
}

async function GuideArticle({ params }: Pick<PageProps<"/guias/[slug]">, "params">) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const catalog = await getPerfumes();
  const date = new Date(`${g.updated}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    dateModified: g.updated,
    author: { "@type": "Organization", name: "Zênite" },
    publisher: { "@type": "Organization", name: "Zênite — Perfumes Cósmicos" },
  };
  // Outros guias, sem repetir os que já estão nos links relacionados.
  const others = GUIDES.filter((x) => x.slug !== g.slug && !g.related.some((r) => r.href === `/guias/${x.slug}`));
  return (
    <article className="guide" aria-labelledby="guide-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">
        <span>✦</span> <Link href="/guias">Guias</Link>
      </p>
      <h1 id="guide-title" className="stage-title">
        {g.title}
      </h1>
      <p className="guide-lead">{g.description}</p>
      <p className="guide-meta">
        Conteúdo editorial da Zênite · {g.minutes} min de leitura · atualizado em {date}
      </p>
      <GuideBody guide={g} catalog={catalog} />
      <aside className="guide-related" aria-label="Continue">
        <h2>Continue</h2>
        <ul>
          {g.related.map((r) => (
            <li key={r.href}>
              <Link href={r.href}>{r.label} →</Link>
            </li>
          ))}
          {others.slice(0, 2).map((o) => (
            <li key={o.slug}>
              <Link href={`/guias/${o.slug}`}>{o.title} →</Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
