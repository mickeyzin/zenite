import type { Perfume } from "@/data/types";
import { ACCORDS, accordProfile, allNotes, normalize, type AccordKey, type Profile } from "./olfactory";

/**
 * Semelhança entre perfumes, com justificativa em texto.
 *
 * Pontuação (0–1):
 *   55% perfil de acordes · 35% notas em comum (Jaccard)
 *    5% estações em comum ·  5% ocasiões em comum (ainda provisórias, pesam pouco)
 *
 * Perfil de acordes: sobreposição das distribuições (soma dos mínimos). Como
 * quase todo perfume tem algo cítrico, floral ou amadeirado, só conta o que
 * passa de uma sobreposição "comum" de 45%.
 *
 * Regra editorial: nunca afirmar que dois perfumes são idênticos. O texto fala
 * em "pode agradar" e aponta o que muda.
 */
export const SIMILAR_THRESHOLD = 0.35;

const BASELINE_OVERLAP = 0.45;
const accordAffinity = (a: Profile, b: Profile) => {
  let overlap = 0;
  for (const { key } of ACCORDS) overlap += Math.min(a[key], b[key]);
  return Math.max(0, Math.min(1, (overlap - BASELINE_OVERLAP) / (1 - BASELINE_OVERLAP)));
};

const jaccard = (a: string[], b: string[]) => {
  const A = new Set(a.map(normalize));
  const B = new Set(b.map(normalize));
  const inter = [...A].filter((x) => B.has(x)).length;
  const uni = new Set([...A, ...B]).size;
  return uni ? inter / uni : 0;
};

const label = (k: AccordKey) => ACCORDS.find((a) => a.key === k)!.label.toLowerCase();

const listPt = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;

export interface Similar {
  perfume: Perfume;
  score: number;
  sharedNotes: string[];
  reason: string;
}

export function compare(base: Perfume, other: Perfume): Similar {
  const pa = accordProfile(base).profile;
  const pb = accordProfile(other).profile;
  const notesA = allNotes(base);
  const notesB = allNotes(other);
  const shared = notesB.filter((n) => notesA.map(normalize).includes(normalize(n)));
  const score =
    0.55 * accordAffinity(pa, pb) +
    0.35 * jaccard(notesA, notesB) +
    0.05 * jaccard(base.seasons.value, other.seasons.value) +
    0.05 * jaccard(base.occasions.value, other.occasions.value);

  // O que muda: eixos com maior diferença de participação no perfil.
  const diffs = ACCORDS.map(({ key }) => ({ key, d: pb[key] - pa[key] })).sort((x, y) => y.d - x.d);
  const more = diffs.filter((x) => x.d > 0.08).slice(0, 2).map((x) => label(x.key));
  const less = diffs.filter((x) => x.d < -0.08).slice(-2).reverse().map((x) => label(x.key));
  const common = ACCORDS.map(({ key }) => ({ key, v: Math.min(pa[key], pb[key]) }))
    .filter((x) => x.v > 0.08)
    .sort((x, y) => y.v - x.v)
    .slice(0, 2)
    .map((x) => label(x.key));

  const parts: string[] = [];
  if (shared.length) parts.push(`Compartilha ${listPt(shared.map((s) => s.toLowerCase()))} na pirâmide declarada`);
  else parts.push("Não tem notas em comum na pirâmide declarada");
  if (common.length) parts.push(`e um fundo de perfil ${listPt(common)}`);
  let reason = parts.join(" ") + ".";
  if (more.length || less.length) {
    const bits = [more.length ? `mais ${listPt(more)}` : "", less.length ? `menos ${listPt(less)}` : ""].filter(Boolean);
    reason += ` Pode agradar quem gosta do ${base.name}, mas procura algo ${bits.join(" e ")}.`;
  }
  return { perfume: other, score, sharedNotes: shared, reason };
}

export function similarTo(base: Perfume, catalog: Perfume[]) {
  const all = catalog.filter((p) => p.slug !== base.slug).map((p) => compare(base, p)).sort((a, b) => b.score - a.score);
  return { close: all.filter((s) => s.score >= SIMILAR_THRESHOLD), others: all.filter((s) => s.score < SIMILAR_THRESHOLD) };
}
