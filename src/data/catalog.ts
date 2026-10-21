import { cacheLife, cacheTag } from "next/cache";
import { supabaseEnabled } from "@/lib/supabase/config";
import { normalize } from "@/lib/olfactory";
import { anonClient } from "@/lib/supabase/server";
import { featuredPerfumes } from "./perfumes";
import type { BottleLook, DataStatus, Metric, Offer, Perfume, UniverseTheme } from "./types";

/**
 * Fonte dos perfumes do site.
 *
 * - Com o Supabase configurado: lê os perfumes publicados (as regras RLS do
 *   banco já escondem rascunhos de quem não é admin).
 * - Sem configuração, ou se o banco falhar: usa os dados locais (src/data).
 *
 * O resultado fica em cache (etiqueta "perfumes"); o painel invalida a
 * etiqueta ao publicar, via /api/revalidar.
 */
export const CATALOG_TAG = "perfumes";

const SELECT = `
  slug, line, name, full_name, concentration, concentration_status, year, year_status, year_note,
  gender, gender_status, gender_note, perfumers, perfumers_status, perfumers_note, family, family_status, family_note,
  notes_status, notes_note, intro, intro_status, intro_note, universe, theme, look, scene_scale, front_rotation,
  featured, featured_order,
  brand:brands(name),
  perfume_notes(tier, position, note:notes(name_pt, note_accords(accord_key, weight))),
  reviews(*),
  perfume_sources(field, label, url),
  perfume_images(url, kind, position),
  models_3d(desktop_url, mobile_url, liquid_points_url),
  similar_overrides!perfume_id(reason, similar:similar_id(full_name)),
  offers(id, title, volume_ml, price, currency, is_affiliate, available, active, checked_at, store:stores(name))
`;

/** Preço conferido há mais que isso não é exibido (pode ter mudado). */
export const PRICE_FRESH_HOURS = 72;

/* Linhas como o PostgREST devolve (só os campos usados). */
type One<T> = T | T[] | null;
interface Row {
  slug: string;
  line: string | null;
  name: string;
  full_name: string;
  concentration: string | null;
  concentration_status: DataStatus;
  year: number | null;
  year_status: DataStatus;
  year_note: string | null;
  gender: string | null;
  gender_status: DataStatus;
  gender_note: string | null;
  perfumers: string[] | null;
  perfumers_status: DataStatus;
  perfumers_note: string | null;
  family: string | null;
  family_status: DataStatus;
  family_note: string | null;
  notes_status: DataStatus;
  notes_note: string | null;
  intro: string | null;
  intro_status: DataStatus;
  intro_note: string | null;
  universe: string | null;
  theme: UniverseTheme | null;
  look: BottleLook | null;
  scene_scale: number | string;
  front_rotation: number | string;
  featured: boolean;
  featured_order: number | null;
  brand: One<{ name: string }>;
  perfume_notes: { tier: "top" | "heart" | "base"; position: number; note: One<{ name_pt: string; note_accords: { accord_key: string; weight: number | string }[] }> }[];
  reviews: One<{
    status: DataStatus;
    status_note: string | null;
    evolution: { phase: string; text: string }[];
    evolution_note: string | null;
    performance: Metric[];
    seasons: string[];
    occasions: string[];
    pros: string[];
    pros_note: string | null;
    cons: string[];
    cons_note: string | null;
    profile: string | null;
    rating: number | string | null;
    rating_note: string | null;
  }>;
  perfume_sources: { field: string; label: string; url: string }[];
  perfume_images: { url: string; kind: string; position: number }[];
  models_3d: One<{ desktop_url: string; mobile_url: string; liquid_points_url: string | null }>;
  similar_overrides: { reason: string; similar: One<{ full_name: string }> }[];
  offers?: {
    id: string;
    title: string;
    volume_ml: number | string | null;
    price: number | string | null;
    currency: string;
    is_affiliate: boolean;
    available: boolean;
    active: boolean;
    checked_at: string | null;
    store: One<{ name: string }>;
  }[];
}

const one = <T,>(v: One<T>): T | null => (Array.isArray(v) ? (v[0] ?? null) : v);
const opt = (s: string | null | undefined) => s ?? undefined;

/** Universo neutro para perfumes sem apresentação 3D própria. */
const DEFAULT_THEME = featuredPerfumes[0].theme;
const SIMILAR_NOTE = "Comparações em curadoria — serão geradas a partir do catálogo.";

export function rowToPerfume(r: Row, now = Date.now()): Perfume {
  const review = one(r.reviews);
  const model = one(r.models_3d);
  const rs: DataStatus = review?.status ?? "provisorio";
  const sources = (field: string) => {
    const list = r.perfume_sources.filter((s) => s.field === field).map(({ label, url }) => ({ label, url }));
    return list.length ? list : undefined;
  };
  const notes = { top: [] as string[], heart: [] as string[], base: [] as string[] };
  const noteWeights: NonNullable<Perfume["noteWeights"]> = {};
  [...r.perfume_notes]
    .sort((a, b) => a.position - b.position)
    .forEach((pn) => {
      const n = one(pn.note);
      if (!n) return;
      notes[pn.tier].push(n.name_pt);
      if (n.note_accords?.length)
        noteWeights[normalize(n.name_pt)] = Object.fromEntries(n.note_accords.map((a) => [a.accord_key, Number(a.weight)]));
    });
  const poster = [...r.perfume_images].filter((i) => i.kind === "poster").sort((a, b) => a.position - b.position)[0];
  const similar = r.similar_overrides
    .map((s) => ({ name: one(s.similar)?.full_name ?? "", reason: s.reason }))
    .filter((s) => s.name);
  const rating = review?.rating == null ? null : Number(review.rating);
  const fresh = (t: string | null) => t !== null && now - Date.parse(t) < PRICE_FRESH_HOURS * 3600_000;
  const offers: Offer[] = (r.offers ?? [])
    .filter((o) => o.active)
    .map((o) => ({
      id: o.id,
      store: one(o.store)?.name ?? "",
      title: o.title,
      volumeMl: o.volume_ml == null ? null : Number(o.volume_ml),
      price: o.price != null && fresh(o.checked_at) ? Number(o.price) : null,
      currency: o.currency,
      isAffiliate: o.is_affiliate,
      available: o.available,
      checkedAt: o.checked_at,
    }))
    // Disponíveis com preço primeiro, do mais barato; depois as demais.
    .sort((a, b) => Number(b.available) - Number(a.available) || (a.price ?? Infinity) - (b.price ?? Infinity));

  return {
    slug: r.slug,
    brand: one(r.brand)?.name ?? "",
    line: opt(r.line),
    name: r.name,
    fullName: r.full_name,
    universe: r.universe ?? "",
    model: { desktop: model?.desktop_url ?? "", mobile: model?.mobile_url ?? "", liquid: opt(model?.liquid_points_url) },
    poster: poster?.url ?? null,
    sceneScale: Number(r.scene_scale) || 1,
    frontRotationY: Number(r.front_rotation) || 0,
    perfumers: { value: r.perfumers, status: r.perfumers_status, note: opt(r.perfumers_note), sources: sources("perfumistas") },
    concentration: { value: r.concentration ?? "", status: r.concentration_status, sources: sources("concentracao") },
    family: { value: r.family ?? "", status: r.family_status, note: opt(r.family_note) },
    year: { value: r.year ? String(r.year) : null, status: r.year_status, note: opt(r.year_note), sources: sources("ano") },
    gender: { value: r.gender ?? "", status: r.gender_status, note: opt(r.gender_note), sources: sources("publico") },
    intro: { value: r.intro ?? "", status: r.intro_status, note: opt(r.intro_note) },
    notes: { value: notes, status: r.notes_status, note: opt(r.notes_note), sources: sources("notas") },
    evolution: { value: review?.evolution ?? [], status: rs, note: opt(review?.evolution_note) },
    performance: { value: review?.performance ?? [], status: rs, note: opt(review?.status_note) },
    seasons: { value: review?.seasons ?? [], status: rs },
    occasions: { value: review?.occasions ?? [], status: rs },
    verdict: {
      rating: { value: rating, status: rs, note: opt(review?.rating_note) },
      pros: { value: review?.pros ?? [], status: rs, note: opt(review?.pros_note) },
      cons: { value: review?.cons ?? [], status: rs, note: opt(review?.cons_note) },
      profile: { value: review?.profile ?? "", status: rs },
      similar: { value: similar, status: rs, note: similar.length ? undefined : SIMILAR_NOTE },
    },
    theme: r.theme ?? DEFAULT_THEME,
    look: r.look ?? {},
    noteWeights,
    ...(offers.length ? { offers } : {}),
  };
}

interface Catalog {
  all: Perfume[];
  featured: Perfume[];
  source: "supabase" | "local";
}

const local = (): Catalog => ({ all: featuredPerfumes, featured: featuredPerfumes, source: "local" });

export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag(CATALOG_TAG);
  if (!supabaseEnabled) {
    cacheLife("max");
    return local();
  }
  try {
    const { data, error } = await anonClient().from("perfumes").select(SELECT).eq("status", "publicado").order("name");
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as unknown as Row[];
    if (!rows.length) throw new Error("nenhum perfume publicado");
    const now = Date.now();
    const all = rows.map((r) => rowToPerfume(r, now));
    // A apresentação 3D só recebe perfumes em destaque com modelo e pôster.
    const featured = rows
      .map((r, i) => ({ r, p: all[i] }))
      .filter(({ r, p }) => r.featured && p.model.desktop && p.poster)
      .sort((a, b) => (a.r.featured_order ?? 999) - (b.r.featured_order ?? 999))
      .map(({ p }) => p);
    cacheLife("hours");
    return { all, featured: featured.length ? featured : featuredPerfumes, source: "supabase" };
  } catch (e) {
    console.error("[zenite] banco indisponível, usando dados locais:", (e as Error).message);
    cacheLife("minutes");
    return local();
  }
}

export const getPerfumes = async () => (await getCatalog()).all;
export const getFeatured = async () => (await getCatalog()).featured;
export const getPerfumeBySlug = async (slug: string) => (await getCatalog()).all.find((p) => p.slug === slug) ?? null;
