#!/usr/bin/env node
/**
 * Importador de fatos de lojas oficiais em Shopify (Afnan, Swiss Arabian, Khadlaj).
 * Lê as páginas públicas de produto listadas no sitemap da marca e extrai SÓ fatos:
 * nome, volume, público (quando explícito no nome) e pirâmide olfativa
 * ("Top/Middle/Base Notes"). Não copia fotos, descrições, avaliações nem preços.
 *
 * Uso: node scripts/importers/shopify.mjs <marca> [--limit 40] [--retranslate]
 *      marcas: afnan | swiss-arabian | khadlaj
 */
import path from "node:path";
import { crawl, decode, finish, get, parseNotes, retranslate, ROOT, sleep, textOf } from "./lib.mjs";

const BRANDS = {
  afnan: { brand: "Afnan", base: "https://afnan.com" },
  "swiss-arabian": { brand: "Swiss Arabian", base: "https://swissarabian.com" },
  khadlaj: { brand: "Khadlaj", base: "https://khadlaj-perfumes.com" },
};

const args = process.argv.slice(2);
const key = args[0];
const cfg = BRANDS[key];
if (!cfg) {
  console.error(`marca desconhecida: ${key ?? "(nenhuma)"} — use ${Object.keys(BRANDS).join(", ")}`);
  process.exit(1);
}
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const LIMIT = Number(opt("--limit", 40));
const OUT = path.join(ROOT, `data/imports/${key}.json`);

// Só perfume para a pele, em spray. Óleos, incensos, kits e itens de casa/corpo ficam de fora.
const EXCLUDE =
  /(\boil\b|-oil|attar|dehn|muattar|mukhallat|bakh?oor|bukhoor|mamoul|incense|\d+\s*-?gr?a?m\b|grm|gift|-set\b|set-|bundle|deo\b|deodorant|body|lotion|shower|soap|\bmist\b|-mist|hair|candle|diffuser|air-|car-|room|home|freshener|sample|tester|discovery|combo|pack|kit\b|wash|cream|chips|burner|mabkhara|refill|pouch|travel|miniature|roll-?on|\bbox\b)/i;

const titleCase = (s) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s\-'’(])(\p{L})/gu, (_, a, b) => a + b.toUpperCase()) : s;

function extract(url, html) {
  const item = { url };
  let variants = [];
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      const graph = Array.isArray(j) ? j : (j["@graph"] ?? [j]);
      const p = graph.find((g) => g && /Product/.test([].concat(g["@type"] ?? []).join(" ")));
      if (p && !item.name) {
        item.name = titleCase(decode(String(p.name ?? "")).trim());
        item.sku = p.sku ?? p.productGroupID ?? null;
        variants = [].concat(p.hasVariant ?? []).map((v) => String(v.name ?? ""));
      }
    } catch {
      /* JSON inválido: ignora */
    }
  }
  if (!item.name) return finish(item, null);
  if (EXCLUDE.test(new URL(url).pathname) || EXCLUDE.test(item.name)) return null;

  const text = textOf(html);
  // Volume: nas variantes do produto (ex.: "Rare Carbon - 100ml"); se houver vários, o maior.
  const sizes = [...variants.join(" ").matchAll(/(\d{2,3})\s*ml\b/gi)].map((m) => Number(m[1]));
  const own = sizes.length ? sizes : [...(item.name.match(/(\d{2,3})\s*ml\b/i) ?? [])].slice(1).map(Number);
  item.size = own.length ? `${Math.max(...own)} ML` : null;
  item.name = item.name.replace(/\s*[-–|]?\s*\d{2,3}\s*ml\b.*$/i, "").trim();
  // Público só quando está escrito no nome.
  item.gender = /pour homme|for men|\bmen\b|\bhomme\b/i.test(item.name)
    ? "Masculino"
    : /pour femme|for women|\bwomen\b|\bfemme\b/i.test(item.name)
      ? "Feminino"
      : /unisex/i.test(item.name)
        ? "Unissex"
        : null;
  // Pirâmide: a partir do primeiro "Top Note(s):" (o texto de marketing antes dele é ignorado).
  const i = text.search(/(?:top|head)\s*notes?\s*(?:[-–:]|\n)/i);
  item.notesRaw = i >= 0 ? text.slice(i, i + 600) : null;
  return finish(item, item.notesRaw ? parseNotes(item.notesRaw) : null);
}

async function productUrls() {
  const index = await get(`${cfg.base}/sitemap.xml`);
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => decode(m[1]))
    .filter((u) => /sitemap_products_\d/.test(u) && !/\.com\/[a-z]{2}(-[a-z]{2})?\//i.test(u));
  const urls = [];
  for (const map of maps) {
    await sleep(10_000);
    const xml = await get(map);
    urls.push(...[...xml.matchAll(/<loc>([^<]+\/products\/[^<]+)<\/loc>/g)].map((m) => decode(m[1])));
  }
  return [...new Set(urls)].filter((u) => !EXCLUDE.test(new URL(u).pathname));
}

async function main() {
  if (args.includes("--retranslate")) return retranslate(OUT);
  const urls = await productUrls();
  await crawl({ base: cfg.base, brand: cfg.brand, out: OUT, urls, extract, limit: LIMIT });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
