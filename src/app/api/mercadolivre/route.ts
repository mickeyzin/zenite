import {
  accessToken,
  authUrl,
  exchangeCode,
  imageAsDataUrl,
  mlConfig,
  pictureFor,
  redirectUri,
  resolveLink,
  status,
} from "@/lib/mercadolivre";
import { supabaseEnabled } from "@/lib/supabase/config";
import { userClient } from "@/lib/supabase/server";

/**
 * Mercado Livre, só para administradores (token da sessão; o banco decide pelo is_admin()).
 * - status: se as chaves estão na Vercel e se há conta conectada;
 * - start: endereço de login (PKCE: o navegador guarda o verificador e o "state");
 * - exchange: troca o código do login pelo token e guarda;
 * - photo: link do anúncio (comum, curto ou de afiliado) → primeira foto pela API, como data URL.
 */
export async function POST(request: Request) {
  if (!supabaseEnabled) return Response.json({ error: "Supabase não configurado" }, { status: 503 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "sem sessão" }, { status: 401 });
  const sb = userClient(token);
  const admin = await sb.rpc("is_admin");
  if (admin.error || admin.data !== true) return Response.json({ error: "acesso negado" }, { status: 403 });

  const body = (await request.json().catch(() => null)) as Record<string, string | undefined> | null;
  try {
    switch (body?.action) {
      case "status":
        return Response.json(await status(sb));
      case "start": {
        const cfg = mlConfig();
        if (!cfg) return Response.json({ error: "Configure ML_CLIENT_ID e ML_CLIENT_SECRET na Vercel." }, { status: 503 });
        if (!body.state || !/^[\w-]{20,100}$/.test(body.state) || !body.challenge || !/^[\w-]{43}$/.test(body.challenge))
          return Response.json({ error: "pedido inválido" }, { status: 400 });
        return Response.json({ url: authUrl(cfg.id, redirectUri(request), body.state, body.challenge) });
      }
      case "exchange":
        if (!body.code || !body.verifier) return Response.json({ error: "pedido inválido" }, { status: 400 });
        await exchangeCode(sb, request, body.code, body.verifier);
        return Response.json({ ok: true });
      case "photo": {
        const url = body.url?.trim() ?? "";
        if (!/^https:\/\/\S+$/.test(url)) return Response.json({ error: "link inválido" }, { status: 400 });
        const tok = await accessToken(sb);
        if (!tok) return Response.json({ error: "Conecte o Mercado Livre no painel." }, { status: 409 });
        const ids = await resolveLink(url);
        if (!ids.item && !ids.product)
          return Response.json(
            { error: "Não achei o anúncio a partir desse link. Cole o link do anúncio (o da barra do navegador)." },
            { status: 422 },
          );
        const pic = await pictureFor(ids, tok);
        if (!pic) return Response.json({ error: "O anúncio não tem foto disponível pela API." }, { status: 404 });
        return Response.json({ image: await imageAsDataUrl(pic.url), title: pic.title, permalink: pic.permalink });
      }
      default:
        return Response.json({ error: "ação inválida" }, { status: 400 });
    }
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 502 });
  }
}
