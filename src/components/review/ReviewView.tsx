import Image from "next/image";
import Link from "next/link";
import { CompareBars, MeterList, ProfileBars } from "@/components/charts/Charts";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Perfume } from "@/data/types";
import { accordProfile, ACCORDS, derivedMetrics, NOTE_ACCORDS, normalize, topAccords } from "@/lib/olfactory";
import { SIMILAR_THRESHOLD, similarTo } from "@/lib/similarity";
import { bestPrice, OffersSection } from "./OffersSection";

const TIERS = [
  ["top", "Saída"],
  ["heart", "Coração"],
  ["base", "Fundo"],
] as const;

function noteAccords(note: string) {
  const w = NOTE_ACCORDS[normalize(note)];
  if (!w) return [];
  return Object.entries(w)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 2)
    .map(([k]) => ACCORDS.find((a) => a.key === k)!.label);
}

/**
 * Resenha completa. Separa claramente:
 * 1) dados do perfume (oficiais/verificáveis, com fonte e status);
 * 2) perfil estimado (cálculo transparente a partir das notas);
 * 3) avaliação editorial (provisória até o teste);
 * 4) opiniões de usuários (em breve).
 */
export function ReviewView({ perfume: p, catalog }: { perfume: Perfume; catalog: Perfume[] }) {
  const { profile, unknown } = accordProfile(p);
  const derived = derivedMetrics(profile);
  const accords = topAccords(profile, 3);
  const { close, others } = similarTo(p, catalog);
  // Alternativas mais baratas: semelhantes (afinidade ≥ 35%) com preço confirmado menor.
  const myBest = bestPrice(p)?.price ?? null;
  const cheaper =
    myBest === null
      ? []
      : close
          .map((s) => ({ s, price: bestPrice(s.perfume)?.price ?? null }))
          .filter((x): x is { s: (typeof close)[number]; price: number } => x.price !== null && x.price < myBest)
          .sort((a, b) => a.price - b.price);
  const allSources = [...(p.notes.sources ?? []), ...(p.concentration.sources ?? []), ...(p.year.sources ?? []), ...(p.perfumers.sources ?? [])].filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i,
  );

  return (
    <article className="review" aria-labelledby="review-title">
      {/* ——— Cabeçalho ——— */}
      <header className="review-hero">
        <div className="review-poster">
          {p.poster ? (
            <Image src={p.poster} alt={`Frasco do ${p.fullName}`} width={900} height={1100} priority />
          ) : (
            <span className="poster-empty" aria-hidden>
              ✦
            </span>
          )}
        </div>
        <div className="review-head">
          <p className="eyebrow">
            <span>Resenha</span> {p.universe}
          </p>
          <h1 id="review-title" className="stage-title">
            {p.fullName}
          </h1>
          <ul className="chips" aria-label="Acordes predominantes (estimados)">
            {accords.map((a) => (
              <li key={a.key}>{a.label}</li>
            ))}
          </ul>
          <p className="stage-lead">{p.intro.value}</p>
          <p className="data-note">
            <StatusBadge status={p.intro.status} note={p.intro.note} /> <span>{p.intro.note}</span>
          </p>
          <nav className="review-toc" aria-label="Nesta resenha">
            <a href="#dados">Dados</a>
            <a href="#piramide">Pirâmide</a>
            <a href="#perfil">Perfil olfativo</a>
            <a href="#avaliacao">Avaliação</a>
            <a href="#semelhantes">Semelhantes</a>
            <a href="#ofertas">Ofertas</a>
          </nav>
        </div>
      </header>

      <aside className="status-legend" aria-label="Como ler os selos">
        <StatusBadge status="verificado" /> confirmado em fonte citada · <StatusBadge status="a-confirmar" /> fontes divergem ou falta fonte oficial ·{" "}
        <StatusBadge status="provisorio" /> conteúdo editorial ainda não testado
      </aside>

      {/* ——— 1. Dados do perfume ——— */}
      <section id="dados" className="review-section" aria-labelledby="dados-t">
        <h2 id="dados-t">Dados do perfume</h2>
        <dl className="spec-grid review-specs">
          <div>
            <dt>Marca</dt>
            <dd>{p.brand}</dd>
          </div>
          <div>
            <dt>Nome oficial</dt>
            <dd>{p.fullName}</dd>
          </div>
          <div>
            <dt>Concentração</dt>
            <dd>
              {p.concentration.value} <StatusBadge status={p.concentration.status} note={p.concentration.note} />
            </dd>
          </div>
          <div>
            <dt>Ano de lançamento</dt>
            <dd>
              {p.year.value ?? "Não confirmado"} <StatusBadge status={p.year.status} note={p.year.note} />
            </dd>
          </div>
          <div>
            <dt>Perfumista</dt>
            <dd>
              {p.perfumers.value?.join(", ") ?? "Não divulgado"} <StatusBadge status={p.perfumers.status} note={p.perfumers.note} />
            </dd>
          </div>
          <div>
            <dt>Público</dt>
            <dd>
              {p.gender.value} <StatusBadge status={p.gender.status} note={p.gender.note} />
            </dd>
          </div>
          <div className="span-2">
            <dt>Família olfativa</dt>
            <dd>
              {p.family.value} <StatusBadge status={p.family.status} note={p.family.note} />
            </dd>
          </div>
        </dl>
      </section>

      {/* ——— Pirâmide ——— */}
      <section id="piramide" className="review-section" aria-labelledby="piramide-t">
        <h2 id="piramide-t">Pirâmide olfativa</h2>
        <div className="pyramid review-pyramid">
          {TIERS.map(([tier, label]) => (
            <div key={tier} className="pyramid-row">
              <h3>{label}</h3>
              <ul className="note-list">
                {p.notes.value[tier].map((n) => (
                  <li key={n}>
                    <span className="note-name">{n}</span>
                    {noteAccords(n).length > 0 && <span className="note-acc">{noteAccords(n).join(" · ")}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="data-note">
          <StatusBadge status={p.notes.status} note={p.notes.note} /> <span>{p.notes.note}</span>
        </p>
        <h3 className="review-h3">Evolução olfativa</h3>
        <ol className="evolution">
          {p.evolution.value.map((e) => (
            <li key={e.phase}>
              <strong>{e.phase}</strong> {e.text}
            </li>
          ))}
        </ol>
        <p className="data-note">
          <StatusBadge status={p.evolution.status} note={p.evolution.note} /> <span>{p.evolution.note}</span>
        </p>
      </section>

      {/* ——— 2. Perfil estimado ——— */}
      <section id="perfil" className="review-section" aria-labelledby="perfil-t">
        <h2 id="perfil-t">Perfil olfativo estimado</h2>
        <p className="review-method">
          Calculado a partir da pirâmide declarada: cada nota é classificada em acordes e as notas de fundo pesam um pouco mais, por durarem mais na pele. É uma
          estimativa, não uma avaliação sensorial.
        </p>
        <div className="review-two">
          <div>
            <h3 className="review-h3">Acordes</h3>
            <ProfileBars profile={profile} caption={`Participação de cada acorde no perfil estimado do ${p.fullName}`} />
          </div>
          <div>
            <h3 className="review-h3">Características (0–10)</h3>
            <MeterList items={derived} caption={`Doçura, frescor, presença amadeirada e especiada estimadas do ${p.fullName}`} />
            {unknown.length > 0 && <p className="data-note">Notas ainda sem classificação: {unknown.join(", ")}.</p>}
          </div>
        </div>
      </section>

      {/* ——— 3. Avaliação editorial ——— */}
      <section id="avaliacao" className="review-section" aria-labelledby="avaliacao-t">
        <h2 id="avaliacao-t">
          Avaliação editorial <StatusBadge status={p.performance.status} note={p.performance.note} />
        </h2>
        <p className="review-method">{p.performance.note}</p>
        <div className="review-two">
          <div>
            <h3 className="review-h3">Desempenho (0–10)</h3>
            <MeterList items={p.performance.value} provisional={p.performance.status === "provisorio"} caption={`Desempenho do ${p.fullName}`} />
          </div>
          <div className="review-when">
            <h3 className="review-h3">Estações</h3>
            <ul className="chips">
              {p.seasons.value.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3 className="review-h3">Ocasiões</h3>
            <ul className="chips">
              {p.occasions.value.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="verdict-head review-verdict">
          <div className="rating-ring" aria-label={p.verdict.rating.value === null ? "Nota editorial em avaliação" : `Nota ${p.verdict.rating.value} de 10`}>
            <svg viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r="44" className="ring-bg" />
              <circle cx="50" cy="50" r="44" className="ring-fg" pathLength={1} style={{ ["--r" as string]: (p.verdict.rating.value ?? 0) / 10, strokeDashoffset: 0 }} />
            </svg>
            <span className="rating-num">{p.verdict.rating.value ?? "—"}</span>
          </div>
          <div>
            <h3 className="review-h3 !mt-0">Nota editorial</h3>
            <p className="text-[var(--z-muted)]">{p.verdict.rating.note}</p>
          </div>
        </div>
        <div className="pros-cons">
          <div>
            <h3>Pontos positivos</h3>
            <ul>
              {p.verdict.pros.value.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Pontos de atenção</h3>
            <ul>
              {p.verdict.cons.value.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="profile">
          <h3>Perfil recomendado</h3>
          <p>{p.verdict.profile.value}</p>
        </div>
        <h3 className="review-h3">Opiniões de usuários</h3>
        <p className="text-[var(--z-muted)]">Em breve. Opiniões de visitantes aparecerão aqui, separadas da avaliação editorial.</p>
      </section>

      {/* ——— Semelhantes ——— */}
      <section id="semelhantes" className="review-section" aria-labelledby="semelhantes-t">
        <h2 id="semelhantes-t">Perfumes semelhantes</h2>
        <p className="review-method">
          Comparação automática por acordes, notas em comum, estações e ocasiões. Indica afinidade de perfil — não que os perfumes sejam iguais.
        </p>
        {close.length === 0 && (
          <p className="text-[var(--z-muted)]">Nenhum perfume do catálogo atual tem perfil próximo o suficiente (afinidade de 35% ou mais).</p>
        )}
        <ul className="similar-list">
          {[...close, ...others].map((s) => {
            const pr = accordProfile(s.perfume).profile;
            return (
              <li key={s.perfume.slug} className={`similar-card ${s.score >= SIMILAR_THRESHOLD ? "is-close" : ""}`}>
                <div className="similar-head">
                  <Link href={`/perfumes/${s.perfume.slug}`} className="similar-name">
                    {s.perfume.fullName}
                  </Link>
                  <span className="similar-score">
                    Afinidade {Math.round(s.score * 100)}%{s.score < SIMILAR_THRESHOLD ? " · pouca semelhança" : ""}
                  </span>
                </div>
                <p>{s.reason}</p>
                <CompareBars
                  nameA={p.name}
                  nameB={s.perfume.name}
                  caption={`Características estimadas: ${p.name} e ${s.perfume.name}`}
                  rows={derivedMetrics(profile).map((m, i) => ({ key: m.key, label: m.label, a: m.value, b: derivedMetrics(pr)[i].value }))}
                />
                <Link href={`/comparar?a=${p.slug}&b=${s.perfume.slug}`} className="btn-ghost inline-block mt-3">
                  Comparar em detalhe
                </Link>
              </li>
            );
          })}
        </ul>
        <h3 className="review-h3">Alternativas mais baratas</h3>
        {cheaper.length ? (
          <ul className="cheaper-list">
            {cheaper.map(({ s, price }) => (
              <li key={s.perfume.slug}>
                <Link href={`/perfumes/${s.perfume.slug}`}>{s.perfume.fullName}</Link> — a partir de{" "}
                {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}, afinidade {Math.round(s.score * 100)}%
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--z-muted)]">
            {myBest
              ? "Nenhum perfume com perfil próximo tem preço confirmado menor no momento."
              : "Só sugerimos alternativas quando há preço confirmado deste perfume e do semelhante."}
          </p>
        )}
      </section>

      <OffersSection perfume={p} />

      {allSources.length > 0 && (
        <section className="review-section" aria-labelledby="fontes-t">
          <h2 id="fontes-t">Fontes</h2>
          <ul className="sources">
            {allSources.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="nofollow noopener" target="_blank">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
