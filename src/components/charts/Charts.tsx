import { ACCORDS, type Profile } from "@/lib/olfactory";

/**
 * Gráficos da Zênite (HTML/CSS, renderizados no servidor).
 * - Medidor: nota 0–10 contra o máximo; um tom só.
 * - Barras de perfil: participação de cada acorde (magnitude, um tom só).
 * - Comparação: duas séries (paleta validada no fundo escuro: #1a9ccc / #a65cff),
 *   com legenda e rótulos diretos — a cor nunca é o único identificador.
 * Os valores aparecem como texto ao lado de cada barra (sem depender de cor ou hover).
 */

export interface MeterItem {
  key: string;
  label: string;
  value: number | null;
}

export function MeterList({ items, provisional, caption }: { items: MeterItem[]; provisional?: boolean; caption: string }) {
  return (
    <figure className="chart">
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className={`meters ${provisional ? "is-provisional" : ""}`}>
        {items.map((m) => (
          <li key={m.key} className="meter" tabIndex={0} data-tip={m.value === null ? `${m.label}: em avaliação` : `${m.label}: ${m.value} de 10`}>
            <span className="meter-label">{m.label}</span>
            <span className="meter-track" aria-hidden>
              {m.value !== null && <span className="meter-fill" style={{ width: `${(m.value / 10) * 100}%` }} />}
            </span>
            <span className="meter-value">{m.value === null ? "—" : m.value.toLocaleString("pt-BR")}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function ProfileBars({ profile, caption }: { profile: Profile; caption: string }) {
  const rows = ACCORDS.map((a) => ({ ...a, v: profile[a.key] }))
    .filter((r) => r.v > 0.005)
    .sort((a, b) => b.v - a.v);
  const max = Math.max(...rows.map((r) => r.v), 0.01);
  return (
    <figure className="chart">
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className="pbars">
        {rows.map((r) => {
          const pct = Math.round(r.v * 100);
          return (
            <li key={r.key} className="pbar" tabIndex={0} data-tip={`${r.label}: ${pct}% do perfil estimado`}>
              <span className="pbar-label">{r.label}</span>
              <span className="pbar-track" aria-hidden>
                <span className="pbar-fill" style={{ width: `${(r.v / max) * 100}%` }} />
              </span>
              <span className="pbar-value">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

export interface CompareRow {
  key: string;
  label: string;
  a: number | null;
  b: number | null;
}

export function CompareBars({ rows, nameA, nameB, max = 10, unit = "", caption }: { rows: CompareRow[]; nameA: string; nameB: string; max?: number; unit?: string; caption: string }) {
  const fmt = (v: number | null) => (v === null ? "—" : `${v.toLocaleString("pt-BR")}${unit}`);
  return (
    <figure className="chart">
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className="cmp-legend" aria-label="Legenda">
        <li><span className="swatch swatch-a" aria-hidden /> {nameA}</li>
        <li><span className="swatch swatch-b" aria-hidden /> {nameB}</li>
      </ul>
      <ul className="cmp-rows">
        {rows.map((r) => (
          <li key={r.key} className="cmp-row">
            <span className="cmp-label">{r.label}</span>
            <span className="cmp-bars">
              {(["a", "b"] as const).map((s) => (
                <span key={s} className="cmp-line" tabIndex={0} data-tip={`${s === "a" ? nameA : nameB} — ${r.label}: ${fmt(r[s])}`}>
                  <span className="cmp-track" aria-hidden>
                    {r[s] !== null && <span className={`cmp-fill cmp-${s}`} style={{ width: `${((r[s] as number) / max) * 100}%` }} />}
                  </span>
                  <span className="cmp-value">{fmt(r[s])}</span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
