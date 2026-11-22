#!/usr/bin/env node
/**
 * Gera src/data/note-images-ai.json a partir das imagens em public/notas/<slug>.webp
 * (ilustrações de notas geradas por IA). Chave: nome da nota normalizado, como em src/lib/olfactory.ts.
 * Uso: node scripts/build-note-images.mjs <lista.json com [{slug, name_pt}]>
 */
import fs from "node:fs";
const list = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[™®]/g, "").trim();
const have = new Set(fs.readdirSync("public/notas").filter((f) => f.endsWith(".webp")).map((f) => f.slice(0, -5)));
const out = {};
for (const n of list) if (have.has(n.slug)) out[normalize(n.name_pt)] = `/notas/${n.slug}.webp`;
fs.writeFileSync("src/data/note-images-ai.json", JSON.stringify(out, Object.keys(out).sort(), 1) + "\n");
console.log(`src/data/note-images-ai.json: ${Object.keys(out).length} notas`);
