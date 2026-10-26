import { autoAffiliate } from "@/lib/affiliate";
import { supabaseEnabled } from "@/lib/supabase/config";
import { anonClient } from "@/lib/supabase/server";

/**
 * Leva o visitante à loja e conta o clique (sem dados pessoais: só oferta,
 * horário e página de origem). As regras do banco só deixam ler ofertas
 * ativas de perfumes publicados.
 */
export async function GET(request: Request, { params }: RouteContext<"/oferta/[id]">) {
  const { id } = await params;
  const back = new URL("/catalogo", request.url);
  if (!supabaseEnabled || !/^[0-9a-f-]{36}$/i.test(id)) return Response.redirect(back, 302);

  const sb = anonClient();
  const { data } = await sb.from("offers").select("url, affiliate_url").eq("id", id).maybeSingle();
  // Link de afiliado cadastrado; senão, o gerado pelo programa da loja (Amazon/Awin); senão, o link comum.
  const target = data?.affiliate_url ?? autoAffiliate(data?.url)?.url ?? data?.url;
  if (!target || !/^https:\/\//.test(target)) return Response.redirect(back, 302);

  const ref = request.headers.get("referer");
  const page = ref && new URL(ref).origin === new URL(request.url).origin ? new URL(ref).pathname : null;
  // A contagem não pode atrasar nem impedir a ida à loja.
  await sb.from("offer_clicks").insert({ offer_id: id, page }).then(
    () => undefined,
    () => undefined,
  );
  return new Response(null, { status: 302, headers: { Location: target, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
}
