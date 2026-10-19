import type { MetadataRoute } from "next";
import { featuredPerfumes } from "@/data/perfumes";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...featuredPerfumes.map((p) => ({ url: `${base}/perfumes/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
