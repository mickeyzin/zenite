import type { NextConfig } from "next";

// STATIC_EXPORT=1 gera uma versão estática (pasta out/) para pré-visualização.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const, images: { unoptimized: true }, trailingSlash: true } : {}),
  // Cache Components (PPR) não é compatível com exportação estática.
  ...(staticExport ? {} : { cacheComponents: true, partialPrefetching: true }),
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
