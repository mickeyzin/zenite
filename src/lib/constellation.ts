/**
 * Layout da pirâmide como constelação: o zênite no alto, saída logo abaixo,
 * coração no meio e fundo embaixo. Posições em % do quadro; levemente
 * irregulares (sorteadas pelo nome da nota, sempre iguais) para parecer céu.
 */
export type Tier = "top" | "heart" | "base";

export interface Star {
  note: string;
  tier: Tier;
  x: number; // %
  y: number; // %
  order: number; // ordem de acendimento
  row: number; // linha dentro da faixa
}

export interface Layout {
  stars: Star[];
  zenith: { x: number; y: number };
  edges: [number, number][]; // índices em stars; -1 = zênite
  tierY: Record<Tier, number>; // centro de cada faixa, em %
  tierTop: Record<Tier, number>; // início de cada faixa (onde fica o rótulo), em %
  units: number; // altura relativa (para o CSS)
}

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};

export function layoutConstellation(notes: Record<Tier, string[]>, cols: number, labelSpace = 0): Layout {
  const tiers: Tier[] = ["top", "heart", "base"];
  const ZENITH = 0.9; // espaço do zênite (em linhas)
  const GAP = 0.35; // respiro entre faixas
  const rowsOf = (t: Tier) => Math.max(1, Math.ceil(notes[t].length / cols));
  const BOTTOM = 0.45; // espaço para os nomes da última linha
  const units = ZENITH + tiers.reduce((s, t) => s + rowsOf(t) + labelSpace, 0) + GAP * (tiers.length - 1) + BOTTOM;

  const stars: Star[] = [];
  const tierY = {} as Record<Tier, number>;
  const tierTop = {} as Record<Tier, number>;
  let cursor = ZENITH;
  let order = 0;
  for (const t of tiers) {
    const list = notes[t];
    const rows = rowsOf(t);
    tierTop[t] = (cursor / units) * 100;
    cursor += labelSpace;
    tierY[t] = ((cursor + rows / 2) / units) * 100;
    for (let r = 0; r < rows; r++) {
      const inRow = list.slice(r * cols, (r + 1) * cols);
      inRow.forEach((note, i) => {
        const jx = (hash(note) - 0.5) * (60 / Math.max(inRow.length, 2)) * 0.35;
        const jy = (hash(note + "y") - 0.5) * 0.28;
        // Linhas alternam um pequeno deslocamento para não ficarem em grade.
        const shift = r % 2 ? 0.5 / Math.max(inRow.length, 1) : 0;
        const x = ((i + 0.5) / inRow.length) * 100 * (inRow.length < cols ? 0.86 : 0.92) + (inRow.length < cols ? 7 : 4) + jx;
        stars.push({ note, tier: t, x: Math.min(92, Math.max(8, x + shift * 20)), y: ((cursor + r + 0.5 + jy) / units) * 100, order: order++, row: r });
      });
    }
    cursor += rows + GAP;
  }

  // Ligações: em cada faixa, da esquerda para a direita; entre faixas, o par mais próximo;
  // do zênite até a estrela de saída mais próxima.
  const edges: [number, number][] = [];
  const idx = (t: Tier) => stars.map((s, i) => ({ s, i })).filter((x) => x.s.tier === t);
  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, (a.y - b.y) * 1.6);
  for (const t of tiers) {
    const group = idx(t);
    const rowCount = Math.max(0, ...group.map((g) => g.s.row + 1));
    // ordem "em serpentina" dentro da faixa, para um traço contínuo
    const chain = Array.from({ length: rowCount }, (_, r) => {
      const row = group.filter((g) => g.s.row === r).sort((a, b) => a.s.x - b.s.x);
      return r % 2 ? row.reverse() : row;
    }).flat();
    for (let k = 1; k < chain.length; k++) edges.push([chain[k - 1].i, chain[k].i]);
  }
  const zenith = { x: 50, y: (ZENITH * 0.45 / units) * 100 };
  const nearest = (from: { x: number; y: number }, t: Tier) => {
    let best = -1;
    let bd = Infinity;
    for (const c of idx(t)) {
      const d = dist(from, c.s);
      if (d < bd) [bd, best] = [d, c.i];
    }
    return best;
  };
  if (stars.length) {
    const top = nearest(zenith, "top");
    if (top >= 0) edges.push([-1, top]);
    for (const [a, b] of [["top", "heart"], ["heart", "base"]] as [Tier, Tier][]) {
      let best: [number, number] | null = null;
      let bd = Infinity;
      for (const x of idx(a)) for (const y of idx(b)) {
        const d = dist(x.s, y.s);
        if (d < bd) { bd = d; best = [x.i, y.i]; }
      }
      if (best) edges.push(best);
    }
  }
  // Sem ligações repetidas.
  const seen = new Set<string>();
  const unique = edges.filter(([a, b]) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(k) || a === b) return false;
    seen.add(k);
    return true;
  });
  return { stars, zenith, edges: unique, tierY, tierTop, units };
}
