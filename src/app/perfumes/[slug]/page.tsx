import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { featuredPerfumes, getPerfume } from "@/data/perfumes";

export function generateStaticParams() {
  return featuredPerfumes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/perfumes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPerfume(slug);
  if (!p) return {};
  return {
    title: `${p.fullName} — resenha`,
    description: `Resenha do ${p.fullName}: pirâmide olfativa, desempenho e perfil recomendado.`,
    alternates: { canonical: `/perfumes/${p.slug}` },
  };
}

/**
 * Versão de primeira fase da resenha completa: o conteúdo disponível, sem
 * depender de WebGL. A página completa (gráficos, comparações, ofertas) chega
 * na Fase 5.
 */
export default async function PerfumePage({ params }: PageProps<"/perfumes/[slug]">) {
  const { slug } = await params;
  const p = getPerfume(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.fullName,
    brand: { "@type": "Brand", name: p.brand },
    category: "Perfume",
    description: p.intro.value,
  };

  return (
    <main id="conteudo" className="review">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] items-center">
        <Image src={p.poster} alt={`Frasco do ${p.fullName}`} width={900} height={1100} priority className="w-full h-auto" />
        <div>
          <p className="eyebrow">
            <span>Resenha</span> {p.brand}
          </p>
          <h1 className="stage-title mt-4">{p.fullName}</h1>
          <dl className="spec-grid mt-8">
            <div><dt>Concentração</dt><dd>{p.concentration.value} <StatusBadge status={p.concentration.status} /></dd></div>
            <div><dt>Ano</dt><dd>{p.year.value ?? "—"} <StatusBadge status={p.year.status} note={p.year.note} /></dd></div>
            <div><dt>Público</dt><dd>{p.gender.value} <StatusBadge status={p.gender.status} note={p.gender.note} /></dd></div>
            <div><dt>Família olfativa</dt><dd>{p.family.value} <StatusBadge status={p.family.status} note={p.family.note} /></dd></div>
          </dl>
          <p className="stage-lead mt-6">{p.intro.value}</p>
        </div>
      </div>

      <section>
        <h2>Pirâmide olfativa</h2>
        <div className="pyramid max-w-2xl">
          {([["Saída", p.notes.value.top], ["Coração", p.notes.value.heart], ["Fundo", p.notes.value.base]] as const).map(([l, n]) => (
            <div key={l} className="pyramid-row"><h3>{l}</h3><ul>{n.map((x) => <li key={x}>{x}</li>)}</ul></div>
          ))}
        </div>
        <p className="data-note mt-4"><StatusBadge status={p.notes.status} /> {p.notes.note}</p>
        {p.notes.sources && (
          <p className="data-note mt-2">
            Fontes: {p.notes.sources.map((s, i) => (
              <span key={s.url}>{i > 0 && " · "}<a className="underline" href={s.url} rel="nofollow noopener" target="_blank">{s.label}</a></span>
            ))}
          </p>
        )}
      </section>

      <section>
        <h2>Desempenho</h2>
        <ul className="metrics max-w-xl">
          {p.performance.value.map((m) => (
            <li key={m.key} className={p.performance.status === "provisorio" ? "is-provisional" : ""}>
              <span className="metric-label">{m.label}</span>
              <span className="metric-track" aria-hidden><span className="metric-fill" style={{ ["--v" as string]: (m.value ?? 0) / 10 }} /></span>
              <span className="metric-value">{m.value ?? "—"}</span>
            </li>
          ))}
        </ul>
        <p className="data-note mt-4"><StatusBadge status={p.performance.status} /> {p.performance.note}</p>
      </section>

      <section>
        <h2>Ofertas</h2>
        <p className="text-[var(--z-muted)]">As ofertas de lojas parceiras serão adicionadas quando houver links de afiliado válidos e preços verificados.</p>
      </section>
    </main>
  );
}
