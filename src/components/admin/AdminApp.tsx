"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState, useSyncExternalStore } from "react";
import { browserClient } from "@/lib/supabase/client";
import { DraftsTab } from "./DraftsTab";
import { NotesTab } from "./NotesTab";
import { OffersTab } from "./OffersTab";
import { PerfumesTab } from "./PerfumesTab";

/**
 * Painel da Zênite. Roda no navegador com a chave pública do Supabase; quem
 * protege os dados são as regras RLS do banco (só administradores escrevem).
 */
type Tab = "rascunhos" | "perfumes" | "notas" | "ofertas";
const TABS: { key: Tab; label: string }[] = [
  { key: "rascunhos", label: "Importados" },
  { key: "perfumes", label: "Perfumes" },
  { key: "notas", label: "Notas" },
  { key: "ofertas", label: "Ofertas" },
];

const noop = () => () => {};
export function AdminApp() {
  // A sessão fica no navegador: nada do painel é renderizado no servidor.
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  if (!isClient) return <p className="admin-muted">Carregando…</p>;
  return <ClientApp />;
}

function ClientApp() {
  const sb = browserClient();
  if (!sb) return <NotConfigured />;
  return <Gate sb={sb} />;
}

function NotConfigured() {
  return (
    <div className="admin-card">
      <h2>Banco ainda não conectado</h2>
      <p>
        Configure <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> no ambiente do site e
        publique de novo. O passo a passo está em <code>docs/supabase-setup.md</code>.
      </p>
    </div>
  );
}

function Gate({ sb }: { sb: SupabaseClient }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  // Resultado da checagem guardado por usuário: trocar de conta refaz a checagem.
  const [check, setCheck] = useState<{ uid: string; admin: boolean } | null>(null);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  const uid = session?.user.id;
  useEffect(() => {
    if (!uid) return;
    let live = true;
    sb.rpc("is_admin").then(({ data }) => live && setCheck({ uid, admin: data === true }));
    return () => {
      live = false;
    };
  }, [sb, uid]);
  const admin = check && check.uid === uid ? check.admin : null;

  if (session === undefined) return <p className="admin-muted">Carregando…</p>;
  if (!session) return <Login sb={sb} />;
  if (admin === null) return <p className="admin-muted">Verificando acesso…</p>;
  if (!admin)
    return (
      <div className="admin-card">
        <h2>Sem acesso</h2>
        <p>
          A conta <strong>{session.user.email}</strong> não é administradora. Peça para incluí-la na tabela{" "}
          <code>admins</code>.
        </p>
        <button className="btn-ghost" onClick={() => sb.auth.signOut()}>
          Sair
        </button>
      </div>
    );
  return <Panel sb={sb} session={session} />;
}

function Login({ sb }: { sb: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="admin-card admin-login"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const { error } = await sb.auth.signInWithPassword({ email, password });
        setBusy(false);
        if (error) setError(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      }}
    >
      <h2>Entrar</h2>
      <label>
        E-mail
        <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Senha
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn-primary" disabled={busy}>
        {busy ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

function Panel({ sb, session }: { sb: SupabaseClient; session: Session }) {
  const [tab, setTab] = useState<Tab>("rascunhos");
  const [notice, setNotice] = useState<string | null>(null);

  // Depois de mudar algo público, pede ao site para atualizar o cache.
  const refreshSite = async () => {
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    const res = await fetch("/api/revalidar", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(
      () => null,
    );
    setNotice(res?.ok ? "Site atualizado." : "Salvo no banco. O site atualiza sozinho em até 1 hora.");
    window.setTimeout(() => setNotice(null), 4000);
  };

  const props = { sb, refreshSite };
  return (
    <div className="admin-panel">
      <div className="admin-bar">
        <nav className="admin-tabs" aria-label="Seções do painel">
          {TABS.map((t) => (
            <button key={t.key} className="btn-ghost" aria-pressed={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-user">
          <span>{session.user.email}</span>
          <button className="admin-link" onClick={() => sb.auth.signOut()}>
            Sair
          </button>
        </div>
      </div>
      <p className="admin-notice" role="status" aria-live="polite">
        {notice}
      </p>
      {tab === "rascunhos" && <DraftsTab {...props} />}
      {tab === "perfumes" && <PerfumesTab {...props} />}
      {tab === "notas" && <NotesTab {...props} />}
      {tab === "ofertas" && <OffersTab {...props} />}
    </div>
  );
}

export interface TabProps {
  sb: SupabaseClient;
  refreshSite: () => Promise<void>;
}
