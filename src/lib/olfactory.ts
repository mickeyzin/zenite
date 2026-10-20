import type { Perfume } from "@/data/types";

/**
 * Perfil olfativo ESTIMADO a partir da pirâmide declarada.
 *
 * Cada nota recebe pesos por acorde (classificação da Zênite, baseada em
 * referências gerais de perfumaria). O perfil é a soma ponderada das notas;
 * notas de fundo pesam um pouco mais por permanecerem mais tempo na pele.
 * É uma estimativa transparente — não substitui a avaliação editorial.
 */
export const ACCORDS = [
  { key: "citrico", label: "Cítrico" },
  { key: "frutado", label: "Frutado" },
  { key: "floral", label: "Floral" },
  { key: "verde", label: "Verde" },
  { key: "aromatico", label: "Aromático" },
  { key: "especiado", label: "Especiado" },
  { key: "amadeirado", label: "Amadeirado" },
  { key: "ambarado", label: "Ambarado" },
  { key: "doce", label: "Doce" },
  { key: "almiscarado", label: "Almiscarado" },
] as const;

export type AccordKey = (typeof ACCORDS)[number]["key"];
type Weights = Partial<Record<AccordKey, number>>;

/** Dicionário de notas → acordes. Notas novas precisam ser cadastradas aqui. */
export const NOTE_ACCORDS: Record<string, Weights> = {
  bergamota: { citrico: 1 },
  tangerina: { citrico: 1, frutado: 0.3 },
  gengibre: { especiado: 0.7, citrico: 0.3 },
  menta: { aromatico: 1 },
  pera: { frutado: 1 },
  "flor de laranjeira": { floral: 1 },
  cedro: { amadeirado: 1 },
  ambar: { ambarado: 1 },
  almiscar: { almiscarado: 1 },
  "baga timur": { especiado: 0.6, citrico: 0.4 },
  "pimenta-rosa": { especiado: 1 },
  "rosa centifolia": { floral: 1 },
  geranio: { floral: 0.5, verde: 0.3, aromatico: 0.2 },
  "broto de cassis": { frutado: 0.6, verde: 0.4 },
  vetiver: { amadeirado: 0.7, verde: 0.3 },
  amberwood: { amadeirado: 0.5, ambarado: 0.5 },
  neroli: { floral: 0.6, citrico: 0.4 },
  "essencia de neroli": { floral: 0.6, citrico: 0.4 },
  jasmim: { floral: 1 },
  musgo: { verde: 0.6, amadeirado: 0.4 },
  "baunilha bourbon": { doce: 1 },
  ambrofix: { ambarado: 0.7, amadeirado: 0.3 },
  serenolide: { almiscarado: 1 },
};

/** Normaliza para comparar notas: minúsculas, sem acentos e sem ™/®. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[™®]/g, "")
    .trim();

const TIER_WEIGHT = { top: 0.8, heart: 1, base: 1.2 } as const;

export type Profile = Record<AccordKey, number>;

const empty = (): Profile => Object.fromEntries(ACCORDS.map((a) => [a.key, 0])) as Profile;

/** Perfil normalizado (soma 1) e notas sem classificação (para revisão). */
export function accordProfile(p: Perfume): { profile: Profile; unknown: string[] } {
  const prof = empty();
  const unknown: string[] = [];
  (Object.keys(TIER_WEIGHT) as (keyof typeof TIER_WEIGHT)[]).forEach((tier) => {
    p.notes.value[tier].forEach((note) => {
      const w = NOTE_ACCORDS[normalize(note)];
      if (!w) {
        unknown.push(note);
        return;
      }
      for (const [k, v] of Object.entries(w)) prof[k as AccordKey] += (v ?? 0) * TIER_WEIGHT[tier];
    });
  });
  const total = Object.values(prof).reduce((a, b) => a + b, 0) || 1;
  for (const k of Object.keys(prof) as AccordKey[]) prof[k] /= total;
  return { profile: prof, unknown };
}

/** Os acordes predominantes (para cartões e filtros). */
export function topAccords(profile: Profile, count = 3) {
  return ACCORDS.map((a) => ({ ...a, value: profile[a.key] }))
    .filter((a) => a.value > 0.06)
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

/**
 * Métricas olfativas derivadas (0–10). Escala: 50% do perfil num eixo = 10.
 * Sempre exibidas como "estimativa a partir das notas".
 */
export function derivedMetrics(profile: Profile) {
  const to10 = (share: number) => Math.min(10, Math.round(share * 20 * 10) / 10);
  return [
    { key: "docura", label: "Doçura", value: to10(profile.doce + profile.ambarado * 0.6 + profile.frutado * 0.3) },
    { key: "frescor", label: "Frescor", value: to10(profile.citrico + profile.verde + profile.aromatico * 0.7) },
    { key: "amadeirado", label: "Presença amadeirada", value: to10(profile.amadeirado) },
    { key: "especiado", label: "Presença especiada", value: to10(profile.especiado) },
  ];
}

export const allNotes = (p: Perfume) => [...p.notes.value.top, ...p.notes.value.heart, ...p.notes.value.base];

/** Partes da família olfativa ("Aromático · Cítrico") como etiquetas. */
export const familyTags = (p: Perfume) => p.family.value.split("·").map((s) => s.trim()).filter(Boolean);
