// Testa a migração e as regras de segurança num Postgres embutido (PGlite),
// imitando o Supabase (papéis anon/authenticated, auth.uid(), storage).
// Uso: node scripts/db/test-rls.mjs [--seed]
import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
import { migration, prepare } from "./pglite-supabase.mjs";

const db = new PGlite();
let pass = 0, fail = 0;
const check = (name, ok, extra = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "✔" : "✘"} ${name}${extra ? " — " + extra : ""}`);
};
const as = async (role, uid, fn) => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid ?? ""}', false); set role ${role};`);
  try { return await fn(); } finally { await db.exec("reset role;"); }
};
const tryq = async (q) => { try { return { rows: (await db.query(q)).rows }; } catch (e) { return { error: e.message }; } };

await prepare(db);
await db.exec(migration()); // reexecutar não pode quebrar
check("migração executa (2×, idempotente)", true);

const ADMIN = "11111111-1111-1111-1111-111111111111";
const USER = "22222222-2222-2222-2222-222222222222";
await db.exec(`insert into auth.users values ('${ADMIN}', 'admin@x'), ('${USER}', 'user@x'); insert into public.admins values ('${ADMIN}');`);

if (process.argv.includes("--seed")) {
  const seed = fs.readFileSync(new URL("../../supabase/seed.sql", import.meta.url), "utf8");
  try {
    await db.exec(seed);
  } catch (e) {
    // Mensagem curta: o erro do PGlite traz o SQL inteiro.
    console.error("seed falhou:", e.message?.slice(0, 300), e.detail ?? "", e.where ?? "");
    const near = e.position ? seed.slice(Math.max(0, Number(e.position) - 200), Number(e.position) + 100) : "";
    if (near) console.error("perto de:", near);
    process.exit(1);
  }
  const n = (await db.query("select (select count(*) from perfumes) p, (select count(*) from notes) n, (select count(*) from note_aliases) a, (select count(*) from import_drafts) d, (select count(*) from perfume_notes) pn")).rows[0];
  check("seed carrega", Number(n.p) > 0, JSON.stringify(n));
} else {
  await db.exec(`insert into brands (slug, name) values ('lattafa', 'Lattafa');
    insert into perfumes (slug, brand_id, name, full_name, status) select 'pub', id, 'Pub', 'Pub', 'publicado' from brands;
    insert into perfumes (slug, brand_id, name, full_name, status) select 'draft', id, 'Draft', 'Draft', 'rascunho' from brands;
    insert into import_drafts (source, url, brand_slug, payload) values ('lattafa', 'https://l/1', 'lattafa', '{}');`);
}

// Oferta de teste (o seed não traz ofertas: preços só entram verificados).
await db.exec(`insert into stores (slug, name) values ('teste', 'Loja teste');
  insert into offers (perfume_id, store_id, title, url)
    select p.id, s.id, 'Oferta', 'https://x' from perfumes p, stores s where p.status = 'publicado' and s.slug = 'teste' limit 1;`);

// ——— anon ———
await as("anon", null, async () => {
  const r = await tryq("select slug, status from perfumes");
  check("anon vê só publicados", !r.error && r.rows.every((x) => x.status === "publicado") && r.rows.length > 0, r.error ?? `${r.rows.length} linhas`);
  const d = await tryq("select * from import_drafts");
  check("anon não lê rascunhos", !!d.error || d.rows.length === 0, d.error ? "negado" : `${d.rows.length}`);
  const w = await tryq("insert into perfumes (slug, brand_id, name, full_name) select 'hack', id, 'h', 'h' from brands limit 1");
  check("anon não cria perfume", !!w.error, w.error?.slice(0, 60));
  const u = await tryq("update perfumes set name = 'x' returning id");
  check("anon não altera perfume", !!u.error || u.rows.length === 0, u.error ? "negado" : `${u.rows.length} alteradas`);
  const c = await tryq("insert into offer_clicks (offer_id) select id from offers limit 1");
  check("anon registra clique em oferta ativa", !c.error, c.error);
  const cr = await tryq("select * from offer_clicks");
  check("anon não lê cliques", !!cr.error || cr.rows.length === 0, cr.error ? "negado" : `${cr.rows.length}`);
  const ad = await tryq("select * from admins");
  check("anon não lê administradores", !!ad.error || ad.rows.length === 0);
});

// ——— usuário logado, não admin ———
await as("authenticated", USER, async () => {
  const w = await tryq("insert into perfumes (slug, brand_id, name, full_name) select 'hack2', id, 'h', 'h' from brands limit 1");
  check("usuário comum não cria perfume", !!w.error, w.error?.slice(0, 60));
  const r = await tryq("select count(*)::int n from perfumes where status <> 'publicado'");
  check("usuário comum não vê não publicados", !r.error && r.rows[0].n === 0);
  const me = await tryq("insert into admins values ('" + USER + "')");
  check("usuário comum não se torna admin", !!me.error, me.error?.slice(0, 60));
});

// ——— admin ———
await as("authenticated", ADMIN, async () => {
  const r = await tryq("select count(*)::int n from perfumes");
  check("admin vê todos os perfumes", !r.error && r.rows[0].n >= 1, r.error ?? `${r.rows[0].n}`);
  const d = await tryq("select count(*)::int n from import_drafts");
  check("admin lê rascunhos", !d.error && d.rows[0].n >= 1, d.error);
  const u = await tryq("update perfumes set featured = true where slug = (select slug from perfumes order by slug limit 1) returning updated_at");
  check("admin altera perfume", !u.error && u.rows.length === 1, u.error);
  const o = await tryq("update offers set price = 199.9 returning id");
  check("admin altera oferta", !o.error, o.error);
  const h = await tryq("select count(*)::int n from offer_price_history");
  check("histórico de preço registrado", !h.error && h.rows[0].n >= 1, h.error);
  const l = await tryq("select count(*)::int n from change_log");
  check("histórico de alterações registrado", !l.error && l.rows[0].n >= 1, l.error ?? `${l.rows[0]?.n}`);
  const bad = await tryq("insert into offers (perfume_id, store_id, title, url, affiliate_url, is_affiliate) select p.id, s.id, 't', 'u', 'https://aff', false from perfumes p, stores s limit 1");
  check("link de afiliado exige marcação de afiliado", !!bad.error);
});

console.log(`\n${pass} ok, ${fail} falhas`);
process.exit(fail ? 1 : 0);
