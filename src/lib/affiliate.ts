/**
 * Links de afiliado gerados automaticamente, a partir do link comum da loja.
 * Só para programas cujo formato de link é público e documentado:
 * - Amazon Associados: o código de rastreamento vai no parâmetro `tag`.
 * - Awin: link de redirecionamento da Awin com o número do afiliado, o da loja e o destino.
 *
 * Os códigos ficam nas variáveis de ambiente (Vercel → Settings → Environment Variables).
 * Não são senhas: aparecem em todo link divulgado. Mesmo assim, ficam fora do código.
 *   AMAZON_ASSOCIATE_TAG   ex.: zenite-20
 *   AWIN_PUBLISHER_ID      ex.: 1234567
 *   AWIN_MERCHANTS         lojas aprovadas, "site=número" separados por vírgula
 *                          ex.: epocacosmeticos.com.br=12345, belezanaweb.com.br=67890
 */
export interface AffiliateConfig {
  amazonTag: string | null;
  awinPublisher: string | null;
  awinMerchants: Record<string, string>; // site (sem www.) → número da loja na Awin
}

export function affiliateConfig(env: Record<string, string | undefined> = process.env): AffiliateConfig {
  const tag = env.AMAZON_ASSOCIATE_TAG?.trim();
  const pub = env.AWIN_PUBLISHER_ID?.trim();
  const merchants: Record<string, string> = {};
  for (const pair of (env.AWIN_MERCHANTS ?? "").split(",")) {
    const [site, id] = pair.split("=").map((s) => s?.trim().toLowerCase());
    if (site && id && /^\d+$/.test(id)) merchants[site.replace(/^www\./, "")] = id;
  }
  return {
    amazonTag: tag && /^[\w-]{2,40}$/.test(tag) ? tag : null,
    awinPublisher: pub && /^\d+$/.test(pub) ? pub : null,
    awinMerchants: merchants,
  };
}

const hostOf = (u: URL) => u.hostname.toLowerCase().replace(/^www\./, "");

/** Link de afiliado para um link comum, quando há programa configurado para a loja; senão null. */
export function autoAffiliate(url: string | null | undefined, cfg: AffiliateConfig = affiliateConfig()): { url: string; program: "amazon" | "awin" } | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = hostOf(u);
  if (cfg.amazonTag && /^amazon\.com(\.br)?$/.test(host)) {
    u.searchParams.set("tag", cfg.amazonTag);
    return { url: u.toString(), program: "amazon" };
  }
  const merchant = cfg.awinMerchants[host];
  if (cfg.awinPublisher && merchant) {
    const awin = new URL("https://www.awin1.com/cread.php");
    awin.searchParams.set("awinmid", merchant);
    awin.searchParams.set("awinaffid", cfg.awinPublisher);
    awin.searchParams.set("ued", url);
    return { url: awin.toString(), program: "awin" };
  }
  return null;
}

/** Loja a partir do link (para cadastrar ofertas coladas em lote). */
export function storeFromUrl(url: string): { slug: string; name: string } | null {
  let host: string;
  try {
    host = hostOf(new URL(url));
  } catch {
    return null;
  }
  if (/(^|\.)mercadoli[vb]re\.com(\.br)?$|(^|\.)meli\.la$/.test(host)) return { slug: "mercado-livre", name: "Mercado Livre" };
  if (/^amazon\.com(\.br)?$|^amzn\.to$/.test(host)) return { slug: "amazon", name: "Amazon" };
  const base = host.replace(/\.(com|net|org)(\.br)?$|\.br$/, "");
  return { slug: base.replace(/[^a-z0-9]+/g, "-"), name: base.charAt(0).toUpperCase() + base.slice(1) };
}

/** Link já é de afiliado (gerado no painel do programa)? */
export const isAffiliateLink = (url: string) =>
  /^https:\/\/(?:www\.)?(?:mercadolivre\.com(?:\.br)?\/sec\/|meli\.la\/|amzn\.to\/|www\.awin1\.com\/)/i.test(url) || /[?&]tag=[\w-]+/.test(url);
