/** Confere a leitura do site no Supabase configurado. Uso: npm run db:check */
import { getCatalog } from "../../src/data/catalog";
import { accordProfile } from "../../src/lib/olfactory";

const c = await getCatalog();
console.log(`fonte: ${c.source} · ${c.all.length} perfumes · ${c.featured.length} em destaque`);
for (const p of c.all) {
  const n = p.notes.value.top.length + p.notes.value.heart.length + p.notes.value.base.length;
  const unknown = accordProfile(p).unknown;
  console.log(`- ${p.fullName}: ${n} notas (${Object.keys(p.noteImages ?? {}).length} com imagem), pôster ${p.poster ? "sim" : "não"}, modelo ${p.model.desktop ? "sim" : "não"}${unknown.length ? `, sem classificação: ${unknown.join(", ")}` : ""}`);
}
if (c.source !== "supabase") process.exit(1);
