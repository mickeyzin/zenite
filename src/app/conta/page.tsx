import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Minha conta",
  description: "Seu perfil olfativo e seu armário de perfumes na Zênite.",
  robots: { index: false, follow: false },
};

export default function ContaPage() {
  return (
    <main id="conteudo" className="catalog-page account-page">
      <header className="catalog-head">
        <p className="eyebrow">
          <span>✦</span> Minha conta
        </p>
        <h1 className="stage-title">Seu universo olfativo</h1>
      </header>
      <AccountView />
    </main>
  );
}
