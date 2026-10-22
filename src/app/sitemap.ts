import type { MetadataRoute } from "next";
import { getPerfumes } from "@/data/catalog";

import { SITE_URL as base } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/comparar`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/mapa-olfativo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
    ...(await getPerfumes()).map((p) => ({ url: `${base}/perfumes/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
