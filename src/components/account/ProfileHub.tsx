"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ACCORD_COLOR, Icon, type IconName } from "@/components/ui/Icons";
import { PerfumeArt } from "@/components/ui/PerfumeArt";
import type { Perfume } from "@/data/types";
import { ACCORDS, derivedMetrics, topAccords, type Profile } from "@/lib/olfactory";
import type { WardrobeStatus } from "@/lib/recommend";
import { savePendingQuiz, WARDROBE_LABEL } from "./AccountView";
import { ConsentPrompt } from "./ConsentPrompt";
import { ForYouSections } from "./ForYouSections";
import { LearningPanel } from "./LearningPanel";
import { TasteConstellation } from "./TasteConstellation";
import { useProfileData } from "./useProfileData";

const NAV = [
  { id: "constelacao", label: "Constelação" },
  { id: "para-voce", label: "Para você" },
  { id: "armario", label: "Armário" },
  { id: "aprendizado", label: "Aprendizado" },
  { id: "conta", label: "Conta" },
] as const;

const PREF: Record<string, Record<string, string>> = {
  intensity: { suave: "Suave", moderada: "Moderada", marcante: "Marcante" },
  moment: { dia: "De dia", noite: "À noite", ambos: "Dia e noite" },
  climate: { calor: "Calor", frio: "Frio", todos: "Qualquer clima" },
};

const RING_LABEL: Record<string, string> = {
  docura: "Doçura",
  frescor: "Frescor",
  amadeirado: "Madeiras",
  especiado: "Especiarias",
};

// Exemplo mostrado (esmaecido) para quem ainda não tem perfil.
const SAMPLE: Profile = {
  citrico: 0.05,
  frutado: 0.08,
  floral: 0.12,
  verde: 0.03,
  aromatico: 0.06,
  especiado: 0.1,
  amadeirado: 0.16,
  ambarado: 0.18,
  doce: 0.17,
  almiscarado: 0.05,
};

/** Amplitude do gosto: 1 = os três acordes mais fortes dominam tudo, 0 = gosto bem espalhado. */
function focus(p: Profile) {
  const top3 = ACCORDS.map((a) => p[a.key])
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a + b, 0);
  return Math.max(0, Math.min(1, (top3 - 0.3) / 0.5));
}

export function ProfileHub({ sb, session, catalog }: { sb: SupabaseClient; session: Session; catalog: Perfume[] }) {
  const uid = session.user.id;
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const { data, combined, rec, reload, mark } = useProfileData(sb, uid, catalog, async () => {
    if (await savePendingQuiz(sb, uid)) setNotice("Seu mapa olfativo foi salvo no perfil.");
  });
  const [name, setName] = useState<string | null>(null);
  const active = useActiveSection(Boolean(data));

  if (!data) return <p className="admin-muted ph-loading">Abrindo o seu universo…</p>;

  const prof = data.profile;
  const displayName = name ?? prof?.display_name ?? "";
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  const shelf = (st: WardrobeStatus) =>
    Object.entries(data.wardrobe)
      .filter(([slug, s]) => s === st && bySlug.has(slug))
      .map(([slug]) => bySlug.get(slug)!);
  const owned = shelf("tenho").length + shelf("gostei").length;
  const views = new Set(data.events.filter((e) => e.kind === "view").map((e) => e.slug)).size;
  const searched = [...new Set(data.events.filter((e) => e.kind === "search_note" && e.note).map((e) => e.note!))];
  const top = combined ? topAccords(combined, 3) : [];
  const answers = prof?.quiz_answers ?? {};
  const c1 = top[0] ? ACCORD_COLOR[top[0].key] : "#31c7f3";
  const c2 = top[1] ? ACCORD_COLOR[top[1].key] : "#a65cff";

  const saveName = async () => {
    const v = displayName.trim().slice(0, 60) || null;
    const { error } = await sb.from("profiles").upsert({ user_id: uid, display_name: v });
    setNotice(error ? `Erro: ${error.message}` : "Nome salvo.");
  };
  const removeAccount = async () => {
    const typed = prompt("Isso apaga sua conta, seu mapa olfativo, seu armário e o histórico. Para confirmar, digite APAGAR:");
    if (typed?.trim().toUpperCase() !== "APAGAR") return;
    const { error } = await sb.rpc("delete_my_account");
    if (error) return setNotice(`Erro: ${error.message}`);
    await sb.auth.signOut();
    router.push("/");
  };

  const stats: { icon: IconName; value: string; label: string }[] = [
    { icon: "bottle", value: String(owned), label: owned === 1 ? "perfume no armário" : "perfumes no armário" },
    { icon: "heart", value: String(shelf("quero").length), label: "quero experimentar" },
    ...(prof?.learning_consent
      ? [
          { icon: "layers" as const, value: String(views), label: views === 1 ? "resenha lida" : "resenhas lidas" },
          {
            icon: "sparkle" as const,
            value: String(searched.length),
            label: searched.length === 1 ? "nota pesquisada" : "notas pesquisadas",
          },
        ]
      : []),
    {
      icon: "calendar",
      value: prof?.quiz_updated_at
        ? new Date(prof.quiz_updated_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        : "—",
      label: prof?.quiz_updated_at ? "mapa olfativo" : "mapa a fazer",
    },
  ];

  return (
    <div className="ph" style={{ "--c1": c1, "--c2": c2 } as React.CSSProperties}>
      <header className="ph-hero">
        <div className="ph-sky" aria-hidden />
        <div className="ph-hero-inner">
          <p className="eyebrow">
            <span>✦</span> Seu universo olfativo
          </p>
          <h1 className="stage-title">{displayName ? `Olá, ${displayName}` : "Seu perfil"}</h1>
          <p className="ph-sign">
            {top.length ? (
              <>
                Assinatura olfativa{" "}
                {top.map((t, i) => (
                  <span key={t.key} style={{ color: ACCORD_COLOR[t.key] }}>
                    {i > 0 && <i aria-hidden> · </i>}
                    {t.label}
                  </span>
                ))}
              </>
            ) : (
              "Faça o mapa olfativo para acender a sua constelação."
            )}
          </p>
          <ul className="ph-stats">
            {stats.map((s) => (
              <li key={s.label}>
                <Icon name={s.icon} size={18} />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <nav className="ph-nav" aria-label="Seções do perfil">
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className={active === n.id ? "is-active" : undefined}
            aria-current={active === n.id ? "true" : undefined}
          >
            {n.label}
          </a>
        ))}
      </nav>

      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}

      <section id="constelacao" className="ph-section" aria-labelledby="ph-const">
        <SectionHead id="ph-const" kicker="01" title="A constelação do seu gosto" />
        {combined ? (
          <div className="ph-const">
            <TasteConstellation
              profile={combined}
              notes={[...(answers.loved ?? []), ...searched]}
              name={displayName || undefined}
            />
            <Metrics
              profile={combined}
              answers={answers}
              sources={[
                prof?.quiz_profile && "mapa olfativo",
                Object.keys(data.wardrobe).length && `${Object.keys(data.wardrobe).length} perfume(s) do armário`,
                data.events.length && `${data.events.length} sinal(is) de uso`,
              ]}
            />
          </div>
        ) : (
          <div className="ph-const is-empty">
            <TasteConstellation profile={SAMPLE} caption="Exemplo ilustrativo." />
            <div className="ph-empty">
              <h3>Sua constelação ainda está apagada</h3>
              <p>
                Responda sete perguntas rápidas sobre o que você gosta. Cada resposta acende uma estrela — e as recomendações
                começam a aparecer aqui.
              </p>
              <Link href="/mapa-olfativo" className="btn-primary inline-block">
                Fazer o mapa olfativo
              </Link>
            </div>
          </div>
        )}
      </section>

      <section id="para-voce" className="ph-section" aria-labelledby="ph-fy">
        <SectionHead
          id="ph-fy"
          kicker="02"
          title="Escolhidos para você"
          text="Por estação, ocasião e o seu lado mais forte. Marque “Não é pra mim” ou “Já tenho” e tudo se ajusta na hora."
        />
        {prof?.learning_consent === null || prof?.learning_consent === undefined ? (
          <ConsentPrompt sb={sb} uid={uid} onDone={reload} />
        ) : null}
        {rec?.sections.length ? (
          <ForYouSections sections={rec.sections} onMark={mark} />
        ) : (
          <p className="admin-muted">
            As recomendações aparecem depois do mapa olfativo ou quando você marca perfumes no armário.
          </p>
        )}
      </section>

      <section id="armario" className="ph-section" aria-labelledby="ph-arm">
        <SectionHead
          id="ph-arm"
          kicker="03"
          title="Meu armário"
          text="Nas resenhas, use “Tenho”, “Gostei”, “Não gostei” ou “Quero experimentar”."
        />
        {Object.keys(data.wardrobe).length === 0 ? (
          <p className="admin-muted">
            Vazio por enquanto.{" "}
            <Link href="/catalogo" className="admin-link">
              Ir ao catálogo
            </Link>
          </p>
        ) : (
          <div className="ph-shelves">
            {(Object.keys(WARDROBE_LABEL) as WardrobeStatus[]).map((st) => {
              const items = shelf(st);
              if (!items.length) return null;
              return (
                <div key={st} className="ph-shelf">
                  <h3>
                    {WARDROBE_LABEL[st]} <span>{items.length}</span>
                  </h3>
                  <ul>
                    {items.map((p) => (
                      <li key={p.slug} className="ph-bottle">
                        <Link href={`/perfumes/${p.slug}`}>
                          {p.poster ? (
                            <Image src={p.poster} alt="" width={180} height={220} />
                          ) : (
                            <PerfumeArt perfume={p} className="poster-art" />
                          )}
                          <span>{p.fullName}</span>
                        </Link>
                        <button
                          type="button"
                          className="ph-remove"
                          aria-label={`Tirar ${p.fullName} do armário`}
                          onClick={() => mark(p.slug, null)}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section id="aprendizado" className="ph-section" aria-labelledby="ph-apr">
        <SectionHead id="ph-apr" kicker="04" title="O que aprendemos com você" />
        <LearningPanel sb={sb} uid={uid} consent={prof?.learning_consent ?? null} events={data.events} onChange={reload} />
      </section>

      <section id="conta" className="ph-section" aria-labelledby="ph-conta">
        <SectionHead id="ph-conta" kicker="05" title="Conta e dados" />
        <div className="ph-account">
          <div className="account-row">
            <label className="admin-field">
              Como quer ser chamado(a)
              <input
                type="text"
                maxLength={60}
                value={displayName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome ou apelido"
              />
            </label>
            <button className="btn-ghost" onClick={saveName}>
              Salvar
            </button>
          </div>
          <p className="admin-muted">Conta: {session.user.email}</p>
          <p className="admin-muted">
            Guardamos só o que aparece nesta página: nome, mapa olfativo, armário e — se você autorizou — os sinais de uso. Veja a{" "}
            <Link href="/privacidade">política de privacidade</Link>.
          </p>
          <div className="admin-actions">
            <button className="btn-ghost" onClick={() => sb.auth.signOut()}>
              Sair
            </button>
            <button className="admin-link account-delete" onClick={removeAccount}>
              Apagar minha conta e meus dados
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ id, kicker, title, text }: { id: string; kicker: string; title: string; text?: string }) {
  return (
    <div className="ph-head">
      <p className="eyebrow">
        <span>{kicker}</span>
      </p>
      <h2 id={id}>{title}</h2>
      {text && <p className="admin-muted">{text}</p>}
    </div>
  );
}

function Metrics({
  profile,
  answers,
  sources,
}: {
  profile: Profile;
  answers: { intensity?: string | null; moment?: string | null; climate?: string | null };
  sources: (string | false | 0 | null | undefined)[];
}) {
  const lead = topAccords(profile, 1)[0];
  const f = focus(profile);
  const b = 1 - f; // posição no eixo focado → eclético
  const bLabel = f > 0.62 ? "Focado" : f > 0.32 ? "Equilibrado" : "Eclético";
  const bText =
    f > 0.62
      ? "Você sabe o que quer: poucos acordes dominam."
      : f > 0.32
        ? "Um lado forte, com espaço para variar."
        : "Gosta de explorar famílias diferentes.";
  const prefs = (["intensity", "moment", "climate"] as const)
    .map((k) => ({ k, v: answers[k] ? PREF[k][answers[k]!] : null }))
    .filter((x) => x.v);
  return (
    <div className="ph-metrics">
      {lead && (
        <div className="ph-lead" style={{ "--acc": ACCORD_COLOR[lead.key] } as React.CSSProperties}>
          <span className="ph-lead-icon">
            <Icon name={lead.key} size={26} />
          </span>
          <div>
            <p className="ph-label">Seu lado mais forte</p>
            <p className="ph-lead-name">
              {lead.label} <small>{Math.round(lead.value * 100)}%</small>
            </p>
          </div>
        </div>
      )}
      <div className="ph-breadth">
        <p className="ph-label">
          Amplitude do gosto <strong>{bLabel}</strong>
        </p>
        <div className="ph-breadth-bar" role="img" aria-label={`Gosto ${bLabel.toLowerCase()}, entre focado e eclético`}>
          <span style={{ left: `${Math.round(b * 100)}%` }} />
        </div>
        <p className="ph-breadth-ends" aria-hidden>
          <span>Focado</span>
          <span>Eclético</span>
        </p>
        <p className="admin-muted">{bText}</p>
      </div>
      <ul className="ph-rings">
        {derivedMetrics(profile).map((m) => (
          <li key={m.key}>
            <Ring value={m.value} />
            <span>{RING_LABEL[m.key] ?? m.label}</span>
          </li>
        ))}
      </ul>
      {prefs.length > 0 && (
        <div>
          <p className="ph-label">Suas preferências</p>
          <ul className="chips ph-prefs">
            {prefs.map((p) => (
              <li key={p.k}>{p.v}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="admin-muted ph-sources">
        Baseado em {sources.filter(Boolean).join(", ") || "seu perfil"}. Estimativa a partir das notas declaradas.{" "}
        <Link href="/mapa-olfativo" className="admin-link">
          Refazer o mapa
        </Link>
      </p>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const c = 2 * Math.PI * 24;
  return (
    <svg viewBox="0 0 60 60" width={64} height={64} role="img" aria-label={`${value.toLocaleString("pt-BR")} de 10`}>
      <circle cx={30} cy={30} r={24} className="ph-ring-track" />
      <circle
        cx={30}
        cy={30}
        r={24}
        className="ph-ring-val"
        strokeDasharray={`${(value / 10) * c} ${c}`}
        transform="rotate(-90 30 30)"
      />
      <text x={30} y={34.5} textAnchor="middle">
        {value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
      </text>
    </svg>
  );
}

/** Destaca no menu a seção visível. */
function useActiveSection(ready: boolean) {
  const [active, setActive] = useState<string>(NAV[0].id);
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready]);
  return active;
}
