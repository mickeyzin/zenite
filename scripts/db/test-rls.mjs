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

// ——— aprovação de rascunhos ———
const pending = (await db.query("select id, payload->>'name' as name from import_drafts where status = 'pendente' and payload->>'name' is not null order by url limit 1")).rows[0];
if (pending) {
  await as("anon", null, async () => {
    const r = await tryq(`select public.approve_draft('${pending.id}')`);
    check("anon não aprova rascunho", !!r.error, r.error?.slice(0, 50));
  });
  await as("authenticated", USER, async () => {
    const r = await tryq(`select public.approve_draft('${pending.id}')`);
    check("usuário comum não aprova rascunho", !!r.error, r.error?.slice(0, 50));
    const n = await tryq(`select public.set_perfume_notes((select id from perfumes limit 1), array['x'], array[]::text[], array[]::text[])`);
    check("usuário comum não altera pirâmide", !!n.error, n.error?.slice(0, 50));
  });
  await as("authenticated", ADMIN, async () => {
    const r = await tryq(`select public.approve_draft('${pending.id}') as id`);
    check("admin aprova rascunho", !r.error, r.error ?? pending.name);
    if (r.error) return;
    const pid = r.rows[0].id;
    const p = (await db.query(`select status, full_name, (select count(*)::int from perfume_notes where perfume_id = '${pid}') n from perfumes where id = '${pid}'`)).rows[0];
    check("perfume aprovado nasce como rascunho, com notas", p.status === "rascunho" && p.n > 0, `${p.full_name}: ${p.n} notas`);
    const again = await tryq(`select public.approve_draft('${pending.id}') as id`);
    check("aprovar de novo não duplica", !again.error && again.rows[0].id === pid);
    const d = (await db.query(`select status from import_drafts where id = '${pending.id}'`)).rows[0];
    check("rascunho marcado como aprovado", d.status === "aprovado");
    const sn = await tryq(`select public.set_perfume_notes('${pid}', array['Bergamota', 'bergamot'], array['Nota Inventada Teste'], array[]::text[])`);
    const after = (await db.query(`select n.name_pt, pn.tier from perfume_notes pn join notes n on n.id = pn.note_id where pn.perfume_id = '${pid}' order by tier, position`)).rows;
    check("pirâmide substituída; apelido em inglês vira a mesma nota; nota nova criada",
      !sn.error && after.length === 2 && after.some((r) => r.name_pt === "Nota Inventada Teste"), sn.error ?? after.map((r) => r.name_pt).join(", "));
  });
  await as("anon", null, async () => {
    const r = await tryq("select count(*)::int n from perfumes where status <> 'publicado'");
    check("perfume aprovado não aparece para o público", !r.error && r.rows[0].n === 0);
  });
}

// ——— contas de visitantes: perfil e armário ———
const ANA = "33333333-3333-3333-3333-333333333333";
await db.exec(`insert into auth.users values ('${ANA}', 'ana@x')`);
const pubId = (await db.query("select id from perfumes where status = 'publicado' limit 1")).rows[0].id;
const draftRow = (await db.query("select id from perfumes where status <> 'publicado' limit 1")).rows[0];
await as("authenticated", ANA, async () => {
  const p = await tryq(`insert into profiles (user_id, display_name, quiz_answers) values ('${ANA}', 'Ana', '{"families":["doce"]}') returning user_id`);
  check("pessoa cria o próprio perfil", !p.error, p.error);
  const w = await tryq(`insert into wardrobe (user_id, perfume_id, status) values ('${ANA}', '${pubId}', 'gostei')`);
  check("pessoa marca perfume no armário", !w.error, w.error);
  if (draftRow) {
    const d = await tryq(`insert into wardrobe (user_id, perfume_id, status) values ('${ANA}', '${draftRow.id}', 'tenho')`);
    check("armário recusa perfume não publicado", !!d.error, d.error?.slice(0, 60));
  }
  const fake = await tryq(`insert into profiles (user_id, display_name) values ('${USER}', 'Impostor')`);
  check("ninguém cria perfil em nome de outra pessoa", !!fake.error, fake.error?.slice(0, 60));
});
await as("authenticated", USER, async () => {
  const r = await tryq("select count(*)::int n from profiles");
  check("outra pessoa não vê o perfil alheio", !r.error && r.rows[0].n === 0);
  const w = await tryq("select count(*)::int n from wardrobe");
  check("outra pessoa não vê o armário alheio", !w.error && w.rows[0].n === 0);
  const u = await tryq(`update profiles set display_name = 'x' where user_id = '${ANA}' returning 1`);
  check("outra pessoa não altera o perfil alheio", !!u.error || u.rows.length === 0);
});
await as("anon", null, async () => {
  const r = await tryq("select * from profiles");
  check("visitante sem conta não lê perfis", !!r.error || r.rows.length === 0, r.error ? "negado" : "");
  const d = await tryq("select public.delete_my_account()");
  check("visitante sem conta não apaga contas", !!d.error);
});
await as("authenticated", ADMIN, async () => {
  const d = await tryq("select public.delete_my_account()");
  check("conta de admin não é apagada pelo botão", !!d.error, d.error?.slice(0, 60));
});
await as("authenticated", ANA, async () => {
  const d = await tryq("select public.delete_my_account()");
  check("pessoa apaga a própria conta", !d.error, d.error);
});
const left = (await db.query(`select (select count(*)::int from auth.users where id = '${ANA}') u, (select count(*)::int from profiles where user_id = '${ANA}') p, (select count(*)::int from wardrobe where user_id = '${ANA}') w`)).rows[0];
check("ao apagar, perfil e armário somem junto", left.u === 0 && left.p === 0 && left.w === 0, JSON.stringify(left));

// ——— aprendizado pelo uso (só com autorização) ———
const BIA = "44444444-4444-4444-4444-444444444444";
await db.exec(`insert into auth.users values ('${BIA}', 'bia@x')`);
await as("authenticated", BIA, async () => {
  await tryq(`insert into profiles (user_id) values ('${BIA}')`);
  const no = await tryq(`insert into user_events (user_id, kind, perfume_id) values ('${BIA}', 'view', '${pubId}')`);
  check("sem autorização, nada é registrado", !!no.error, no.error?.slice(0, 50));
  await tryq(`update profiles set learning_consent = true, learning_consent_at = now() where user_id = '${BIA}'`);
  const yes = await tryq(`insert into user_events (user_id, kind, perfume_id) values ('${BIA}', 'view', '${pubId}')`);
  check("com autorização, registra", !yes.error, yes.error);
  const note = await tryq(`insert into user_events (user_id, kind, note) values ('${BIA}', 'search_note', 'Baunilha')`);
  check("registra nota pesquisada", !note.error, note.error);
  const bad = await tryq(`insert into user_events (user_id, kind) values ('${BIA}', 'view')`);
  check("registro incompleto é recusado", !!bad.error);
  const other = await tryq(`insert into user_events (user_id, kind, perfume_id) values ('${USER}', 'view', '${pubId}')`);
  check("ninguém registra em nome de outra pessoa", !!other.error);
});
await as("authenticated", USER, async () => {
  const r = await tryq("select count(*)::int n from user_events");
  check("outra pessoa não vê o histórico alheio", !r.error && r.rows[0].n === 0);
});
await as("anon", null, async () => {
  const r = await tryq("select * from user_events");
  check("visitante sem conta não lê histórico", !!r.error || r.rows.length === 0);
});
await as("authenticated", BIA, async () => {
  const n1 = (await db.query(`select count(*)::int n from user_events where user_id = '${BIA}'`)).rows[0].n;
  await tryq(`update profiles set learning_consent = false where user_id = '${BIA}'`);
  const n2 = (await db.query(`select count(*)::int n from user_events where user_id = '${BIA}'`)).rows[0].n;
  check("desligar a autorização apaga o histórico", n1 === 2 && n2 === 0, `${n1} → ${n2}`);
});

console.log(`\n${pass} ok, ${fail} falhas`);
process.exit(fail ? 1 : 0);
