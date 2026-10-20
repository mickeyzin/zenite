#!/usr/bin/env node
/**
 * Importador de fatos do site oficial da Lattafa (lattafa.com).
 *
 * Regras (ver scripts/importers/README.md):
 * - lê o robots.txt antes e obedece Disallow e Crawl-delay (mínimo 10 s);
 * - identifica-se como ZeniteBot, com o endereço do projeto;
 * - extrai SÓ fatos: nome, código, volume, público e pirâmide olfativa;
 *   não copia fotos, textos de marketing nem avaliações de clientes;
 * - grava rascunhos para revisão humana (nada é publicado direto);
 * - é retomável: URLs já lidas não são buscadas de novo.
 *
 * Uso: node scripts/importers/lattafa.mjs [--limit 20] [--only art-of-universe]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const OUT = path.join(ROOT, "data/imports/lattafa.json");
const DICT = JSON.parse(fs.readFileSync(path.join(ROOT, "data/notes-pt.json"), "utf8"));
const UA = "ZeniteBot/0.1 (+https://github.com/mickeyzin/zenite)";
const BASE = "https://lattafa.com";

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const LIMIT = Number(opt("--limit", 20));
const ONLY = opt("--only", null);

// Produtos que não são perfume para a pele (ou são kits) ficam de fora.
const EXCLUDE = /(deo|deodorant|giftset|gift-set|gift_set|body-|lotion|shower|soap|hair-?(oil|serum)|shampoo|car-|air-|room|home|candle|bakhoor|incense-stick|diffuser|freshener|reed|mist-?collection|combo|bundle|pack-of|set-of)/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xml" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
};

function parseRobots(txt) {
  const rules = [];
  let delay = 0;
  let applies = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const [k, ...rest] = line.split(":");
    const v = rest.join(":").trim();
    if (/^user-agent$/i.test(k)) applies = v === "*" || /zenitebot/i.test(v);
    else if (applies && /^disallow$/i.test(k) && v) rules.push(v);
    else if (applies && /^crawl-delay$/i.test(k)) delay = Math.max(delay, Number(v) || 0);
  }
  const blocked = (p) =>
    rules.some((r) => new RegExp("^" + r.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")).test(p));
  return { delay, blocked };
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const textOf = (html) =>
  decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "\n"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");

function translate(list, unknown) {
  return list.map((n) => {
    const key = n.toLowerCase().replace(/\s+/g, " ").trim();
    if (DICT[key]) return DICT[key];
    unknown.push(n);
    return n;
  });
}

function parseNotes(s) {
  const split = (v) => v.split(/,|\band\b|&/).map((x) => x.replace(/\.$/, "").trim()).filter(Boolean);
  const grab = (label) => {
    const m = s.match(new RegExp(`${label}\\s*(?:notes?)?\\s*[-–:]\\s*([^\\n]+)`, "i"));
    return m ? split(m[1]) : null;
  };
  const top = grab("top");
  const heart = grab("(?:heart|middle)");
  const base = grab("base");
  if (top || heart || base) return { top: top ?? [], heart: heart ?? [], base: base ?? [] };
  return null;
}

function extract(url, html) {
  const item = { url, fetchedAt: new Date().toISOString() };
  // 1) Dados estruturados (schema.org Product)
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      const graph = Array.isArray(j) ? j : j["@graph"] ?? [j];
      const p = graph.find((g) => g && (g["@type"] === "Product" || (Array.isArray(g["@type"]) && g["@type"].includes("Product"))));
      if (p) {
        item.name = decode(p.name ?? "").trim();
        item.sku = p.sku ?? null;
        item.notesRaw = p.description ? decode(p.description) : null;
      }
    } catch {
      /* JSON inválido: ignora */
    }
  }
  // 2) Texto da página (volume, público e notas, se não vieram nos dados estruturados)
  const text = textOf(html);
  const size = text.match(/Size:\s*([\d.,]+\s*ML)/i);
  const type = text.match(/Fragrance type:\s*\n?\s*(Men|Women|Unisex)/i);
  item.size = size ? size[1].replace(/\s+/, " ").toUpperCase() : null;
  item.gender = type ? { men: "Masculino", women: "Feminino", unisex: "Unissex" }[type[1].toLowerCase()] : null;
  if (!item.notesRaw) {
    const i = text.indexOf("Fragrance Notes:");
    if (i >= 0) item.notesRaw = text.slice(i + 16, i + 400).split("\nRelated products")[0];
  }
  const notes = item.notesRaw ? parseNotes(item.notesRaw) : null;
  const unknown = [];
  item.notesEn = notes;
  item.notes = notes ? { top: translate(notes.top, unknown), heart: translate(notes.heart, unknown), base: translate(notes.base, unknown) } : null;
  item.unknownNotes = [...new Set(unknown)];
  item.review = !item.name ? "sem nome" : !notes ? "sem pirâmide" : unknown.length ? "notas sem tradução" : "ok";
  return item;
}

async function main() {
  const robots = parseRobots(await get(`${BASE}/robots.txt`));
  const delay = Math.max(10, robots.delay) * 1000;
  console.log(`robots.txt: crawl-delay ${delay / 1000}s`);
  await sleep(delay);

  const sitemap = await get(`${BASE}/product-sitemap.xml`);
  let urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.includes("/product/"));
  const total = urls.length;
  // Só a versão em inglês: as páginas /ar/ repetem o produto sem a pirâmide nos dados.
  urls = urls.filter((u) => !EXCLUDE.test(new URL(u).pathname) && !new URL(u).pathname.startsWith("/ar/"));
  if (ONLY) urls = urls.filter((u) => u.includes(ONLY));
  console.log(`sitemap: ${total} produtos, ${urls.length} perfumes candidatos`);

  const db = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { brand: "Lattafa", source: BASE, items: [] };
  const done = new Set(db.items.map((i) => i.url));
  const todo = urls.filter((u) => !done.has(u)).slice(0, LIMIT);
  console.log(`a ler agora: ${todo.length} (já lidos: ${done.size})`);

  for (const [n, url] of todo.entries()) {
    const p = new URL(url).pathname;
    if (robots.blocked(p)) {
      console.log(`bloqueado pelo robots.txt: ${p}`);
      continue;
    }
    await sleep(delay);
    try {
      const it = extract(url, await get(url));
      db.items.push(it);
      console.log(`[${n + 1}/${todo.length}] ${it.name ?? p} — ${it.review}${it.unknownNotes.length ? " (" + it.unknownNotes.join(", ") + ")" : ""}`);
    } catch (e) {
      console.log(`[${n + 1}/${todo.length}] erro: ${e.message}`);
    }
    db.updatedAt = new Date().toISOString();
    fs.writeFileSync(OUT, JSON.stringify(db, null, 2));
  }
  const ok = db.items.filter((i) => i.review === "ok").length;
  console.log(`\npronto: ${db.items.length} rascunhos (${ok} completos) em ${path.relative(ROOT, OUT)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
