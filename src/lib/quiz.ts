import noteAccordsData from "../../data/note-accords.json";
import type { Perfume } from "@/data/types";
import { ACCORDS, accordProfile, allNotes, normalize, NOTE_ACCORDS, type AccordKey, type Profile } from "./olfactory";

/**
 * Mapeamento olfativo (quiz). Tudo roda no navegador: as respostas viram um
 * perfil de acordes e são comparadas com o perfil estimado de cada perfume do
 * catálogo. Nada é enviado a servidores.
 */

/** Todas as notas classificadas, pelo nome em português (para a busca). */
export const ALL_NOTES: string[] = Object.values(noteAccordsData as Record<string, { name: string }>)
  .map((v) => v.name)
  .sort((a, b) => a.localeCompare(b, "pt-BR"));

export const FAMILIES: { key: AccordKey; label: string; hint: string }[] = [
  { key: "citrico", label: "Cítrico", hint: "limão, bergamota, laranja" },
  { key: "floral", label: "Floral", hint: "rosa, jasmim, flor de laranjeira" },
  { key: "amadeirado", label: "Amadeirado", hint: "cedro, sândalo, vetiver" },
  { key: "ambarado", label: "Ambarado", hint: "âmbar, resinas, incenso" },
  { key: "doce", label: "Doce / gourmand", hint: "baunilha, caramelo, cacau" },
  { key: "aromatico", label: "Aromático", hint: "lavanda, alecrim, sálvia" },
  { key: "especiado", label: "Especiado", hint: "pimenta, canela, cardamomo" },
  { key: "frutado", label: "Frutado", hint: "maçã, pera, frutas vermelhas" },
  { key: "verde", label: "Verde", hint: "folhas, grama, chá verde" },
  { key: "almiscarado", label: "Almiscarado", hint: "almíscar, pele limpa" },
];

export const LOVED_SUGGESTIONS = [
  "Bergamota", "Limão-siciliano", "Laranja", "Toranja", "Lavanda", "Menta", "Rosa", "Jasmim", "Flor de laranjeira", "Íris",
  "Baunilha", "Fava-tonka", "Caramelo", "Cacau", "Café", "Mel", "Âmbar", "Sândalo", "Cedro", "Vetiver", "Patchouli", "Oud",
  "Couro", "Pimenta-rosa", "Cardamomo", "Canela", "Maçã", "Pera", "Frutas vermelhas", "Coco", "Notas marinhas", "Almíscar branco",
];

export const AVOID_SUGGESTIONS = [
  "Oud", "Patchouli", "Baunilha", "Couro", "Incenso", "Tabaco", "Canela", "Café", "Rosa", "Tuberosa", "Notas aquáticas",
  "Lavanda", "Coco", "Cravo-da-índia", "Mel", "Almíscar",
];

export type Intensity = "suave" | "moderada" | "marcante";
export type Moment = "dia" | "noite" | "ambos";
export type Climate = "calor" | "frio" | "todos";

export interface Answers {
  families: AccordKey[];
  loved: string[];
  avoided: string[];
  intensity: Intensity | null;
  moment: Moment | null;
  climate: Climate | null;
  /** Slug de um perfume do catálogo de que a pessoa já gosta. */
  reference: string | null;
}

export const EMPTY_ANSWERS: Answers = {
  families: [],
  loved: [],
  avoided: [],
  intensity: null,
  moment: null,
  climate: null,
  reference: null,
};

const NUDGE: Record<string, Partial<Record<AccordKey, number>>> = {
  suave: { citrico: 0.4, verde: 0.3, almiscarado: 0.3, aromatico: 0.2 },
  marcante: { ambarado: 0.4, especiado: 0.3, amadeirado: 0.3, doce: 0.2 },
  dia: { citrico: 0.3, verde: 0.2, aromatico: 0.2, floral: 0.1 },
  noite: { ambarado: 0.3, doce: 0.2, especiado: 0.2, amadeirado: 0.1 },
  calor: { citrico: 0.2, verde: 0.15, frutado: 0.1 },
  frio: { ambarado: 0.2, especiado: 0.15, doce: 0.1 },
};

const CLIMATE_SEASONS: Record<Climate, string[]> = {
  calor: ["primavera", "verao"],
  frio: ["outono", "inverno"],
  todos: [],
};

const empty = (): Profile => Object.fromEntries(ACCORDS.map((a) => [a.key, 0])) as Profile;
const weightsOf = (note: string) => NOTE_ACCORDS[normalize(note)] ?? {};

/** As respostas viram um perfil de acordes (soma 1). */
export function answersProfile(a: Answers, catalog: Perfume[]): Profile {
  const u = empty();
  const add = (w: Partial<Record<AccordKey, number>>, k = 1) => {
    for (const [key, v] of Object.entries(w)) u[key as AccordKey] += (v ?? 0) * k;
  };
  a.families.forEach((f) => (u[f] += 1));
  a.loved.forEach((n) => add(weightsOf(n), 0.6));
  for (const key of [a.intensity, a.moment, a.climate]) if (key && NUDGE[key]) add(NUDGE[key]);
  const ref = a.reference ? catalog.find((p) => p.slug === a.reference) : null;
  if (ref) {
    const total0 = Object.values(u).reduce((s, v) => s + v, 0);
    // O perfume de referência pesa tanto quanto todo o resto junto (ou sozinho, se nada mais foi marcado).
    add(accordProfile(ref).profile, Math.max(1.5, total0));
  }
  a.avoided.forEach((n) => add(weightsOf(n), -0.4));
  for (const k of Object.keys(u) as AccordKey[]) u[k] = Math.max(0, u[k]);
  const total = Object.values(u).reduce((s, v) => s + v, 0) || 1;
  for (const k of Object.keys(u) as AccordKey[]) u[k] /= total;
  return u;
}

export const hasEnough = (a: Answers) => a.families.length > 0 || a.loved.length > 0 || a.reference !== null;

export interface Match {
  perfume: Perfume;
  score: number;
  lovedFound: string[];
  avoidedFound: string[];
  commonAccords: string[];
  reason: string;
}

const listPt = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}`);
const label = (k: AccordKey) => ACCORDS.find((a) => a.key === k)!.label.toLowerCase();

/**
 * Afinidade (0–1): 75% semelhança de perfil (cosseno) + até 21% por notas que
 * a pessoa ama − até 36% por notas que ela evita + 4% se a estação combinar.
 */
export function rankMatches(a: Answers, catalog: Perfume[]): { profile: Profile; matches: Match[] } {
  const u = answersProfile(a, catalog);
  const uLen = Math.hypot(...Object.values(u)) || 1;
  const loved = new Set(a.loved.map(normalize));
  const avoided = new Set(a.avoided.map(normalize));
  const seasons = a.climate ? CLIMATE_SEASONS[a.climate] : [];

  const matches = catalog
    .filter((p) => p.slug !== a.reference)
    .map((p) => {
      const pr = accordProfile(p).profile;
      const dot = ACCORDS.reduce((s, { key }) => s + u[key] * pr[key], 0);
      const cos = dot / (uLen * (Math.hypot(...Object.values(pr)) || 1));
      const notes = allNotes(p);
      const lovedFound = notes.filter((n) => loved.has(normalize(n)));
      const avoidedFound = notes.filter((n) => avoided.has(normalize(n)));
      const seasonOk = seasons.length > 0 && p.seasons.value.some((s) => seasons.includes(normalize(s)));
      const score = Math.max(
        0,
        Math.min(1, 0.75 * cos + Math.min(0.21, lovedFound.length * 0.07) - Math.min(0.36, avoidedFound.length * 0.12) + (seasonOk ? 0.04 : 0)),
      );
      const commonAccords = ACCORDS.map(({ key }) => ({ key, v: Math.min(u[key], pr[key]) }))
        .filter((x) => x.v > 0.06)
        .sort((x, y) => y.v - x.v)
        .slice(0, 2)
        .map((x) => label(x.key));

      const bits: string[] = [];
      if (lovedFound.length) bits.push(`Tem ${listPt(lovedFound.map((n) => n.toLowerCase()))}, que você marcou`);
      if (commonAccords.length) bits.push(`${bits.length ? "e combina" : "Combina"} com o seu lado ${listPt(commonAccords)}`);
      let reason = bits.length ? bits.join(", ") + "." : "Perfil diferente do que você descreveu.";
      if (avoidedFound.length) reason += ` Atenção: tem ${listPt(avoidedFound.map((n) => n.toLowerCase()))}, que você prefere evitar.`;
      return { perfume: p, score, lovedFound, avoidedFound, commonAccords, reason };
    })
    .sort((x, y) => y.score - x.score);
  return { profile: u, matches };
}
