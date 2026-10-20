import type { NextConfig } from "next";

// STATIC_EXPORT=1 gera uma versão estática (pasta out/) para pré-visualização.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const, trailingSlash: true } : {}),
  // Cache Components (PPR) não é compatível com exportação estática.
  ...(staticExport ? {} : { cacheComponents: true, partialPrefetching: true }),
  // Imagens enviadas pelo painel ficam no Storage do Supabase.
  images: {
    ...(staticExport ? { unoptimized: true } : {}),
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
