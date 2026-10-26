#!/usr/bin/env node
/**
 * Importa perfumes do Wikidata (dados abertos, licença CC0) pela consulta pública
 * (query.wikidata.org). Só perfumes com pirâmide por camada: "smells of" (P5872)
 * com o qualificador "has characteristic" (P1552) = nota de topo/coração/fundo.
 *
 * Também traz a foto do perfume (P18) quando ela existe no Wikimedia Commons com licença
 * livre, com autor e licença para o crédito; perfumes famosos que só têm foto entram
 * "sem pirâmide" (as notas são completadas à mão).
 *
 * O Wikidata é colaborativo: tudo entra como rascunho "a confirmar", com a fonte
 * citada, para conferência humana antes de publicar.
 *
 * Uso: node scripts/importers/wikidata.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { finish, ROOT, sleep, UA } from "./lib.mjs";

const OUT = path.join(process.env.ZENITE_IMPORT_DIR ?? path.join(ROOT, "data/imports"), "wikidata.json");
const ENDPOINT = "https://query.wikidata.org/sparql";
const TIER = { Q124382774: "top", Q124382780: "heart", Q124382781: "base" };
// Marcas que já vêm do site oficial (lá a fonte é melhor) ficam de fora.
const SKIP_BRANDS = new Set(["lattafa", "afnan", "swiss-arabian", "khadlaj"]);

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function sparql(query) {
  const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/sparql-results+json" } });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return (await res.json()).results.bindings;
}
const id = (b, k) => b[k]?.value.split("/").pop();
// No Wikidata as notas são itens "smell of rose", "vanilla scent": fica só o nome da nota.
const clean = (s) =>
  s
    .replace(/^(?:the\s+)?(?:smell|scent|aroma|fragrance|odou?r)\s+of\s+(?:the\s+)?/i, "")
    .replace(/\s+(?:smell|scent|aroma|fragrance|note|odou?r)$/i, "")
    .trim();
const val = (b, k) => b[k]?.value ?? null;

const NOTES_Q = `SELECT ?i ?iLabel ?note ?noteLabel ?tier WHERE {
  ?i wdt:P31 wd:Q131746 ; p:P5872 ?st .
  ?st ps:P5872 ?note ; pq:P1552 ?tier .
  VALUES ?tier { wd:Q124382774 wd:Q124382780 wd:Q124382781 }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,pt,fr,de". }
}`;
const META_Q = `SELECT ?i ?iLabel ?brandLabel ?makerLabel ?year ?perfumerLabel ?publicLabel ?img WHERE {
  ?i wdt:P31 wd:Q131746 .
  { ?i p:P5872/pq:P1552 ?t } UNION { ?i wdt:P18 ?anyImg }
  OPTIONAL { ?i wdt:P18 ?img }
  OPTIONAL { ?i wdt:P1716 ?brand }
  OPTIONAL { ?i wdt:P176 ?maker }
  OPTIONAL { ?i wdt:P571 ?d . BIND(YEAR(?d) AS ?year) }
  OPTIONAL { ?i wdt:P14539 ?perfumer }
  OPTIONAL { ?i wdt:P2360 ?public }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,pt,fr,de". }
}`;

// Fotos que não mostram o frasco (anúncios antigos, exposições, paisagens): ficam de fora.
const NOT_BOTTLE = /vogue|cappiello|valensole|dokumentation|hallwylska|golden moments/i;
const FREE = /^(cc0|cc[ -]by(-sa)?[ -]?\d|public domain|pd\b|pd-)/i;

/** Autor e licença das fotos no Commons (um pedido para até 50 arquivos, com nova tentativa se limitar). */
async function commonsInfo(files) {
  const out = new Map();
  for (let i = 0; i < files.length; i += 50) {
    const titles = files.slice(i, i + 50).map((f) => `File:${f}`).join("|");
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&titles=${encodeURIComponent(titles)}`;
    let res;
    for (let t = 0; t < 10; t++) {
      res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.status !== 429) break;
      console.log("Commons pediu para esperar; nova tentativa em 60 s");
      await sleep(60_000);
    }
    if (!res.ok) throw new Error(`Commons ${res.status}`);
    const strip = (v) => String(v ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    for (const p of Object.values((await res.json()).query.pages)) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const m = ii.extmetadata ?? {};
      out.set(p.title.slice(5), {
        url: ii.thumburl ?? ii.url,
        page: ii.descriptionurl,
        license: strip(m.LicenseShortName?.value),
        artist: strip(m.Artist?.value).slice(0, 80),
      });
    }
    await sleep(2000);
  }
  return out;
}

async function main() {
  const notes = await sparql(NOTES_Q);
  await sleep(5000);
  const meta = await sparql(META_Q);

  const items = new Map();
  for (const b of notes) {
    const q = id(b, "i");
    const it = items.get(q) ?? { q, label: val(b, "iLabel"), notes: { top: [], heart: [], base: [] } };
    const tier = TIER[id(b, "tier")];
    const raw = val(b, "noteLabel");
    const note = raw && clean(raw);
    // Sem rótulo, o Wikidata devolve o código (Q123): não é um nome de nota.
    if (tier && note && !/^Q\d+$/.test(note) && !it.notes[tier].includes(note)) it.notes[tier].push(note);
    items.set(q, it);
  }
  for (const b of meta) {
    const q = id(b, "i");
    // Perfume sem pirâmide, mas com foto: entra também (as notas são completadas à mão).
    if (!items.has(q) && val(b, "img")) items.set(q, { q, label: val(b, "iLabel"), notes: { top: [], heart: [], base: [] } });
    const it = items.get(q);
    if (!it) continue;
    const img = val(b, "img");
    if (img) it.imageFile ??= decodeURIComponent(img.split("/").pop());
    it.brand ??= val(b, "brandLabel") ?? val(b, "makerLabel");
    const y = Number(val(b, "year"));
    if (y >= 1700 && y <= 2100) it.year = Math.min(it.year ?? y, y);
    const perf = val(b, "perfumerLabel");
    if (perf && !/^Q\d+$/.test(perf)) {
      it.perfumers ??= [];
      if (!it.perfumers.includes(perf)) it.perfumers.push(perf);
    }
    it.public ??= val(b, "publicLabel");
  }

  const files = [...new Set([...items.values()].map((i) => i.imageFile).filter((f) => f && !NOT_BOTTLE.test(f)))];
  const photos = await commonsInfo(files);

  const out = [];
  const skipped = { semMarca: 0, marcaOficial: 0, fotoSemLicencaLivre: 0 };
  for (const it of items.values()) {
    if (!it.brand || /^Q\d+$/.test(it.brand)) {
      skipped.semMarca++;
      continue;
    }
    const brandSlug = slug(it.brand);
    if (SKIP_BRANDS.has(brandSlug)) {
      skipped.marcaOficial++;
      continue;
    }
    // Rótulo às vezes repete a marca ("Mugler Angel"): fica só o nome do perfume.
    // (mas não quando sobra um pedaço como "for Men": aí o nome é o rótulo inteiro).
    const stripped = it.label.replace(new RegExp(`^${it.brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i"), "").trim();
    const name = /^\p{Ll}/u.test(stripped) ? it.label : stripped;
    const pub = (it.public ?? "").toLowerCase();
    const item = {
      url: `https://www.wikidata.org/wiki/${it.q}`,
      name,
      brand: it.brand,
      brandName: it.brand,
      brandSlug,
      size: null,
      gender: /unisex/.test(pub) ? "Unissex" : /wom|fem/.test(pub) ? "Feminino" : /\bmen\b|\bman\b|mascul/.test(pub) ? "Masculino" : null,
      year: it.year ?? null,
      perfumers: it.perfumers ?? null,
      sourceLabel: "Wikidata (CC0)",
      notesStatus: "a-confirmar",
      notesNote: "Pirâmide do Wikidata (base colaborativa, licença CC0). Conferir com a marca antes de publicar.",
      fetchedAt: new Date().toISOString(),
    };
    const photo = it.imageFile && photos.get(it.imageFile);
    if (photo && FREE.test(photo.license) && photo.artist) {
      item.imageUrl = photo.url;
      item.imageCredit = `Foto: ${photo.artist} (Wikimedia Commons)`;
      item.imageLicense = photo.license;
      item.imagePage = photo.page;
    } else if (photo) skipped.fotoSemLicencaLivre++;
    const n = it.notes;
    out.push(finish(item, n.top.length + n.heart.length + n.base.length ? n : null));
  }
  // Mesmo nome na mesma marca (ex.: versões de anos diferentes): o ano entra no nome.
  const seen = new Map();
  for (const it of out) seen.set(`${it.brandSlug}|${it.name.toLowerCase()}`, (seen.get(`${it.brandSlug}|${it.name.toLowerCase()}`) ?? 0) + 1);
  for (const it of out) if (seen.get(`${it.brandSlug}|${it.name.toLowerCase()}`) > 1 && it.year) it.name = `${it.name} (${it.year})`;
  out.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
  fs.writeFileSync(OUT, JSON.stringify({ brand: "Wikidata", source: "https://www.wikidata.org", license: "CC0", items: out, updatedAt: new Date().toISOString() }, null, 2));
  const ok = out.filter((i) => i.review === "ok").length;
  console.log(`wikidata: ${items.size} perfumes com pirâmide; ${out.length} rascunhos (${ok} completos); fora: ${JSON.stringify(skipped)}`);
  console.log(`em ${path.relative(ROOT, OUT)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
