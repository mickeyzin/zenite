import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/ui/SiteHeader";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Manrope({ variable: "--font-ui", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Zênite — Perfumes Cósmicos", template: "%s · Zênite" },
  description:
    "Resenhas, descoberta e análise de perfumes com experiências 3D, mapeamento olfativo e comparações editoriais.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Zênite — Perfumes Cósmicos" },
};

export const viewport: Viewport = { themeColor: "#03040b", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} antialiased`}>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SiteHeader />
        {children}
        <noscript>
          <style>{`.cinema{height:auto!important}.cinema-stage{position:relative!important;height:auto!important}.stage-panel{position:relative!important;opacity:1!important;visibility:visible!important;inset:auto!important;transform:none!important;margin:2rem auto}`}</style>
        </noscript>
      </body>
    </html>
  );
}
