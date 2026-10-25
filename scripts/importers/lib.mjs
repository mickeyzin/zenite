/**
 * Funções comuns aos importadores de fabricantes (ver README.md desta pasta).
 * Regras: obedecer robots.txt (mínimo 10 s entre páginas), identificar-se como
 * ZeniteBot, extrair só fatos e gravar rascunhos para revisão humana.
 */
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
export const UA = "ZeniteBot/0.1 (+https://github.com/mickeyzin/zenite)";
const DICT = JSON.parse(fs.readFileSync(path.join(ROOT, "data/notes-pt.json"), "utf8"));

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xml" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

export function parseRobots(txt) {
  const rules = [];
  let delay = 0;
  let applies = false;
  let lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const [k, ...rest] = line.split(":");
    const v = rest.join(":").trim();
    if (/^user-agent$/i.test(k)) {
      const match = v === "*" || /zenitebot/i.test(v);
      applies = lastWasAgent ? applies || match : match;
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (applies && /^disallow$/i.test(k) && v) rules.push(v);
    else if (applies && /^crawl-delay$/i.test(k)) delay = Math.max(delay, Number(v) || 0);
  }
  const toRe = (r) => new RegExp("^" + r.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
  const blocked = (p) => rules.some((r) => toRe(r).test(p));
  return { delay, blocked };
}

export const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

export const textOf = (html) =>
  decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "\n"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");

/** Valores com "|" no dicionário expandem uma nota combinada em várias. */
export function translate(list, unknown) {
  return list.flatMap((n) => {
    const key = n.toLowerCase().replace(/\s+/g, " ").trim();
    if (DICT[key] === "") return []; // não é nota (ex.: "soft")
    if (DICT[key]) return DICT[key].split("|");
    unknown.push(n);
    return [n];
  });
}

/** "Top Notes: A, B and C" / "Middle Note:\nD, E" / "Base - F" → listas. */
export function parseNotes(s) {
  const split = (v) =>
    v
      .replace(/[\u00c2\u00a0]/g, " ") // espaço não separável mal codificado ("Â")
      .replace(/([a-z])([A-Z])/g, "$1, $2") // notas grudadas ("WoodyOrange Blossom")
      .split(/,|\band\b|&|\//)
      .map((x) =>
        x
          .trim()
          .replace(/^[a-z]{1,2}:\s*/i, "") // sobra de rótulo ("s: Virginia Cedar")
          .replace(/\.$/, "")
          .replace(/\s+/g, " ")
          .trim(),
      )
      .filter((x) => x.length >= 2 && x.length <= 40 && !/[<>]/.test(x));
  const grab = (label) => {
    const m = s.match(new RegExp(`(?:^|\\n|\\s)${label}\\s*(?:notes?)?\\s*(?:[-–:]\\s*\\n?|\\n)\\s*([^\\n]+)`, "i"));
    return m ? split(m[1]) : null;
  };
  const top = grab("(?:top|head)");
  const heart = grab("(?:heart|middle)");
  const base = grab("base");
  if (top || heart || base) return { top: top ?? [], heart: heart ?? [], base: base ?? [] };
  return null;
}

/** Aplica tradução e marca a situação de revisão de um item. */
export function finish(item, notesEn) {
  const unknown = [];
  item.notesEn = notesEn;
  item.notes = notesEn ? { top: translate(notesEn.top, unknown), heart: translate(notesEn.heart, unknown), base: translate(notesEn.base, unknown) } : null;
  item.unknownNotes = [...new Set(unknown)];
  item.review = !item.name ? "sem nome" : !notesEn ? "sem pirâmide" : unknown.length ? "notas sem tradução" : "ok";
  return item;
}

/** Retraduz um arquivo de rascunhos com o dicionário atual, sem acessar o site. */
export function retranslate(file) {
  const db = JSON.parse(fs.readFileSync(file, "utf8"));
  // Relê o texto original guardado (notesRaw), para valerem as correções do leitor.
  for (const it of db.items) if (it.notesRaw || it.notesEn) finish(it, it.notesRaw ? parseNotes(it.notesRaw) : it.notesEn);
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
  console.log(`retraduzidos: ${db.items.filter((i) => i.review === "ok").length} de ${db.items.length} completos`);
}

/**
 * Lê as URLs com o intervalo exigido e grava os rascunhos (retomável).
 * `extract(url, html)` devolve o item; `null` descarta (ex.: não é perfume).
 */
export async function crawl({ base, brand, out, urls, extract, limit }) {
  const robots = parseRobots(await get(`${base}/robots.txt`));
  const delay = Math.max(10, robots.delay) * 1000;
  console.log(`${brand}: robots.txt lido, intervalo de ${delay / 1000}s`);
  const db = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : { brand, source: base, items: [], skipped: [] };
  db.skipped ??= [];
  const done = new Set([...db.items.map((i) => i.url), ...db.skipped]);
  const todo = urls.filter((u) => !done.has(u)).slice(0, limit);
  console.log(`${brand}: ${urls.length} candidatos, a ler agora ${todo.length} (já lidos: ${done.size})`);
  for (const [n, url] of todo.entries()) {
    const p = new URL(url).pathname;
    if (robots.blocked(p)) {
      console.log(`bloqueado pelo robots.txt: ${p}`);
      continue;
    }
    await sleep(delay);
    try {
      const it = extract(url, await get(url));
      if (!it) {
        db.skipped.push(url);
        console.log(`[${n + 1}/${todo.length}] descartado (não é perfume): ${p}`);
      } else {
        it.fetchedAt = new Date().toISOString();
        db.items.push(it);
        console.log(`[${n + 1}/${todo.length}] ${it.name ?? p} — ${it.review}${it.unknownNotes?.length ? " (" + it.unknownNotes.join(", ") + ")" : ""}`);
      }
    } catch (e) {
      console.log(`[${n + 1}/${todo.length}] erro: ${e.message}`);
    }
    db.updatedAt = new Date().toISOString();
    fs.writeFileSync(out, JSON.stringify(db, null, 2));
  }
  const ok = db.items.filter((i) => i.review === "ok").length;
  console.log(`\n${brand}: ${db.items.length} rascunhos (${ok} completos) em ${path.relative(ROOT, out)}`);
}
