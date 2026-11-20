/**
 * Ilustração do frasco gerada por IA (só no servidor; a chave OPENAI_API_KEY nunca vai ao navegador).
 *
 * 1. Referência: a foto do produto na página oficial da marca (og:image), só dos sites de onde
 *    importamos os dados, ou uma foto enviada pelo administrador. A referência serve apenas para
 *    a IA enxergar o frasco: não é guardada nem publicada.
 * 2. Descrição: um modelo com visão descreve o frasco em detalhes (formato, vidro, tampa, rótulo).
 * 3. Geração: o modelo de imagem cria o frasco a partir da descrição, em foto de estúdio.
 * No site, a imagem sempre aparece marcada como ilustração de IA.
 */
const UA = "ZeniteBot/0.1 (+https://github.com/mickeyzin/zenite)";
const VISION_MODEL = process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
/** Sites oficiais de onde a referência pode ser buscada automaticamente. */
const OFFICIAL_HOSTS = ["lattafa.com", "afnan.com", "swissarabian.com", "khadlaj-perfumes.com"];

const host = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
export const isOfficialPage = (u: string | null | undefined) => !!u && OFFICIAL_HOSTS.includes(host(u));

/** Foto do produto na página oficial (meta og:image). */
export async function referenceFromPage(pageUrl: string): Promise<string | null> {
  if (!isOfficialPage(pageUrl)) return null;
  const res = await fetch(pageUrl, { headers: { "User-Agent": UA, Accept: "text/html" }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) return null;
  const html = await res.text();
  const m = html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (!m) return null;
  const url = m[1].replace(/&amp;/g, "&").replace(/^\/\//, "https://").replace(/^http:/, "https:");
  return /^https:\/\//.test(url) ? url : null;
}

async function openai(path: string, body: unknown, timeoutMs: number) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY não configurada na Vercel.");
  const res = await fetch(`https://api.openai.com/v1/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.error?.message ?? `OpenAI respondeu ${res.status}`);
  return json;
}

const DESCRIBE = `You describe perfume bottles so that an image model can recreate them exactly.
Look only at the bottle (ignore the box, background, props and lighting) and write ONE dense English paragraph covering, in this order:
overall silhouette and proportions, stating the glass body's height-to-width ratio as a number (e.g. "about 1.2 times taller than wide") and the cap's height relative to the body; edges, shoulders, base; glass color, transparency, thickness and any frosting or gradient; liquid color if visible;
cap: shape, material, finish, color, size relative to the bottle, any gems, logos or engravings; neck and collar;
front decoration: every panel, label, print, engraving or emblem with its exact position, colors and size; ALL visible text, quoted exactly as written
(keep Arabic or other scripts exactly), with font style (serif, sans, script, calligraphy), weight, case and color; side or back details if visible.
Be literal and precise. Do not mention the photo, the background or the brand's marketing. Do not guess hidden details.`;

/** Descrição detalhada do frasco a partir de uma foto (URL https ou data:image/...). */
export async function describeBottle(image: string, brand: string, name: string): Promise<string> {
  const json = await openai(
    "chat/completions",
    {
      model: VISION_MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: DESCRIBE },
        {
          role: "user",
          content: [
            { type: "text", text: `Bottle of the fragrance "${brand} ${name}". Describe it.` },
            { type: "image_url", image_url: { url: image, detail: "high" } },
          ],
        },
      ],
    },
    60_000,
  );
  const text = String(json?.choices?.[0]?.message?.content ?? "").trim();
  if (!text) throw new Error("A IA não devolveu a descrição.");
  return text;
}

/** Gera o frasco (PNG em base64). Sem descrição, pede o frasco oficial "de memória" (menos fiel). */
export async function generateBottle(brand: string, name: string, description: string | null): Promise<string> {
  const subject = `the official retail bottle of the fragrance "${brand} ${name}"`;
  const body = description
    ? `The bottle must look exactly like this description; follow every detail precisely and add nothing else: ${description}`
    : `Reproduce the real, current production bottle as faithfully as possible: identical silhouette and proportions, exact glass and cap, ` +
      `label text spelled exactly "${brand}" and "${name}", correct typography and decorations. Do not invent or redesign anything.`;
  const prompt =
    `Photorealistic e-commerce product photograph of ${subject}. ${body} ` +
    `Keep the exact proportions described. Single bottle, straight front view, centered, no box, no props, no extra text, seamless dark navy background, ` +
    `soft studio lighting, crisp reflections, high detail, sharp focus, vertical composition.`;
  const json = await openai("images/generations", { model: IMAGE_MODEL, prompt, size: "1024x1536", quality: "high", n: 1 }, 280_000);
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("A IA não devolveu a imagem.");
  return b64 as string;
}
