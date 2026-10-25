"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icons";
import type { Perfume } from "@/data/types";
import type { Profile } from "@/lib/olfactory";
import { PENDING_QUIZ_KEY, useSession } from "@/lib/supabase/useSession";
import { ProfileHub } from "./ProfileHub";
import { TasteConstellation } from "./TasteConstellation";

export type WardrobeStatus = "tenho" | "gostei" | "nao_gostei" | "quero";
export const WARDROBE_LABEL: Record<WardrobeStatus, string> = {
  tenho: "Tenho",
  gostei: "Já usei e gostei",
  nao_gostei: "Não gostei",
  quero: "Quero experimentar",
};

/** Salva no perfil as respostas do quiz feitas antes de entrar na conta. */
export async function savePendingQuiz(sb: SupabaseClient, userId: string) {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PENDING_QUIZ_KEY);
  } catch {
    return false;
  }
  if (!raw) return false;
  const { answers, profile } = JSON.parse(raw);
  const { error } = await sb
    .from("profiles")
    .upsert({ user_id: userId, quiz_answers: answers, quiz_profile: profile, quiz_updated_at: new Date().toISOString() });
  if (!error) {
    try {
      localStorage.removeItem(PENDING_QUIZ_KEY);
    } catch {
      /* armazenamento indisponível */
    }
  }
  return !error;
}

// Constelação de exemplo da tela de entrada.
const DEMO: Profile = {
  citrico: 0.08,
  frutado: 0.1,
  floral: 0.14,
  verde: 0.04,
  aromatico: 0.07,
  especiado: 0.09,
  amadeirado: 0.13,
  ambarado: 0.16,
  doce: 0.14,
  almiscarado: 0.05,
};

export function AccountView({ catalog }: { catalog: Perfume[] }) {
  const { sb, session } = useSession();
  if (session === undefined) return <p className="admin-muted ph-loading">Abrindo o seu universo…</p>;
  if (!sb)
    return (
      <div className="admin-card">
        <h2>Contas indisponíveis</h2>
        <p>O banco de dados do site ainda não está conectado.</p>
      </div>
    );
  if (!session) return <Login sb={sb} />;
  return <ProfileHub sb={sb} session={session} catalog={catalog} />;
}

function Login({ sb }: { sb: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="ph ph-login">
      <header className="ph-hero">
        <div className="ph-sky" aria-hidden />
        <div className="ph-hero-inner">
          <p className="eyebrow">
            <span>✦</span> Minha conta
          </p>
          <h1 className="stage-title">Seu universo olfativo</h1>
          <p className="ph-sign">Um perfil que aprende o seu gosto e desenha a sua constelação.</p>
        </div>
      </header>
      <div className="ph-login-grid">
        <div className="ph-login-art">
          <TasteConstellation
            profile={DEMO}
            name="Você"
            caption="Exemplo ilustrativo — a sua constelação aparece depois do mapa olfativo."
          />
        </div>
        <form
          className="account-card account-login"
          onSubmit={async (e) => {
            e.preventDefault();
            setState("sending");
            setError(null);
            const { error } = await sb.auth.signInWithOtp({
              email: email.trim(),
              options: { emailRedirectTo: `${location.origin}/conta` },
            });
            if (error) {
              setState("idle");
              setError(
                /rate|limit/i.test(error.message)
                  ? "Muitos pedidos seguidos. Espere alguns minutos e tente de novo."
                  : error.message,
              );
            } else setState("sent");
          }}
        >
          <h2>Entrar ou criar conta</h2>
          {state === "sent" ? (
            <p role="status">
              Enviamos um link de acesso para <strong>{email}</strong>. Abra o e-mail neste mesmo aparelho e toque no link. Se não
              aparecer, olhe a caixa de spam.
            </p>
          ) : (
            <>
              <p className="admin-muted">
                Sem senha: você recebe um link de acesso por e-mail. Se ainda não tem conta, ela é criada na hora.
              </p>
              <label className="admin-field">
                E-mail
                <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              {error && (
                <p className="admin-error" role="alert">
                  {error}
                </p>
              )}
              <button className="btn-primary" disabled={state === "sending"}>
                {state === "sending" ? "Enviando…" : "Receber link de acesso"}
              </button>
            </>
          )}
          <ul className="account-perks">
            <li>
              <Icon name="sparkle" size={16} /> Seu mapa olfativo salvo
            </li>
            <li>
              <Icon name="bottle" size={16} /> Seu armário: os perfumes que você tem, gostou ou quer provar
            </li>
            <li>
              <Icon name="star" size={16} /> Recomendações por estação, ocasião e o seu lado mais forte
            </li>
          </ul>
          <p className="admin-muted">
            Ao criar a conta você concorda com a <Link href="/privacidade">política de privacidade</Link>. Você pode apagar tudo a
            qualquer momento.
          </p>
        </form>
      </div>
    </div>
  );
}
