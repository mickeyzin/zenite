import type { Perfume } from "@/data/types";
import { ACCORDS, accordProfile, allNotes, normalize, type AccordKey, type Profile } from "./olfactory";

/**
 * Recomendações "Para você". Tudo é calculado a partir de:
 * - o mapa olfativo salvo (perfil de acordes + notas que ama/evita);
 * - o armário: "gostei" e "tenho" puxam o perfil para perto; "não gostei" afasta.
 * Cada sugestão traz o motivo em texto. Nada é enviado a terceiros.
 */
export type WardrobeStatus = "tenho" | "gostei" | "nao_gostei" | "quero";

export interface UserTaste {
  quizProfile: Profile | null;
  loved: string[];
  avoided: string[];
  wardrobe: Record<string, WardrobeStatus>; // slug → status
}

export interface Pick {
  perfume: Perfume;
  score: number; // 0–1
  reason: string;
}

export interface Section {
  key: string;
  title: string;
  subtitle: string;
  picks: Pick[];
  empty?: string;
}

const empty = (): Profile => Object.fromEntries(ACCORDS.map((a) => [a.key, 0])) as Profile;
const label = (k: AccordKey) => ACCORDS.find((a) => a.key === k)!.label.toLowerCase();
const listPt = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}`);
const cos = (a: Profile, b: Profile) => {
  let d = 0;
  let na = 0;
  let nb = 0;
  for (const { key } of ACCORDS) {
    d += a[key] * b[key];
    na += a[key] ** 2;
    nb += b[key] ** 2;
  }
  return na && nb ? d / Math.sqrt(na * nb) : 0;
};
const profileOf = (p: Perfume) => accordProfile(p).profile;

/** Perfil da pessoa: mapa + armário (gostei/tenho somam, não gostei subtrai). */
export function tasteProfile(t: UserTaste, catalog: Perfume[]): Profile | null {
  const u = empty();
  let any = false;
  const add = (pr: Profile, k: number) => {
    for (const { key } of ACCORDS) u[key] += pr[key] * k;
    any = true;
  };
  if (t.quizProfile) add(t.quizProfile, 1.2);
  for (const p of catalog) {
    const st = t.wardrobe[p.slug];
    if (st === "gostei") add(profileOf(p), 0.9);
    if (st === "tenho") add(profileOf(p), 0.5);
    if (st === "nao_gostei") add(profileOf(p), -0.6);
  }
  if (!any) return null;
  for (const { key } of ACCORDS) u[key] = Math.max(0, u[key]);
  const total = Object.values(u).reduce((s, v) => s + v, 0);
  if (!total) return null;
  for (const { key } of ACCORDS) u[key] /= total;
  return u;
}

/* Afinidade de cada perfume com estações e ocasiões, a partir dos acordes
   (e, quando houver, das estações indicadas na avaliação editorial). */
const FIT: Record<string, Partial<Record<AccordKey, number>>> = {
  verao: { citrico: 1, verde: 0.8, aromatico: 0.7, frutado: 0.5, floral: 0.3, almiscarado: 0.3 },
  primavera: { floral: 1, frutado: 0.7, verde: 0.6, citrico: 0.5, almiscarado: 0.4 },
  outono: { amadeirado: 1, especiado: 0.8, ambarado: 0.6, aromatico: 0.4, frutado: 0.3 },
  inverno: { ambarado: 1, doce: 0.8, especiado: 0.7, amadeirado: 0.6, almiscarado: 0.3 },
  trabalho: { citrico: 0.8, aromatico: 0.8, almiscarado: 0.7, verde: 0.6, floral: 0.5, amadeirado: 0.5 },
  encontro: { ambarado: 0.9, doce: 0.8, especiado: 0.6, floral: 0.6, amadeirado: 0.5, almiscarado: 0.5 },
  diaadia: { citrico: 0.6, aromatico: 0.6, almiscarado: 0.6, amadeirado: 0.6, frutado: 0.5, floral: 0.5, verde: 0.5 },
};
const PENALTY: Record<string, Partial<Record<AccordKey, number>>> = {
  verao: { doce: 0.5, ambarado: 0.5 },
  inverno: { citrico: 0.3, verde: 0.3 },
  trabalho: { doce: 0.5, ambarado: 0.4 },
};

function fit(p: Perfume, ctx: string) {
  const pr = profileOf(p);
  let f = 0;
  for (const [k, w] of Object.entries(FIT[ctx] ?? {})) f += pr[k as AccordKey] * (w ?? 0);
  for (const [k, w] of Object.entries(PENALTY[ctx] ?? {})) f -= pr[k as AccordKey] * (w ?? 0);
  if (p.seasons.value.some((s) => normalize(s) === ctx)) f += 0.12;
  return Math.max(0, Math.min(1, f * 1.6));
}

/** Acordes que mais explicam a ligação entre a pessoa e o perfume. */
const shared = (u: Profile, p: Perfume, n = 2) => {
  const pr = profileOf(p);
  return ACCORDS.map(({ key }) => ({ key, v: Math.min(u[key], pr[key]) }))
    .filter((x) => x.v > 0.05)
    .sort((a, b) => b.v - a.v)
    .slice(0, n)
    .map((x) => label(x.key));
};

const SEASON_NAME = { verao: "Verão", outono: "Outono", inverno: "Inverno", primavera: "Primavera" } as const;
const SEASON_NOTE = {
  verao: "Leve e luminoso para o calor",
  outono: "Aquece sem pesar",
  inverno: "Encorpado para o frio",
  primavera: "Floral e fresco na medida",
} as const;

export function recommend(t: UserTaste, catalog: Perfume[]): { profile: Profile | null; sections: Section[] } {
  const u = tasteProfile(t, catalog);
  if (!u) return { profile: null, sections: [] };
  const loved = new Set(t.loved.map(normalize));
  const avoided = new Set(t.avoided.map(normalize));
  const disliked = catalog.filter((p) => t.wardrobe[p.slug] === "nao_gostei");

  // Candidatos: o que a pessoa ainda não conhece (não tem, não usou, não descartou).
  const candidates = catalog.filter((p) => !["tenho", "gostei", "nao_gostei"].includes(t.wardrobe[p.slug] ?? ""));
  const base = new Map<string, { s: number; lovedFound: string[]; avoidedFound: string[] }>();
  for (const p of candidates) {
    const notes = allNotes(p);
    const lovedFound = notes.filter((n) => loved.has(normalize(n)));
    const avoidedFound = notes.filter((n) => avoided.has(normalize(n)));
    const nearDisliked = Math.max(0, ...disliked.map((d) => cos(profileOf(d), profileOf(p))));
    const wished = t.wardrobe[p.slug] === "quero" ? 0.05 : 0;
    const s = wished + 0.8 * cos(u, profileOf(p)) + Math.min(0.2, lovedFound.length * 0.07) - Math.min(0.35, avoidedFound.length * 0.12) - 0.25 * Math.max(0, nearDisliked - 0.7);
    base.set(p.slug, { s: Math.max(0, Math.min(1, s)), lovedFound, avoidedFound });
  }
  const why = (p: Perfume, extra?: string) => {
    const b = base.get(p.slug)!;
    const bits: string[] = [];
    if (b.lovedFound.length) bits.push(`tem ${listPt(b.lovedFound.map((n) => n.toLowerCase()))}, que você ama`);
    const sh = shared(u, p);
    if (sh.length) bits.push(`${bits.length ? "e " : ""}combina com o seu lado ${listPt(sh)}`);
    let r = bits.length ? bits.join(" ") : "perfil próximo do seu";
    r = r[0].toUpperCase() + r.slice(1);
    if (extra) r += `. ${extra}`;
    if (t.wardrobe[p.slug] === "quero") r += ". Está na sua lista de quero experimentar";
    if (b.avoidedFound.length) r += `. Atenção: tem ${listPt(b.avoidedFound.map((n) => n.toLowerCase()))}`;
    return r + ".";
  };
  // used: perfumes já indicados na mesma seção — evitados quando houver outra opção razoável.
  const rank = (score: (p: Perfume) => number, n = 1, extra?: (p: Perfume) => string | undefined, used?: Set<string>) => {
    const sorted = candidates.map((p) => ({ p, s: score(p) })).sort((a, b) => b.s - a.s);
    const fresh = used ? sorted.filter((x) => !used.has(x.p.slug) && x.s >= (sorted[0]?.s ?? 0) - 0.15) : sorted;
    const chosen = (fresh.length >= n ? fresh : sorted).slice(0, n);
    chosen.forEach((x) => used?.add(x.p.slug));
    return chosen.map(({ p, s }) => ({ perfume: p, score: Math.max(0, Math.min(1, s)), reason: why(p, extra?.(p)) }));
  };
  const match = (p: Perfume) => base.get(p.slug)!.s;
  const ctx = (c: string, wFit = 0.4) => (p: Perfume) => (1 - wFit) * match(p) + wFit * fit(p, c);

  const sections: Section[] = [];
  sections.push({ key: "top", title: "Sua melhor combinação", subtitle: "O perfume do catálogo mais próximo do seu perfil agora.", picks: rank(match, 1) });

  const seasonUsed = new Set<string>();
  sections.push({
    key: "estacoes",
    title: "Seu perfume para cada estação",
    subtitle: "O seu gosto, ajustado ao clima.",
    picks: (["verao", "outono", "inverno", "primavera"] as const).flatMap((c) =>
      rank(ctx(c), 1, () => SEASON_NOTE[c], seasonUsed).map((x) => ({ ...x, reason: `${SEASON_NAME[c]} — ${x.reason}` })),
    ),
  });

  const occasionUsed = new Set<string>();
  sections.push({
    key: "ocasioes",
    title: "Para cada ocasião",
    subtitle: "Do escritório à noite.",
    picks: ([
      ["trabalho", "Trabalho, escola e faculdade", "Discreto e limpo para ambientes fechados"],
      ["encontro", "Encontro e noite", "Mais presença e calor"],
      ["diaadia", "Dia a dia", "Versátil para qualquer hora"],
    ] as const).flatMap(([c, t, e]) => rank(ctx(c, 0.45), 1, () => e, occasionUsed).map((x) => ({ ...x, reason: `${t} — ${x.reason}` }))),
  });

  // Seu lado mais forte: os 2 acordes principais da pessoa.
  const mine = ACCORDS.map((a) => ({ ...a, v: u[a.key] }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 2)
    .filter((a) => a.v > 0.08);
  for (const a of mine)
    sections.push({
      key: `lado-${a.key}`,
      title: `Seu ${a.label.toLowerCase()}`,
      subtitle: `${a.label} é um dos traços mais fortes do seu perfil.`,
      picks: rank((p) => 0.5 * match(p) + 0.5 * Math.min(1, profileOf(p)[a.key] * 3), 2),
    });

  // O que falta no armário: estação em que os perfumes que a pessoa tem/gosta rendem menos.
  const owned = catalog.filter((p) => ["tenho", "gostei"].includes(t.wardrobe[p.slug] ?? ""));
  if (owned.length) {
    const gaps = (["verao", "inverno", "trabalho", "encontro"] as const)
      .map((c) => ({ c, best: Math.max(...owned.map((p) => fit(p, c))) }))
      .sort((a, b) => a.best - b.best);
    const g = gaps[0];
    const name = { verao: "o calor", inverno: "o frio", trabalho: "o trabalho", encontro: "a noite" }[g.c];
    sections.push({
      key: "falta",
      title: "Falta no seu armário",
      subtitle: `Seus perfumes rendem menos para ${name}. Uma sugestão para completar:`,
      picks: rank(ctx(g.c, 0.6), 1),
    });
  }

  // Alternativa mais barata que um favorito (com preço conferido nos dois).
  const price = (p: Perfume) => p.offers?.find((o) => o.available && o.price !== null)?.price ?? null;
  const favs = owned.filter((p) => price(p) !== null);
  const cheaper: Pick[] = [];
  for (const f of favs) {
    const fp = price(f)!;
    const alt = candidates
      .filter((p) => p.slug !== f.slug && price(p) !== null && price(p)! < fp)
      .map((p) => ({ p, s: cos(profileOf(f), profileOf(p)) }))
      .filter((x) => x.s > 0.75)
      .sort((a, b) => b.s - a.s)[0];
    if (alt)
      cheaper.push({
        perfume: alt.p,
        score: alt.s,
        reason: `Lembra o ${f.name} (afinidade ${Math.round(alt.s * 100)}%) e sai por menos: ${price(alt.p)!.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.`,
      });
  }
  sections.push({
    key: "economia",
    title: "Mais em conta que o seu favorito",
    subtitle: "Perfil parecido, preço conferido menor.",
    picks: cheaper.slice(0, 2),
    empty: owned.length
      ? "Ainda não há alternativa com preço conferido menor para os seus favoritos."
      : "Marque perfumes como “Tenho” ou “Já usei e gostei” para ver alternativas mais baratas.",
  });

  return { profile: u, sections };
}
