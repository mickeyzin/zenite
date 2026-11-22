import type { Perfume } from "@/data/types";
import { accordProfile, type Profile } from "./olfactory";
import { compare, SIMILAR_THRESHOLD, similarTo, type Similar } from "./similarity";

/** Menor preço confirmado entre as ofertas disponíveis (mesma regra da seção de ofertas). */
const bestPrice = (p: Perfume) => p.offers?.find((o) => o.available && o.price !== null) ?? null;

/** Dados mínimos de um cartão (vão para o navegador). */
export interface SlotCard {
  slug?: string; // ausente quando a inspiração não está no catálogo
  name: string;
  poster: string | null;
  posterAi?: boolean;
  score: number | null;
  reason: string;
  price: number | null;
  currency: string;
}
export interface SlotCandidate extends SlotCard {
  slug: string;
  profile: Profile;
}

const card = (s: Similar): SlotCard => {
  const o = bestPrice(s.perfume);
  return {
    slug: s.perfume.slug,
    name: s.perfume.fullName,
    poster: s.perfume.poster,
    posterAi: s.perfume.posterAi,
    score: s.score,
    reason: s.reason,
    price: o?.price ?? null,
    currency: o?.currency ?? "BRL",
  };
};

/**
 * No máximo 3 semelhantes, cada um com um papel:
 * 1) a inspiração declarada (perfume de nicho) — ou, sem ela, o mais parecido;
 * 2) custo-benefício: o parecido mais barato com preço confirmado (abaixo do preço deste, se houver);
 * 3) "para o seu gosto": escolhido no navegador entre os próximos candidatos, pelo perfil do leitor.
 */
export function similarSlots(base: Perfume, catalog: Perfume[]) {
  const all = similarTo(base, catalog);
  const ranked = [...all.close, ...all.others];
  const used = new Set<string>();

  // 1 — Inspiração ou mais parecido
  let first: { kind: "inspiracao" | "parecido"; card: SlotCard } | null = null;
  if (base.inspiredBy) {
    const target = base.inspiredBy.slug ? catalog.find((p) => p.slug === base.inspiredBy!.slug) : undefined;
    const note = base.inspiredBy.note ?? "Inspiração apontada pela editoria (a confirmar com a marca).";
    first = target
      ? { kind: "inspiracao", card: { ...card(compare(base, target)), reason: `${note} ${compare(base, target).reason}` } }
      : { kind: "inspiracao", card: { name: base.inspiredBy.name, poster: null, score: null, reason: note, price: null, currency: "BRL" } };
    if (target) used.add(target.slug);
  } else if (ranked[0]) {
    first = { kind: "parecido", card: card(ranked[0]) };
    used.add(ranked[0].perfume.slug);
  }

  // 2 — Custo-benefício (só entre os de perfil próximo)
  const mine = bestPrice(base)?.price ?? null;
  const priced = all.close
    .filter((s) => !used.has(s.perfume.slug))
    .map((s) => ({ s, price: bestPrice(s.perfume)?.price ?? null }))
    .filter((x): x is { s: Similar; price: number } => x.price !== null && (mine === null || x.price < mine))
    .sort((a, b) => a.price - b.price);
  let second: { kind: "custo" | "parecido"; card: SlotCard; note?: string } | null = null;
  if (priced[0]) {
    second = { kind: "custo", card: card(priced[0].s) };
    used.add(priced[0].s.perfume.slug);
  } else {
    const next = ranked.find((s) => !used.has(s.perfume.slug));
    if (next) {
      second = { kind: "parecido", card: card(next), note: "Sem preço confirmado para comparar custo-benefício agora." };
      used.add(next.perfume.slug);
    }
  }

  // 3 — Candidatos para "o seu gosto" (o navegador escolhe pelo perfil do leitor)
  const candidates: SlotCandidate[] = ranked
    .filter((s) => !used.has(s.perfume.slug) && s.score >= SIMILAR_THRESHOLD * 0.6)
    .slice(0, 12)
    .map((s) => ({ ...card(s), slug: s.perfume.slug, profile: accordProfile(s.perfume).profile }));
  if (!candidates.length) {
    const next = ranked.find((s) => !used.has(s.perfume.slug));
    if (next) candidates.push({ ...card(next), slug: next.perfume.slug, profile: accordProfile(next.perfume).profile });
  }
  return { first, second, candidates };
}

/** Perfil de acordes de todos os perfumes (para montar o gosto do leitor no navegador). */
export const profileMap = (catalog: Perfume[]) =>
  Object.fromEntries(
    catalog.map((p) => {
      const pr = accordProfile(p).profile;
      return [p.slug, Object.fromEntries(Object.entries(pr).map(([k, v]) => [k, Math.round(v * 1000) / 1000]))];
    }),
  ) as Record<string, Profile>;
