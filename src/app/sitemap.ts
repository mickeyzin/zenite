import type { MetadataRoute } from "next";
import { getPerfumes } from "@/data/catalog";
import { GUIDES } from "@/data/guides";

import { SITE_URL as base } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/comparar`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/mapa-olfativo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/guias`, changeFrequency: "monthly", priority: 0.6 },
    ...GUIDES.map((g) => ({ url: `${base}/guias/${g.slug}`, lastModified: g.updated, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...(await getPerfumes()).map((p) => ({ url: `${base}/perfumes/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
