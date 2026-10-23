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
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // Só nos testes locais (banco de teste em 127.0.0.1).
      ...(process.env.ZENITE_LOCAL_IMAGES === "1" ? [{ protocol: "http" as const, hostname: "127.0.0.1", port: "54321", pathname: "/storage/**" }] : []),
    ],
    ...(process.env.ZENITE_LOCAL_IMAGES === "1" ? { dangerouslyAllowLocalIP: true } : {}),
  },
  // Cabeçalhos de segurança (CSP fica para depois: a cena 3D usa shaders e workers).
  ...(staticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
                { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
              ],
            },
          ];
        },
      }),
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
