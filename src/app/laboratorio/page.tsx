import type { Metadata } from "next";
import { BottleLab } from "@/components/three/BottleLab";

export const metadata: Metadata = { title: "Laboratório de frascos", robots: { index: false, follow: false } };

/** Página interna: frasco isolado para inspecionar vidro, líquido e materiais. */
export default function LabPage() {
  return (
    <main id="conteudo" className="h-svh w-full">
      <BottleLab />
    </main>
  );
}
