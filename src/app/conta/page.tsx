import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";
import { getPerfumes } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Minha conta",
  description: "Seu perfil olfativo, sua constelação de gosto, recomendações e seu armário de perfumes na Zênite.",
  robots: { index: false, follow: false },
};

export default async function ContaPage() {
  return (
    <main id="conteudo" className="account-page">
      <AccountView catalog={await getPerfumes()} />
    </main>
  );
}
