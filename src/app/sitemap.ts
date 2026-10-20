import type { MetadataRoute } from "next";
import { featuredPerfumes } from "@/data/perfumes";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/comparar`, changeFrequency: "monthly", priority: 0.5 },
    ...featuredPerfumes.map((p) => ({ url: `${base}/perfumes/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
