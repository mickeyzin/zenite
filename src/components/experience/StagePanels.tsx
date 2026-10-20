import type { Perfume } from "@/data/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";

/**
 * Conteúdo editorial das quatro etapas. É HTML real renderizado no servidor,
 * portanto indexável e legível mesmo sem WebGL. No modo cinematográfico o GSAP
 * anima cada painel; no modo estático eles aparecem empilhados.
 */
export function StagePanels({ perfume, index = 0 }: { perfume: Perfume; index?: number }) {
  const p = perfume;
  const id = (k: string) => `${p.slug}-${k}`;
  const v = p.verdict;
  return (
    <>
      {/* ETAPA 1 — FRENTE */}
      <article className="stage-panel side-left" data-stage="0" data-perfume={index} aria-labelledby={id("st1-title")}>
        <p className="eyebrow" data-reveal>
          <span>01</span> Visão frontal
        </p>
        <h2 id={id("st1-title")} className="stage-title" data-reveal>
          <span className="block text-[0.42em] tracking-[0.32em] uppercase font-sans font-medium text-[var(--z-cyan)] mb-3">
            {p.line ?? p.brand}
          </span>
          {p.name}
        </h2>
        <dl className="spec-grid" data-reveal>
          <div>
            <dt>Marca</dt>
            <dd>{p.brand}</dd>
          </div>
          <div>
            <dt>Concentração</dt>
            <dd>{p.concentration.value}</dd>
          </div>
          {p.perfumers.value && (
            <div>
              <dt>Perfumistas</dt>
              <dd>{p.perfumers.value.join(", ")}</dd>
            </div>
          )}
          <div>
            <dt>Família olfativa</dt>
            <dd>
              {p.family.value} <StatusBadge status={p.family.status} note={p.family.note} />
            </dd>
          </div>
        </dl>
        <p className="stage-lead" data-reveal>
          {p.intro.value}
        </p>
        <p className="data-note" data-reveal>
          <StatusBadge status={p.intro.status} note={p.intro.note} /> <span className="data-note-text">{p.intro.note}</span>
        </p>
      </article>

      {/* ETAPA 2 — PERFIL */}
      <article className="stage-panel side-right" data-stage="1" data-perfume={index} aria-labelledby={id("st2-title")}>
        <p className="eyebrow" data-reveal>
          <span>02</span> Visão lateral
        </p>
        <h2 id={id("st2-title")} className="stage-title" data-reveal>
          Pirâmide olfativa
        </h2>
        <div className="pyramid" data-reveal>
          {(
            [
              ["Saída", p.notes.value.top],
              ["Coração", p.notes.value.heart],
              ["Fundo", p.notes.value.base],
            ] as const
          ).map(([label, notes]) => (
            <div key={label} className="pyramid-row">
              <h3>{label}</h3>
              <ul>
                {notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ol className="evolution" data-reveal>
          {p.evolution.value.map((e) => (
            <li key={e.phase}>
              <strong>{e.phase}</strong> {e.text}
            </li>
          ))}
        </ol>
        <p className="data-note" data-reveal>
          <StatusBadge status={p.notes.status} note={p.notes.note} /> <span className="data-note-text">{p.notes.note}</span>
        </p>
      </article>

      {/* ETAPA 3 — VERSO */}
      <article className="stage-panel side-left" data-stage="2" data-perfume={index} aria-labelledby={id("st3-title")}>
        <p className="eyebrow" data-reveal>
          <span>03</span> Visão posterior
        </p>
        <h2 id={id("st3-title")} className="stage-title" data-reveal>
          Desempenho
        </h2>
        <ul className="metrics" data-reveal>
          {p.performance.value.map((m) => (
            <li key={m.key} className={p.performance.status === "provisorio" ? "is-provisional" : ""}>
              <span className="metric-label">{m.label}</span>
              <span className="metric-track" aria-hidden>
                <span className="metric-fill" data-metric={m.value ?? 0} style={{ ["--v" as string]: (m.value ?? 0) / 10 }} />
              </span>
              <span className="metric-value">{m.value === null ? "—" : `${m.value}/10`}</span>
            </li>
          ))}
        </ul>
        <div className="chip-groups" data-reveal>
          <div>
            <h3>Estações</h3>
            <ul className="chips">
              {p.seasons.value.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Ocasiões</h3>
            <ul className="chips">
              {p.occasions.value.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="data-note" data-reveal>
          <StatusBadge status={p.performance.status} note={p.performance.note} /> <span className="data-note-text">{p.performance.note}</span>
        </p>
      </article>

      {/* ETAPA 4 — PERSPECTIVA */}
      <article className="stage-panel side-right" data-stage="3" data-perfume={index} aria-labelledby={id("st4-title")}>
        <p className="eyebrow" data-reveal>
          <span>04</span> Perspectiva
        </p>
        <div className="verdict-head" data-reveal>
          <div className="rating-ring" aria-label={v.rating.value === null ? "Nota editorial em avaliação" : `Nota ${v.rating.value} de 10`}>
            <svg viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r="44" className="ring-bg" />
              <circle cx="50" cy="50" r="44" className="ring-fg" pathLength={1} style={{ ["--r" as string]: (v.rating.value ?? 0) / 10 }} />
            </svg>
            <span className="rating-num">{v.rating.value ?? "—"}</span>
          </div>
          <div>
            <h2 id={id("st4-title")} className="stage-title !text-[clamp(1.9rem,3.2vw,3rem)]">
              Avaliação editorial
            </h2>
            <p className="text-sm text-[var(--z-muted)]">{v.rating.note}</p>
          </div>
        </div>
        <div className="pros-cons" data-reveal>
          <div>
            <h3>Pontos positivos</h3>
            <ul>
              {v.pros.value.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Pontos de atenção</h3>
            <ul>
              {v.cons.value.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="profile" data-reveal>
          <h3>Perfil recomendado</h3>
          <p>{v.profile.value}</p>
          <div className="profile-similar">
          <h3 className="mt-4">Perfumes semelhantes</h3>
          {v.similar.value.length ? (
            <ul>
              {v.similar.value.map((s) => (
                <li key={s.name}>
                  <strong>{s.name}</strong> — {s.reason}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--z-muted)]">{v.similar.note}</p>
          )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4" data-reveal>
          <Link href={`/perfumes/${p.slug}`} className="btn-primary">
            Ler resenha completa
            <span aria-hidden>→</span>
          </Link>
          <StatusBadge status={v.pros.status} note="Conteúdo editorial provisório" />
        </div>
      </article>
    </>
  );
}
