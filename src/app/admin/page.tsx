import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main id="conteudo" className="admin-page">
      <header className="catalog-head">
        <p className="eyebrow">
          <span>✦</span> Painel
        </p>
        <h1 className="stage-title">Administração</h1>
      </header>
      <AdminApp />
    </main>
  );
}
