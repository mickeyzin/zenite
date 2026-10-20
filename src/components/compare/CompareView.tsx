"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CompareBars } from "@/components/charts/Charts";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Perfume } from "@/data/types";
import { accordProfile, ACCORDS, derivedMetrics, normalize } from "@/lib/olfactory";
import { compare, SIMILAR_THRESHOLD } from "@/lib/similarity";

const TIERS = [
  ["top", "Saída"],
  ["heart", "Coração"],
  ["base", "Fundo"],
] as const;

/** Comparação lado a lado. A seleção fica na URL (?a=…&b=…). */
export function CompareView({ perfumes }: { perfumes: Perfume[] }) {
  const [sel, setSel] = useState({ a: perfumes[0].slug, b: perfumes[1]?.slug ?? perfumes[0].slug });

  useEffect(() => {
    const src = window.location.search || (window.location.hash.includes("=") ? "?" + window.location.hash.slice(1) : "");
    const u = new URLSearchParams(src);
    const a = u.get("a");
    const b = u.get("b");
    const ok = (s: string | null) => !!s && perfumes.some((p) => p.slug === s);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ok(a) || ok(b)) setSel((s) => ({ a: ok(a) ? a! : s.a, b: ok(b) ? b! : s.b }));
  }, [perfumes]);

  useEffect(() => {
    const url = `${window.location.pathname}?a=${sel.a}&b=${sel.b}`;
    if (url !== window.location.pathname + window.location.search) window.history.replaceState(null, "", url);
  }, [sel]);

  const A = perfumes.find((p) => p.slug === sel.a)!;
  const B = perfumes.find((p) => p.slug === sel.b)!;
  const data = useMemo(() => {
    const pa = accordProfile(A).profile;
    const pb = accordProfile(B).profile;
    const da = derivedMetrics(pa);
    const db = derivedMetrics(pb);
    const accRows = ACCORDS.map((x) => ({ key: x.key, label: x.label, a: Math.round(pa[x.key] * 100), b: Math.round(pb[x.key] * 100) })).filter((r) => r.a + r.b > 0);
    const maxAcc = Math.max(...accRows.flatMap((r) => [r.a, r.b]), 10);
    return {
      sim: compare(A, B),
      derived: da.map((m, i) => ({ key: m.key, label: m.label, a: m.value, b: db[i].value })),
      perf: A.performance.value.map((m, i) => ({ key: m.key, label: m.label, a: m.value, b: B.performance.value[i]?.value ?? null })),
      accRows,
      maxAcc,
    };
  }, [A, B]);
  const shared = new Set(data.sim.sharedNotes.map(normalize));
  const same = A.slug === B.slug;

  return (
    <div className="compare">
      <form className="compare-pick" onSubmit={(e) => e.preventDefault()}>
        {(["a", "b"] as const).map((k) => (
          <div key={k} className="catalog-field">
            <label htmlFor={`cmp-${k}`}>
              <span className={`swatch swatch-${k}`} aria-hidden /> Perfume {k === "a" ? "1" : "2"}
            </label>
            <select id={`cmp-${k}`} value={sel[k]} onChange={(e) => setSel((s) => ({ ...s, [k]: e.target.value }))}>
              {perfumes.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </div>
        ))}
      </form>
      {same && <p className="text-[var(--z-muted)]">Escolha dois perfumes diferentes para comparar.</p>}

      <section className="review-section" aria-labelledby="cmp-afinidade">
        <h2 id="cmp-afinidade">Afinidade {Math.round(data.sim.score * 100)}%</h2>
        <p className="similar-score">{data.sim.score >= SIMILAR_THRESHOLD ? "Perfis próximos" : "Pouca semelhança"}</p>
        <p className="review-method">{data.sim.reason}</p>
      </section>

      <section className="review-section" aria-labelledby="cmp-dados">
        <h2 id="cmp-dados">Dados</h2>
        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Campo</span>
                </th>
                <th scope="col">
                  <Link href={`/perfumes/${A.slug}`}>{A.fullName}</Link>
                </th>
                <th scope="col">
                  <Link href={`/perfumes/${B.slug}`}>{B.fullName}</Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Marca", (p: Perfume) => p.brand, null],
                  ["Concentração", (p: Perfume) => p.concentration.value, (p: Perfume) => p.concentration.status],
                  ["Ano", (p: Perfume) => p.year.value ?? "Não confirmado", (p: Perfume) => p.year.status],
                  ["Família", (p: Perfume) => p.family.value, (p: Perfume) => p.family.status],
                  ["Público", (p: Perfume) => p.gender.value, (p: Perfume) => p.gender.status],
                  ["Estações", (p: Perfume) => p.seasons.value.join(", "), (p: Perfume) => p.seasons.status],
                  ["Ocasiões", (p: Perfume) => p.occasions.value.join(", "), (p: Perfume) => p.occasions.status],
                ] as const
              ).map(([label, get, status]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {[A, B].map((p) => (
                    <td key={p.slug}>
                      {get(p)} {status && <StatusBadge status={status(p)} />}
                    </td>
                  ))}
                </tr>
              ))}
              {TIERS.map(([tier, label]) => (
                <tr key={tier}>
                  <th scope="row">Notas de {label.toLowerCase()}</th>
                  {[A, B].map((p) => (
                    <td key={p.slug}>
                      <ul className="cmp-notes">
                        {p.notes.value[tier].map((n) => (
                          <li key={n} className={shared.has(normalize(n)) && !same ? "is-shared" : ""}>
                            {n}
                            {shared.has(normalize(n)) && !same && <span className="sr-only"> (em comum)</span>}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="data-note">Notas destacadas aparecem nos dois perfumes.</p>
      </section>

      <section className="review-section" aria-labelledby="cmp-perfil">
        <h2 id="cmp-perfil">Perfil olfativo estimado</h2>
        <p className="review-method">Calculado a partir das notas declaradas. Estimativa, não avaliação sensorial.</p>
        <div className="review-two">
          <div>
            <h3 className="review-h3">Acordes (% do perfil)</h3>
            <CompareBars rows={data.accRows} nameA={A.name} nameB={B.name} max={data.maxAcc} unit="%" caption="Participação de cada acorde no perfil estimado" />
          </div>
          <div>
            <h3 className="review-h3">Características (0–10)</h3>
            <CompareBars rows={data.derived} nameA={A.name} nameB={B.name} caption="Doçura, frescor, presença amadeirada e especiada estimadas" />
          </div>
        </div>
      </section>

      <section className="review-section" aria-labelledby="cmp-perf">
        <h2 id="cmp-perf">
          Desempenho <StatusBadge status="provisorio" note="Valores ilustrativos até o teste editorial" />
        </h2>
        <p className="review-method">Valores ilustrativos até o teste editorial — não use para decidir.</p>
        <CompareBars rows={data.perf} nameA={A.name} nameB={B.name} caption="Desempenho (provisório)" />
      </section>
    </div>
  );
}
