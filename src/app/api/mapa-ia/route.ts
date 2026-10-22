import { ACCORDS, type AccordKey } from "@/lib/olfactory";
import { ALL_NOTES } from "@/lib/quiz";

/**
 * Interpreta uma descrição livre ("cheiro de praia no fim da tarde") em
 * acordes e notas do dicionário da Zênite, usando a OpenAI.
 *
 * - A chave (OPENAI_API_KEY) fica só no servidor; o navegador nunca a vê.
 * - Notas só podem vir do dicionário (enum no esquema): a IA não inventa notas.
 * - Limite simples por IP para conter custo; sem a chave, responde 503 e o quiz
 *   segue funcionando sem IA.
 */
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_CHARS = 300;
const LIMIT_PER_HOUR = 8;
const hits = new Map<string, number[]>();

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["accords", "notes", "summary"],
  properties: {
    accords: {
      type: "object",
      additionalProperties: false,
      required: ACCORDS.map((a) => a.key),
      properties: Object.fromEntries(ACCORDS.map((a) => [a.key, { type: "number", description: `${a.label}: 0 a 1` }])),
    },
    notes: { type: "array", items: { type: "string", enum: ALL_NOTES }, description: "Até 6 notas do dicionário" },
    summary: { type: "string", description: "Uma frase em português explicando a interpretação" },
  },
} as const;

const SYSTEM = `Você é o perfumista da Zênite, um portal editorial brasileiro.
Traduza a descrição do visitante em um perfil olfativo:
- accords: peso de 0 a 1 para cada acorde (${ACCORDS.map((a) => `${a.key} = ${a.label}`).join(", ")}). Use 0 para o que não tem relação.
- notes: até 6 notas que traduzem a descrição, escolhidas da lista permitida.
- summary: uma frase curta, em português do Brasil, dizendo como você interpretou (ex.: "Li como algo fresco e salgado, com um fundo amadeirado suave.").
Não cite marcas nem perfumes específicos. Se a descrição não tiver relação com cheiros, devolva todos os pesos 0, nenhuma nota e explique isso no summary.`;

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: "IA indisponível no momento." }, { status: 503 });

  // Só aceita chamadas do próprio site.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return Response.json({ error: "origem inválida" }, { status: 403 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anon";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3600_000);
  if (recent.length >= LIMIT_PER_HOUR) return Response.json({ error: "Muitas consultas seguidas. Tente de novo mais tarde." }, { status: 429 });
  hits.set(ip, [...recent, now]);

  let text = "";
  try {
    text = String((await request.json())?.text ?? "").trim();
  } catch {
    /* corpo inválido */
  }
  if (text.length < 3) return Response.json({ error: "Escreva um pouco mais." }, { status: 400 });
  text = text.slice(0, MAX_CHARS);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: text },
        ],
        response_format: { type: "json_schema", json_schema: { name: "perfil_olfativo", strict: true, schema: SCHEMA } },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      console.error("[mapa-ia] OpenAI", res.status, (await res.text()).slice(0, 300));
      return Response.json({ error: "A IA não respondeu agora. Siga pelas perguntas." }, { status: 502 });
    }
    const data = await res.json();
    const msg = data?.choices?.[0]?.message;
    if (msg?.refusal || !msg?.content) return Response.json({ error: "Não consegui interpretar essa descrição." }, { status: 422 });
    const out = JSON.parse(msg.content) as { accords: Record<AccordKey, number>; notes: string[]; summary: string };

    // Confere tudo de novo do nosso lado antes de devolver.
    const accords = Object.fromEntries(ACCORDS.map((a) => [a.key, Math.max(0, Math.min(1, Number(out.accords?.[a.key]) || 0))]));
    const allowed = new Set(ALL_NOTES);
    const notes = [...new Set((out.notes ?? []).filter((n) => allowed.has(n)))].slice(0, 6);
    return Response.json({ accords, notes, summary: String(out.summary ?? "").slice(0, 300) });
  } catch (e) {
    console.error("[mapa-ia]", (e as Error).message);
    return Response.json({ error: "A IA não respondeu agora. Siga pelas perguntas." }, { status: 502 });
  }
}
