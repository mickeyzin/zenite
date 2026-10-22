/**
 * Endereço público do site (sitemap, robots, links de compartilhamento).
 * Ordem: NEXT_PUBLIC_SITE_URL (domínio próprio) → domínio de produção da
 * Vercel (variável de sistema) → localhost.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
