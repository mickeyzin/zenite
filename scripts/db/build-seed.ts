/**
 * Gera supabase/seed.sql a partir dos dados do repositório:
 * marcas, acordes, notas (com pesos e grafias alternativas), os perfumes em
 * destaque (com resenha, fontes, modelos 3D e universo) e os rascunhos importados.
 * Idempotente: pode ser executado de novo sem duplicar nada.
 *
 * Uso: npm run db:seed:build
 */
import fs from "node:fs";
import noteAccords from "../../data/note-accords.json";
import notesPt from "../../data/notes-pt.json";
import { featuredPerfumes } from "../../src/data/perfumes";
import { ACCORDS, normalize } from "../../src/lib/olfactory";

const out: string[] = ["-- Gerado por scripts/db/build-seed.ts — não edite à mão.", "begin;"];
const q = (v: unknown): string => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.length ? `array[${v.map(q).join(", ")}]::text[]` : "'{}'::text[]";
  if (typeof v === "object") return `${q(JSON.stringify(v))}::jsonb`;
  return `'${String(v).replace(/'/g, "''")}'`;
};
const json = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;
const slugOf = (s: string) => normalize(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const noteRef = (name: string) => `(select id from public.notes where slug = ${q(slugOf(name))})`;

// ——— Acordes ———
ACCORDS.forEach((a, i) => out.push(`insert into public.accords (key, label, position) values (${q(a.key)}, ${q(a.label)}, ${i}) on conflict (key) do update set label = excluded.label;`));

// ——— Notas ———
const enByPt = new Map<string, string>();
for (const [en, pt] of Object.entries(notesPt as Record<string, string>)) {
  if (pt.includes("|")) continue;
  const k = normalize(pt);
  if (!enByPt.has(k)) enByPt.set(k, en.replace(/\b\w/g, (c) => c.toUpperCase()));
}
const NA = noteAccords as Record<string, { name: string; weights: Record<string, number> }>;
for (const [key, { name, weights }] of Object.entries(NA)) {
  out.push(`insert into public.notes (slug, name_pt, name_en) values (${q(slugOf(name))}, ${q(name)}, ${q(enByPt.get(key) ?? null)}) on conflict (slug) do nothing;`);
  for (const [acc, w] of Object.entries(weights))
    out.push(`insert into public.note_accords (note_id, accord_key, weight) values (${noteRef(name)}, ${q(acc)}, ${w}) on conflict do nothing;`);
  out.push(`insert into public.note_aliases (alias, note_id) values (${q(key)}, ${noteRef(name)}) on conflict do nothing;`);
}
// Grafias em inglês (e erros dos sites) → nota em português
for (const [en, pt] of Object.entries(notesPt as Record<string, string>)) {
  if (pt.includes("|")) continue; // notas combinadas são expandidas na importação
  const target = NA[normalize(pt)];
  if (!target) continue;
  out.push(`insert into public.note_aliases (alias, note_id) values (${q(normalize(en).replace(/\s+/g, " "))}, ${noteRef(target.name)}) on conflict do nothing;`);
}

const notesEnd = out.length; // acordes + notas + grafias (reaproveitados nos arquivos por marca)

// ——— Marcas ———
const brands = [
  { slug: "lattafa", name: "Lattafa", website: "https://lattafa.com" },
  { slug: "creed", name: "Creed", website: "https://www.creedfragrance.com" },
  { slug: "prada", name: "Prada", website: "https://www.prada.com" },
  { slug: "afnan", name: "Afnan", website: "https://afnan.com" },
  { slug: "swiss-arabian", name: "Swiss Arabian", website: "https://swissarabian.com" },
  { slug: "khadlaj", name: "Khadlaj", website: "https://khadlaj-perfumes.com" },
];
brands.forEach((b) => out.push(`insert into public.brands (slug, name, website) values (${q(b.slug)}, ${q(b.name)}, ${q(b.website)}) on conflict (slug) do nothing;`));

// ——— Perfumes em destaque ———
featuredPerfumes.forEach((p, i) => {
  const brandSlug = slugOf(p.brand);
  const year = p.year.value ? Number(p.year.value) : null;
  out.push(`insert into public.perfumes (slug, brand_id, line, name, full_name, concentration, concentration_status, year, year_status, year_note,
  gender, gender_status, gender_note, perfumers, perfumers_status, perfumers_note, family, family_status, family_note, notes_status, notes_note, intro, intro_status, intro_note,
  universe, theme, look, scene_scale, front_rotation, status, featured, featured_order)
values (${q(p.slug)}, (select id from public.brands where slug = ${q(brandSlug)}), ${q(p.line ?? null)}, ${q(p.name)}, ${q(p.fullName)},
  ${q(p.concentration.value)}, ${q(p.concentration.status)}, ${q(year)}, ${q(p.year.status)}, ${q(p.year.note ?? null)},
  ${q(p.gender.value)}, ${q(p.gender.status)}, ${q(p.gender.note ?? null)}, ${p.perfumers.value ? q(p.perfumers.value) : "null"}, ${q(p.perfumers.status)}, ${q(p.perfumers.note ?? null)},
  ${q(p.family.value)}, ${q(p.family.status)}, ${q(p.family.note ?? null)}, ${q(p.notes.status)}, ${q(p.notes.note ?? null)}, ${q(p.intro.value)}, ${q(p.intro.status)}, ${q(p.intro.note ?? null)},
  ${q(p.universe)}, ${q(p.theme)}, ${q(p.look)}, ${p.sceneScale}, ${p.frontRotationY}, 'publicado', true, ${i})
on conflict (slug) do nothing;`);
  const pid = `(select id from public.perfumes where slug = ${q(p.slug)})`;
  (["top", "heart", "base"] as const).forEach((tier) =>
    p.notes.value[tier].forEach((n, k) => {
      if (!NA[normalize(n)]) throw new Error(`Nota sem classificação: ${n}`);
      out.push(`insert into public.perfume_notes (perfume_id, note_id, tier, position) values (${pid}, ${noteRef(NA[normalize(n)].name)}, '${tier}', ${k}) on conflict do nothing;`);
    }),
  );
  out.push(`insert into public.reviews (perfume_id, status, status_note, evolution, evolution_note, performance, seasons, occasions, pros, pros_note, cons, cons_note, profile, rating, rating_note)
values (${pid}, ${q(p.performance.status)}, ${q(p.performance.note ?? null)}, ${json(p.evolution.value)}, ${q(p.evolution.note ?? null)}, ${json(p.performance.value)}, ${q(p.seasons.value)}, ${q(p.occasions.value)},
  ${q(p.verdict.pros.value)}, ${q(p.verdict.pros.note ?? null)}, ${q(p.verdict.cons.value)}, ${q(p.verdict.cons.note ?? null)}, ${q(p.verdict.profile.value)}, ${q(p.verdict.rating.value)}, ${q(p.verdict.rating.note ?? null)})
on conflict (perfume_id) do nothing;`);
  const sources = [
    ...(p.notes.sources ?? []).map((s) => ({ ...s, field: "notas" })),
    ...(p.concentration.sources ?? []).map((s) => ({ ...s, field: "concentracao" })),
    ...(p.year.sources ?? []).map((s) => ({ ...s, field: "ano" })),
    ...(p.perfumers.sources ?? []).map((s) => ({ ...s, field: "perfumistas" })),
    ...(p.gender.sources ?? []).map((s) => ({ ...s, field: "publico" })),
  ];
  sources.forEach((s) =>
    out.push(`insert into public.perfume_sources (perfume_id, field, label, url) select ${pid}, ${q(s.field)}, ${q(s.label)}, ${q(s.url)}
  where not exists (select 1 from public.perfume_sources where perfume_id = ${pid} and field = ${q(s.field)} and url = ${q(s.url)});`),
  );
  out.push(`insert into public.perfume_images (perfume_id, url, kind, credit) select ${pid}, ${q(p.poster)}, 'poster', 'Render Zênite a partir do modelo 3D'
  where not exists (select 1 from public.perfume_images where perfume_id = ${pid} and kind = 'poster');`);
  out.push(`insert into public.models_3d (perfume_id, desktop_url, mobile_url, liquid_points_url) values (${pid}, ${q(p.model.desktop)}, ${q(p.model.mobile)}, ${q(p.model.liquid ?? null)}) on conflict (perfume_id) do nothing;`);
});

// ——— Rascunhos importados ———
// Além do seed completo, cada marca ganha um arquivo menor (supabase/imports/<marca>.sql)
// com as notas, a marca e os rascunhos dela — para rodar sozinho no SQL Editor.
const perBrand = new Map<string, string[]>();
for (const file of fs.readdirSync("data/imports").filter((f) => f.endsWith(".json"))) {
  const d = JSON.parse(fs.readFileSync(`data/imports/${file}`, "utf8"));
  const fileSlug = slugOf(d.brand); // "wikidata" reúne várias marcas; cada item traz a sua
  const start = out.length;
  for (const it of d.items) {
    const brandSlug = it.brandSlug ?? fileSlug;
    const linked = featuredPerfumes.find((p) => p.model.desktop && normalize(p.name) === normalize(it.name ?? "") && slugOf(p.brand) === brandSlug);
    out.push(`insert into public.import_drafts (source, url, brand_slug, payload, status, perfume_id, fetched_at) values (${q(fileSlug)}, ${q(it.url)}, ${q(brandSlug)}, ${q(it)},
  ${linked ? "'aprovado'" : "'pendente'"}, ${linked ? `(select id from public.perfumes where slug = ${q(linked.slug)})` : "null"}, ${q(it.fetchedAt ?? null)})
  on conflict (url) do update set payload = excluded.payload, fetched_at = excluded.fetched_at where public.import_drafts.status = 'pendente';`);
  }
  perBrand.set(fileSlug, out.slice(start));
}

out.push("commit;");
fs.writeFileSync("supabase/seed.sql", out.join("\n") + "\n");
console.log(`supabase/seed.sql: ${out.length} comandos`);

fs.mkdirSync("supabase/imports", { recursive: true });
for (const [slug, drafts] of perBrand) {
  const b = brands.find((x) => x.slug === slug);
  const brandSql = b
    ? [`insert into public.brands (slug, name, website) values (${q(b.slug)}, ${q(b.name)}, ${q(b.website)}) on conflict (slug) do nothing;`]
    : [];
  const body = [
    `-- Gerado por scripts/db/build-seed.ts — rascunhos de ${b?.name ?? (slug === "wikidata" ? "Wikidata (várias marcas)" : slug)} (com as notas necessárias). Pode rodar mais de uma vez.`,
    ...out.slice(1, notesEnd),
    ...brandSql,
    ...drafts,
    "commit;",
  ];
  fs.writeFileSync(`supabase/imports/${slug}.sql`, body.join("\n") + "\n");
  console.log(`supabase/imports/${slug}.sql: ${drafts.length} rascunhos`);
}
