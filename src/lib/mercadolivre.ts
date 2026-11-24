import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Mercado Livre pela API oficial (app cadastrado em developers.mercadolivre.com.br).
 * Variáveis na Vercel: ML_CLIENT_ID e ML_CLIENT_SECRET (a chave secreta nunca vai para o navegador).
 * O token da conta conectada fica em integration_tokens (só administradores leem e gravam).
 */
const API = "https://api.mercadolibre.com";
const AUTH = "https://auth.mercadolivre.com.br/authorization";

export const mlConfig = () => {
  const id = process.env.ML_CLIENT_ID?.trim();
  const secret = process.env.ML_CLIENT_SECRET?.trim();
  return id && secret ? { id, secret } : null;
};

/** Endereço de retorno: precisa ser idêntico ao cadastrado no app. */
export const redirectUri = (request: Request) =>
  process.env.ML_REDIRECT_URI?.trim() || `${new URL(request.url).origin}/api/mercadolivre/callback`;

export const authUrl = (clientId: string, redirect: string, state: string, challenge: string) =>
  `${AUTH}?${new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirect,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  })}`;

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  user_id?: number;
  message?: string;
  error?: string;
}

async function tokenRequest(params: Record<string, string>) {
  const res = await fetch(`${API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams(params),
  });
  const json = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || !json.access_token)
    throw new Error(`Mercado Livre recusou o acesso: ${json.message ?? json.error ?? res.status}`);
  return json;
}

async function store(sb: SupabaseClient, t: TokenResponse) {
  const { error } = await sb.from("integration_tokens").upsert({
    provider: "mercadolivre",
    access_token: t.access_token,
    refresh_token: t.refresh_token ?? null,
    expires_at: new Date(Date.now() + (t.expires_in - 60) * 1000).toISOString(),
    account_id: t.user_id ? String(t.user_id) : null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`Não foi possível guardar a conexão: ${error.message}`);
}

/** Troca o código do login pelo token (fluxo com PKCE). */
export async function exchangeCode(sb: SupabaseClient, request: Request, code: string, verifier: string) {
  const cfg = mlConfig();
  if (!cfg) throw new Error("ML_CLIENT_ID / ML_CLIENT_SECRET não configurados na Vercel.");
  const t = await tokenRequest({
    grant_type: "authorization_code",
    client_id: cfg.id,
    client_secret: cfg.secret,
    code,
    redirect_uri: redirectUri(request),
    code_verifier: verifier,
  });
  await store(sb, t);
}

/** Token válido, renovando quando está para vencer (o token dura 6 horas; o de renovação, 6 meses e é de uso único). */
export async function accessToken(sb: SupabaseClient) {
  const { data } = await sb
    .from("integration_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("provider", "mercadolivre")
    .maybeSingle();
  if (!data) return null;
  if (Date.parse(data.expires_at) > Date.now() + 5 * 60_000) return data.access_token as string;
  const cfg = mlConfig();
  if (!cfg || !data.refresh_token) return null;
  const t = await tokenRequest({
    grant_type: "refresh_token",
    client_id: cfg.id,
    client_secret: cfg.secret,
    refresh_token: data.refresh_token,
  });
  await store(sb, t);
  return t.access_token;
}

export async function status(sb: SupabaseClient) {
  const { data } = await sb
    .from("integration_tokens")
    .select("expires_at, refresh_token, updated_at")
    .eq("provider", "mercadolivre")
    .maybeSingle();
  return {
    configured: !!mlConfig(),
    connected: !!data && (!!data.refresh_token || Date.parse(data.expires_at) > Date.now()),
    since: data?.updated_at ?? null,
  };
}

/* ——— Link → anúncio ——— */
const ML_HOST = /(^|\.)(mercadoli[vb]re\.com(\.br)?|meli\.la)$/i;

/** Números de anúncio (item) e de produto de catálogo que aparecem num endereço do Mercado Livre. */
export function idsFromUrl(raw: string): { item?: string; product?: string } {
  const out: { item?: string; product?: string } = {};
  const s = decodeURIComponent(raw);
  const item = s.match(/[?&#=,:](?:item_id|wid)[=:]\s*(MLB)-?(\d{6,})/i) ?? s.match(/\/(MLB)-(\d{6,})/i);
  if (item) out.item = `MLB${item[2]}`;
  const product = s.match(/\/p\/(MLB)(\d{5,})/i);
  if (product) out.product = `MLB${product[2]}`;
  return out;
}

/** Segue os redirecionamentos do link (curto ou de afiliado) só por domínios do Mercado Livre, sem ler a página. */
export async function resolveLink(url: string) {
  let current = url;
  const ids = idsFromUrl(current);
  for (let hop = 0; hop < 8 && !(ids.item && ids.product); hop++) {
    let host: string;
    try {
      host = new URL(current).hostname;
    } catch {
      break;
    }
    if (!ML_HOST.test(host)) break;
    const res = await fetch(current, { method: "GET", redirect: "manual", headers: { Accept: "text/html" } }).catch(() => null);
    const next = res?.headers.get("location");
    res?.body?.cancel().catch(() => {});
    if (!res || res.status < 300 || res.status >= 400 || !next) break;
    current = new URL(next, current).toString();
    const found = idsFromUrl(current);
    ids.item ??= found.item;
    ids.product ??= found.product;
  }
  return { ...ids, finalUrl: current };
}

interface Picture {
  url?: string;
  secure_url?: string;
}
async function api<T>(path: string, token: string) {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

/** Primeira foto do anúncio (ou do produto de catálogo), com título e link para citar a origem. */
export async function pictureFor(ids: { item?: string; product?: string }, token: string) {
  if (ids.item) {
    const it = await api<{ title: string; permalink: string; pictures?: Picture[]; catalog_product_id?: string | null }>(
      `/items/${ids.item}`,
      token,
    );
    const pic = it?.pictures?.[0];
    if (it && pic) return { url: (pic.secure_url ?? pic.url)!, title: it.title, permalink: it.permalink };
    ids.product ??= it?.catalog_product_id ?? undefined;
  }
  if (ids.product) {
    const pr = await api<{ name: string; permalink?: string; pictures?: Picture[] }>(`/products/${ids.product}`, token);
    const pic = pr?.pictures?.[0];
    if (pr && pic)
      return {
        url: (pic.secure_url ?? pic.url)!,
        title: pr.name,
        permalink: pr.permalink ?? `https://www.mercadolivre.com.br/p/${ids.product}`,
      };
  }
  return null;
}

/** Baixa a foto (só do servidor de imagens do Mercado Livre) e devolve como data URL para o painel recortar. */
export async function imageAsDataUrl(url: string) {
  const u = new URL(url.replace(/^http:/, "https:"));
  if (!/(^|\.)mlstatic\.com$/i.test(u.hostname)) throw new Error("Imagem fora do Mercado Livre.");
  const res = await fetch(u);
  if (!res.ok) throw new Error(`Imagem indisponível (${res.status}).`);
  const type = res.headers.get("content-type") ?? "image/jpeg";
  if (!/^image\/(jpe?g|png|webp)/.test(type)) throw new Error("Formato de imagem inesperado.");
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > 8_000_000) throw new Error("Imagem grande demais.");
  return `data:${type.split(";")[0]};base64,${buf.toString("base64")}`;
}
