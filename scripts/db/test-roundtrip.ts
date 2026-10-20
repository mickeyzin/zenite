/**
 * Ida e volta: dados locais → seed.sql → linhas no formato do PostgREST →
 * rowToPerfume → deve ser igual aos dados locais. Garante que nada se perde
 * ao trocar a fonte do site para o banco.
 * Uso: npm run db:test:roundtrip
 */
import fs from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { rowToPerfume } from "../../src/data/catalog";
import { featuredPerfumes } from "../../src/data/perfumes";
import { prepare } from "./pglite-supabase.mjs";

const db = new PGlite();
await prepare(db);
await db.exec(fs.readFileSync("supabase/seed.sql", "utf8"));

const { rows } = await db.query<{ row: unknown }>(`
  select to_jsonb(p) || jsonb_build_object(
    'brand', (select jsonb_build_object('name', b.name) from brands b where b.id = p.brand_id),
    'perfume_notes', coalesce((select jsonb_agg(jsonb_build_object('tier', pn.tier, 'position', pn.position, 'note', jsonb_build_object('name_pt', n.name_pt)))
                               from perfume_notes pn join notes n on n.id = pn.note_id where pn.perfume_id = p.id), '[]'),
    'reviews', (select to_jsonb(r) from reviews r where r.perfume_id = p.id),
    'perfume_sources', coalesce((select jsonb_agg(jsonb_build_object('field', s.field, 'label', s.label, 'url', s.url) order by s.ctid) from perfume_sources s where s.perfume_id = p.id), '[]'),
    'perfume_images', coalesce((select jsonb_agg(jsonb_build_object('url', i.url, 'kind', i.kind, 'position', i.position)) from perfume_images i where i.perfume_id = p.id), '[]'),
    'models_3d', (select to_jsonb(m) from models_3d m where m.perfume_id = p.id),
    'similar_overrides', '[]'::jsonb
  ) as row from perfumes p order by p.featured_order`);

// Compara ignorando campos ausentes/undefined e a ordem das chaves.
const clean = (v: unknown): unknown =>
  JSON.parse(JSON.stringify(v, (_k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort()) : x)));
const diffs: string[] = [];
const walk = (a: unknown, b: unknown, path: string) => {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b as object)])) walk((a as never)[k], (b as never)[k], `${path}.${k}`);
    return;
  }
  diffs.push(`${path}: local=${JSON.stringify(a)?.slice(0, 90)} banco=${JSON.stringify(b)?.slice(0, 90)}`);
};
featuredPerfumes.forEach((p, i) => walk(clean(p), clean(rowToPerfume(rows[i].row as never)), p.slug));
if (diffs.length) {
  console.log(diffs.join("\n"));
  console.log(`\n✘ ${diffs.length} diferenças`);
  process.exit(1);
}
console.log(`✔ ida e volta sem perdas (${rows.length} perfumes)`);
