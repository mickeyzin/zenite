"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileBars } from "@/components/charts/Charts";
import { Icon } from "@/components/ui/Icons";
import { topAccords, type Profile } from "@/lib/olfactory";
import { PENDING_QUIZ_KEY, useSession } from "@/lib/supabase/useSession";
import { LearningPanel } from "./LearningPanel";

export type WardrobeStatus = "tenho" | "gostei" | "nao_gostei" | "quero";
export const WARDROBE_LABEL: Record<WardrobeStatus, string> = {
  tenho: "Tenho",
  gostei: "Já usei e gostei",
  nao_gostei: "Não gostei",
  quero: "Quero experimentar",
};

interface ProfileRow {
  display_name: string | null;
  quiz_answers: unknown;
  quiz_profile: Profile | null;
  quiz_updated_at: string | null;
  learning_consent?: boolean | null;
}
interface WardrobeRow {
  perfume_id: string;
  status: WardrobeStatus;
  perfume: { slug: string; full_name: string; perfume_images: { url: string; kind: string }[] } | null;
}

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

export function AccountView() {
  const { sb, session } = useSession();
  if (session === undefined) return <p className="admin-muted">Carregando…</p>;
  if (!sb)
    return (
      <div className="admin-card">
        <h2>Contas indisponíveis</h2>
        <p>O banco de dados do site ainda não está conectado.</p>
      </div>
    );
  if (!session) return <Login sb={sb} />;
  return <Account sb={sb} session={session} />;
}

function Login({ sb }: { sb: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="account-card account-login"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        setError(null);
        const { error } = await sb.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${location.origin}/conta` } });
        if (error) {
          setState("idle");
          setError(/rate|limit/i.test(error.message) ? "Muitos pedidos seguidos. Espere alguns minutos e tente de novo." : error.message);
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
          <p className="admin-muted">Sem senha: você recebe um link de acesso por e-mail. Se ainda não tem conta, ela é criada na hora.</p>
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
          <Icon name="star" size={16} /> Em breve: recomendações só para você
        </li>
      </ul>
      <p className="admin-muted">
        Ao criar a conta você concorda com a <Link href="/privacidade">política de privacidade</Link>. Você pode apagar tudo a
        qualquer momento.
      </p>
    </form>
  );
}

function Account({ sb, session }: { sb: SupabaseClient; session: Session }) {
  const router = useRouter();
  const uid = session.user.id;
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeRow[]>([]);
  const [tick, setTick] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      if ((await savePendingQuiz(sb, uid)) && live) setNotice("Seu mapa olfativo foi salvo no perfil.");
      const [p, w] = await Promise.all([
        sb.from("profiles").select("display_name, quiz_answers, quiz_profile, quiz_updated_at, learning_consent").eq("user_id", uid).maybeSingle(),
        sb
          .from("wardrobe")
          .select("perfume_id, status, perfume:perfumes(slug, full_name, perfume_images(url, kind))")
          .order("updated_at", { ascending: false }),
      ]);
      if (!live) return;
      setProfile((p.data as ProfileRow | null) ?? null);
      setName((p.data as ProfileRow | null)?.display_name ?? "");
      setWardrobe((w.data as unknown as WardrobeRow[]) ?? []);
    })();
    return () => {
      live = false;
    };
  }, [sb, uid, tick]);

  const saveName = async () => {
    const { error } = await sb.from("profiles").upsert({ user_id: uid, display_name: name.trim().slice(0, 60) || null });
    setNotice(error ? `Erro: ${error.message}` : "Nome salvo.");
  };

  const removeAccount = async () => {
    const typed = prompt('Isso apaga sua conta, seu mapa olfativo e seu armário. Para confirmar, digite APAGAR:');
    if (typed?.trim().toUpperCase() !== "APAGAR") return;
    const { error } = await sb.rpc("delete_my_account");
    if (error) return setNotice(`Erro: ${error.message}`);
    await sb.auth.signOut();
    router.push("/");
  };

  const top = profile?.quiz_profile ? topAccords(profile.quiz_profile, 3) : [];
  const groups = (Object.keys(WARDROBE_LABEL) as WardrobeStatus[]).map((st) => ({ st, items: wardrobe.filter((w) => w.status === st && w.perfume) }));

  return (
    <div className="account">
      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}
      <Link href="/para-voce" className="account-card foryou-cta">
        <span className="foryou-cta-kicker">✦ Para você</span>
        <strong>Ver os perfumes escolhidos para o seu perfil</strong>
        <span className="admin-muted">Por estação, ocasião e o seu lado mais forte — atualizado com o seu armário.</span>
      </Link>

      <section className="account-card" aria-labelledby="acc-perfil">
        <h2 id="acc-perfil">Perfil</h2>
        <div className="account-row">
          <label className="admin-field">
            Como quer ser chamado(a)
            <input type="text" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome ou apelido" />
          </label>
          <button className="btn-ghost" onClick={saveName}>
            Salvar
          </button>
        </div>
        <p className="admin-muted">Conta: {session.user.email}</p>
      </section>

      <section className="account-card" aria-labelledby="acc-mapa">
        <h2 id="acc-mapa">Meu mapa olfativo</h2>
        {profile?.quiz_profile ? (
          <>
            <p className="account-big">{top.map((t) => t.label).join(" · ") || "Perfil equilibrado"}</p>
            <ProfileBars profile={profile.quiz_profile} caption="Seu perfil olfativo salvo" />
            <p className="admin-muted">
              Atualizado em {profile.quiz_updated_at ? new Date(profile.quiz_updated_at).toLocaleDateString("pt-BR") : "—"}.{" "}
              <Link href="/mapa-olfativo" className="admin-link">
                Refazer o mapa
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="admin-muted">Você ainda não salvou o seu mapa. Leva uns 2 minutos e é a base das suas recomendações.</p>
            <Link href="/mapa-olfativo" className="btn-primary inline-block">
              Fazer o mapa olfativo
            </Link>
          </>
        )}
      </section>

      <section className="account-card" aria-labelledby="acc-armario">
        <h2 id="acc-armario">Meu armário</h2>
        {wardrobe.length === 0 ? (
          <p className="admin-muted">
            Vazio por enquanto. Nas resenhas, use os botões “Tenho”, “Gostei”, “Não gostei” ou “Quero experimentar”.{" "}
            <Link href="/catalogo" className="admin-link">
              Ir ao catálogo
            </Link>
          </p>
        ) : (
          groups
            .filter((g) => g.items.length)
            .map((g) => (
              <div key={g.st} className="account-shelf">
                <h3>
                  {WARDROBE_LABEL[g.st]} <span className="admin-muted">({g.items.length})</span>
                </h3>
                <ul>
                  {g.items.map((w) => {
                    const poster = w.perfume!.perfume_images?.find((i) => i.kind === "poster")?.url;
                    return (
                      <li key={w.perfume!.slug}>
                        <Link href={`/perfumes/${w.perfume!.slug}`} className="account-item">
                          {poster ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={poster} alt="" width={56} height={68} />
                          ) : (
                            <span className="account-item-empty" aria-hidden>
                              ✦
                            </span>
                          )}
                          <span>{w.perfume!.full_name}</span>
                        </Link>
                        <button
                          className="admin-link"
                          aria-label={`Tirar ${w.perfume!.full_name} do armário`}
                          onClick={async () => {
                            await sb.from("wardrobe").delete().eq("user_id", uid).eq("perfume_id", w.perfume_id);
                            setTick((t) => t + 1);
                          }}
                        >
                          Tirar
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
        )}
      </section>

      <LearningPanel sb={sb} uid={uid} consent={profile?.learning_consent ?? null} onChange={() => setTick((t) => t + 1)} />

      <section className="account-card account-danger" aria-labelledby="acc-dados">
        <h2 id="acc-dados">Seus dados</h2>
        <p className="admin-muted">
          Guardamos só o que está nesta página: nome, mapa olfativo, armário e — se você autorizou — os sinais de uso acima. Veja a <Link href="/privacidade">política de privacidade</Link>.
        </p>
        <div className="admin-actions">
          <button className="btn-ghost" onClick={() => sb.auth.signOut()}>
            Sair
          </button>
          <button className="admin-link account-delete" onClick={removeAccount}>
            Apagar minha conta e meus dados
          </button>
        </div>
      </section>
    </div>
  );
}
