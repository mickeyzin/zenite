import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/data/catalog";
import { supabaseEnabled } from "@/lib/supabase/config";
import { userClient } from "@/lib/supabase/server";

/**
 * Atualiza o cache do site depois de uma alteração no painel.
 * Exige o token de sessão de um administrador (Authorization: Bearer …);
 * quem decide se é admin é o próprio banco, pela função is_admin().
 */
export async function POST(request: Request) {
  if (!supabaseEnabled) return Response.json({ ok: false, error: "Supabase não configurado" }, { status: 503 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ ok: false, error: "sem sessão" }, { status: 401 });

  const { data, error } = await userClient(token).rpc("is_admin");
  if (error || data !== true) return Response.json({ ok: false, error: "acesso negado" }, { status: 403 });

  // expire 0: a próxima visita já busca os dados novos (sem servir a versão antiga).
  revalidateTag(CATALOG_TAG, { expire: 0 });
  return Response.json({ ok: true });
}
