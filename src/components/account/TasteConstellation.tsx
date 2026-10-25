import { ACCORD_COLOR } from "@/components/ui/Icons";
import { ACCORDS, normalize, NOTE_ACCORDS, type AccordKey, type Profile } from "@/lib/olfactory";

/**
 * Constelação do gosto: a pessoa é o zênite (centro). Cada acorde é uma estrela;
 * quanto mais presente no gosto, mais perto do zênite, maior e mais brilhante.
 * As notas que a pessoa ama ou pesquisa orbitam o acorde a que pertencem.
 * Duas versões (computador e celular), trocadas pelo CSS.
 */

// Ordem da roda olfativa: vizinhos parecidos ficam lado a lado.
const WHEEL: AccordKey[] = [
  "citrico",
  "verde",
  "aromatico",
  "especiado",
  "amadeirado",
  "ambarado",
  "doce",
  "frutado",
  "floral",
  "almiscarado",
];
// Pequeno desvio de distância por acorde (%), para não parecer um gráfico de radar.
const JITTER = [4, -6, 7, -3, 5, -7, 6, -4, 3, -5];

interface Variant {
  w: number;
  h: number;
  sx: number; // achatamento horizontal da órbita
  rMin: number;
  rMax: number;
  font: { lbl: number; pct: number; dim: number; note: number; you: number };
  /** No celular os rótulos ficam centralizados embaixo/em cima da estrela. */
  centered: boolean;
}
const DESK: Variant = {
  w: 640,
  h: 560,
  sx: 1.18,
  rMin: 128,
  rMax: 226,
  font: { lbl: 21, pct: 15, dim: 13, note: 14, you: 12 },
  centered: false,
};
const MOB: Variant = {
  w: 400,
  h: 520,
  sx: 0.8,
  rMin: 122,
  rMax: 200,
  font: { lbl: 19, pct: 14, dim: 12, note: 13.5, you: 11 },
  centered: true,
};

function seeded(n: number) {
  let s = 7;
  return Array.from({ length: n }, () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  });
}
const RAND = seeded(400);

export function dominantAccord(note: string): AccordKey | null {
  const w = NOTE_ACCORDS[normalize(note)];
  if (!w) return null;
  let best: AccordKey | null = null;
  let bv = 0;
  for (const [k, v] of Object.entries(w)) if ((v ?? 0) > bv) [best, bv] = [k as AccordKey, v ?? 0];
  return best;
}

type Box = { x1: number; y1: number; x2: number; y2: number };
const hit = (a: Box, b: Box) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
type Anchor = "start" | "middle" | "end";
/** Caixa aproximada de um texto (largura média de caractere ≈ 0,52 do corpo). */
function box(x: number, y: number, chars: number, size: number, anchor: Anchor): Box {
  const w = chars * size * 0.52;
  const x1 = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  return { x1: x1 - 3, y1: y - size, x2: x1 + w + 3, y2: y + size * 0.3 };
}

function layout(v: Variant, profile: Profile, notes: string[]) {
  const CX = v.w / 2;
  const CY = v.h / 2 + 4;
  const max = Math.max(...ACCORDS.map((a) => profile[a.key]), 0.0001);
  const stars = WHEEL.map((key, i) => {
    const w = profile[key];
    const rel = w / max;
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const r = (v.rMax - rel * (v.rMax - v.rMin)) * (1 + JITTER[i] / 100);
    const active = w >= 0.06;
    return {
      key,
      w,
      rel,
      a,
      x: CX + Math.cos(a) * r * v.sx,
      y: CY + Math.sin(a) * r,
      rad: active ? 3.2 + rel * 7 : 2,
      active,
      label: ACCORDS.find((c) => c.key === key)!.label,
      color: ACCORD_COLOR[key],
    };
  });
  const ranked = [...stars].filter((s) => s.active).sort((a, b) => b.w - a.w);

  // Notas em órbita: até 2 por acorde, 8 no total (sem repetir), de lado em relação ao rótulo.
  const perAccord: Record<string, number> = {};
  const sats: { n: string; host: (typeof stars)[number]; x: number; y: number }[] = [];
  for (const n of [...new Set(notes)]) {
    const k = dominantAccord(n);
    if (!k || sats.length >= 8) continue;
    const idx = (perAccord[k] = (perAccord[k] ?? 0) + 1) - 1;
    if (idx > 1) continue;
    const host = stars.find((s) => s.key === k)!;
    const a = host.a + (idx ? 1.75 : -1.75);
    const d = 30 + host.rel * 8;
    sats.push({ n, host, x: host.x + Math.cos(a) * d * Math.min(1, v.sx), y: host.y + Math.sin(a) * d });
  }

  // Rótulos sem sobreposição: os acordes mais fortes escolhem primeiro.
  const placed: Box[] = [{ x1: CX - 38, y1: CY - 30, x2: CX + 38, y2: CY + 50 }]; // zênite + nome
  for (const s of stars) placed.push({ x1: s.x - s.rad - 2, y1: s.y - s.rad - 2, x2: s.x + s.rad + 2, y2: s.y + s.rad + 2 });
  for (const s of sats) placed.push({ x1: s.x - 3, y1: s.y - 3, x2: s.x + 3, y2: s.y + 3 });
  const shiftIn = (b: Box) => (b.x1 < 2 ? 2 - b.x1 : b.x2 > v.w - 2 ? v.w - 2 - b.x2 : 0);
  const choose = (cands: { x: number; y: number; anchor: Anchor }[], chars: number, size: number) => {
    const fit = cands.map((c) => {
      const b = box(c.x, c.y, chars, size, c.anchor);
      const dx = shiftIn(b);
      return { c: { ...c, x: c.x + dx }, b: { ...b, x1: b.x1 + dx, x2: b.x2 + dx } };
    });
    const pick = fit.find((f) => !placed.some((p) => hit(p, f.b))) ?? fit[0];
    placed.push(pick.b);
    return pick.c;
  };

  const labels = new Map<string, { x: number; y: number; anchor: Anchor }>();
  for (const s of [...stars].sort((a, b) => b.w - a.w)) {
    const size = s.active ? v.font.lbl : v.font.dim;
    const chars = s.active ? s.label.length + 5 : s.label.length * 1.35; // apagados: caixa alta espaçada
    const gap = s.rad + 10;
    const down = s.y + gap + size * 0.75;
    const up = s.y - gap;
    const side = Math.cos(s.a) >= 0 ? 1 : -1;
    const beside = { x: s.x + side * gap, y: s.y + size * 0.35, anchor: (side > 0 ? "start" : "end") as Anchor };
    const other = { x: s.x - side * gap, y: s.y + size * 0.35, anchor: (side > 0 ? "end" : "start") as Anchor };
    const below = { x: s.x, y: down, anchor: "middle" as Anchor };
    const above = { x: s.x, y: up, anchor: "middle" as Anchor };
    const outward = {
      x: s.x + Math.cos(s.a) * gap * 1.1,
      y: s.y + Math.sin(s.a) * gap + (Math.sin(s.a) > 0.35 ? size * 0.7 : Math.sin(s.a) < -0.35 ? -2 : size * 0.3),
      anchor: (Math.cos(s.a) > 0.35 ? "start" : Math.cos(s.a) < -0.35 ? "end" : "middle") as Anchor,
    };
    const lower = { ...below, y: down + size };
    const cands = v.centered
      ? Math.sin(s.a) < -0.2
        ? [above, below, beside, other, lower]
        : [below, above, beside, other, lower]
      : [outward, below, above, beside, other, lower];
    labels.set(s.key, choose(cands, chars, size));
  }
  const noteLabels = sats.map((s) => {
    const right = s.x >= s.host.x;
    const f = v.font.note;
    return choose(
      [
        { x: s.x + (right ? 7 : -7), y: s.y + 4, anchor: right ? "start" : "end" },
        { x: s.x + (right ? -7 : 7), y: s.y + 4, anchor: right ? "end" : "start" },
        { x: s.x, y: s.y + f + 4, anchor: "middle" },
        { x: s.x, y: s.y - 7, anchor: "middle" },
      ],
      s.n.length,
      f,
    );
  });

  const dust = Array.from({ length: 80 }, (_, i) => ({
    x: RAND[i * 4] * v.w,
    y: RAND[i * 4 + 1] * v.h,
    o: 0.15 + RAND[i * 4 + 2] * 0.45,
    s: 0.6 + RAND[i * 4 + 3] * 1.1,
  }));
  return { CX, CY, stars, ranked, chain: ranked.slice(0, 5), sats, labels, noteLabels, dust };
}

export function TasteConstellation({
  profile,
  notes = [],
  name,
  caption,
}: {
  profile: Profile;
  notes?: string[];
  name?: string;
  /** Troca a legenda (ex.: constelação de exemplo). */
  caption?: string;
}) {
  const summary = ACCORDS.map((a) => ({ ...a, w: profile[a.key] }))
    .filter((a) => a.w >= 0.06)
    .sort((a, b) => b.w - a.w)
    .map((a) => `${a.label} ${Math.round(a.w * 100)}%`)
    .join(", ");
  const hasNotes = notes.some((n) => dominantAccord(n));
  return (
    <figure className="tc">
      <div
        role="img"
        aria-label={`${caption ? "Exemplo de constelação" : "Constelação do seu gosto"}. Mais perto do centro, mais presente: ${summary}.`}
      >
        <Sky v={DESK} profile={profile} notes={notes} name={name} className="tc-desk" />
        <Sky v={MOB} profile={profile} notes={notes} name={name} className="tc-mob" />
      </div>
      <figcaption>
        {caption ?? (
          <>
            Mais perto de você, mais presente no seu gosto.{hasNotes && " Os pontos menores são notas que você ama ou pesquisou."}
          </>
        )}
      </figcaption>
    </figure>
  );
}

function Sky({
  v,
  profile,
  notes,
  name,
  className,
}: {
  v: Variant;
  profile: Profile;
  notes: string[];
  name?: string;
  className: string;
}) {
  const L = layout(v, profile, notes);
  const id = className; // ids únicos por versão
  const { CX, CY } = L;
  return (
    <svg viewBox={`0 0 ${v.w} ${v.h}`} className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-zenith`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset=".25" stopColor="#bfefff" stopOpacity=".9" />
          <stop offset="1" stopColor="#31c7f3" stopOpacity="0" />
        </radialGradient>
        {L.stars.map((s) => (
          <radialGradient key={s.key} id={`${id}-g-${s.key}`}>
            <stop offset="0" stopColor={s.color} stopOpacity=".75" />
            <stop offset="1" stopColor={s.color} stopOpacity="0" />
          </radialGradient>
        ))}
        <linearGradient id={`${id}-ray`} x1="0" x2="1">
          <stop offset="0" stopColor="#bfefff" stopOpacity=".55" />
          <stop offset="1" stopColor="#a65cff" stopOpacity=".15" />
        </linearGradient>
      </defs>

      {L.dust.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.s}
          fill="#dfe6ff"
          opacity={d.o}
          className={i % 7 === 0 ? "tc-twinkle" : undefined}
          style={{ animationDelay: `${(i % 9) * 0.4}s` }}
        />
      ))}
      {[v.rMin, (v.rMin + v.rMax) / 2, v.rMax].map((r, i) => (
        <ellipse
          key={r}
          cx={CX}
          cy={CY}
          rx={r * v.sx}
          ry={r}
          className="tc-orbit"
          style={{ animationDelay: `${0.1 + i * 0.12}s` }}
        />
      ))}

      {/* Raios do zênite até os três acordes mais fortes, e a constelação dos cinco principais */}
      {L.ranked.slice(0, 3).map((s, i) => (
        <line
          key={s.key}
          x1={CX}
          y1={CY}
          x2={s.x}
          y2={s.y}
          stroke={`url(#${id}-ray)`}
          strokeWidth={1.2}
          className="tc-line"
          style={{ animationDelay: `${0.9 + i * 0.15}s` }}
        />
      ))}
      {L.chain.slice(1).map((s, i) => (
        <line
          key={s.key}
          x1={L.chain[i].x}
          y1={L.chain[i].y}
          x2={s.x}
          y2={s.y}
          stroke="#cfe3ff"
          strokeOpacity={0.5}
          strokeWidth={1}
          className="tc-line"
          style={{ animationDelay: `${1.3 + i * 0.18}s` }}
        />
      ))}
      {L.sats.map((s) => (
        <line
          key={`l-${s.n}`}
          x1={s.host.x}
          y1={s.host.y}
          x2={s.x}
          y2={s.y}
          stroke={s.host.color}
          strokeOpacity={0.45}
          strokeWidth={0.8}
          className="tc-line"
          style={{ animationDelay: "2.1s" }}
        />
      ))}

      {/* Zênite */}
      <g className="tc-star" style={{ animationDelay: ".2s" }}>
        <circle cx={CX} cy={CY} r={34} fill={`url(#${id}-zenith)`} className="tc-pulse" />
        <path
          d={`M${CX} ${CY - 15}L${CX + 3} ${CY - 3}L${CX + 15} ${CY}L${CX + 3} ${CY + 3}L${CX} ${CY + 15}L${CX - 3} ${CY + 3}L${CX - 15} ${CY}L${CX - 3} ${CY - 3}Z`}
          fill="#fff"
        />
        <text x={CX} y={CY + 42} textAnchor="middle" className="tc-you" fontSize={v.font.you}>
          {(name || "Você").slice(0, 16)}
        </text>
      </g>

      {/* Acordes */}
      {L.stars.map((s, i) => {
        const l = L.labels.get(s.key)!;
        return (
          <g key={s.key} className={`tc-star ${s.active ? "is-on" : "is-dim"}`} style={{ animationDelay: `${0.4 + i * 0.07}s` }}>
            {s.active && (
              <circle
                cx={s.x}
                cy={s.y}
                r={s.rad * 4.2}
                fill={`url(#${id}-g-${s.key})`}
                className="tc-glow"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            )}
            <circle cx={s.x} cy={s.y} r={s.rad} fill={s.active ? s.color : "#7d84a8"} />
            {s.active && <circle cx={s.x} cy={s.y} r={s.rad * 0.45} fill="#fff" />}
            <text
              x={l.x}
              y={l.y}
              textAnchor={l.anchor}
              className={s.active ? "tc-lbl" : "tc-lbl-dim"}
              fontSize={s.active ? v.font.lbl : v.font.dim}
              fill={s.active ? s.color : undefined}
            >
              {s.label}
              {s.active && (
                <tspan className="tc-pct" fontSize={v.font.pct}>
                  {" "}
                  {Math.round(s.w * 100)}%
                </tspan>
              )}
            </text>
          </g>
        );
      })}

      {/* Notas em órbita */}
      {L.sats.map((s, i) => {
        const l = L.noteLabels[i];
        return (
          <g key={s.n} className="tc-star" style={{ animationDelay: "2.2s" }}>
            <circle cx={s.x} cy={s.y} r={2.2} fill="#fff" />
            <text x={l.x} y={l.y} textAnchor={l.anchor} className="tc-note" fontSize={v.font.note}>
              {s.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
