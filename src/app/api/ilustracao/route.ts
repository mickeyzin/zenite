import { describeBottle, generateBottle, isOfficialPage, referenceFromPage } from "@/lib/ai-bottle";
import { supabaseEnabled } from "@/lib/supabase/config";
import { userClient } from "@/lib/supabase/server";

// A geração da imagem pode levar mais de um minuto.
export const maxDuration = 300;

/**
 * Ilustração do frasco por IA, só para administradores (token da sessão; o banco decide pelo is_admin()).
 * - action "describe": acha a referência (foto enviada ou página oficial importada) e devolve a descrição do frasco.
 * - action "generate": gera a imagem a partir da descrição (PNG em base64). Nada é gravado aqui:
 *   o painel mostra o resultado e só salva se o administrador aprovar.
 */
export async function POST(request: Request) {
  if (!supabaseEnabled) return Response.json({ error: "Supabase não configurado" }, { status: 503 });
  if (!process.env.OPENAI_API_KEY) return Response.json({ error: "OPENAI_API_KEY não configurada na Vercel." }, { status: 503 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "sem sessão" }, { status: 401 });
  const sb = userClient(token);
  const admin = await sb.rpc("is_admin");
  if (admin.error || admin.data !== true) return Response.json({ error: "acesso negado" }, { status: 403 });

  const body = (await request.json().catch(() => null)) as {
    action?: string;
    perfumeId?: string;
    reference?: string | null;
    description?: string | null;
  } | null;
  if (!body?.perfumeId || !/^[0-9a-f-]{36}$/i.test(body.perfumeId)) return Response.json({ error: "perfume inválido" }, { status: 400 });

  const { data: p } = await sb.from("perfumes").select("name, brand:brands(name)").eq("id", body.perfumeId).maybeSingle();
  if (!p) return Response.json({ error: "perfume não encontrado" }, { status: 404 });
  const brand = (Array.isArray(p.brand) ? p.brand[0]?.name : (p.brand as { name: string } | null)?.name) ?? "";

  try {
    if (body.action === "describe") {
      let reference = body.reference?.trim() || null;
      if (reference && !/^https:\/\//.test(reference) && !/^data:image\/(png|jpe?g|webp);base64,/.test(reference))
        return Response.json({ error: "Referência precisa ser um link https ou uma imagem." }, { status: 400 });
      if (reference && reference.length > 6_000_000) return Response.json({ error: "Imagem de referência grande demais." }, { status: 413 });
      let source: string | null = null;
      if (!reference) {
        // Página oficial de onde o perfume foi importado.
        const { data: drafts } = await sb.from("import_drafts").select("url").eq("perfume_id", body.perfumeId);
        const page = (drafts ?? []).map((d) => d.url as string).find(isOfficialPage);
        if (page) {
          reference = await referenceFromPage(page);
          source = page;
        }
      }
      if (!reference) return Response.json({ description: null, reference: null, note: "Sem foto oficial: envie uma foto de referência ou gere de memória." });
      const description = await describeBottle(reference, brand, p.name);
      return Response.json({ description, reference: reference.startsWith("data:") ? null : reference, source });
    }
    if (body.action === "generate") {
      const description = body.description?.trim().slice(0, 4000) || null;
      const b64 = await generateBottle(brand, p.name, description);
      return Response.json({ image: `data:image/png;base64,${b64}` });
    }
    return Response.json({ error: "ação inválida" }, { status: 400 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 502 });
  }
}
