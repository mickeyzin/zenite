"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AiBadge } from "@/components/ui/AiBadge";
import { Icon, type IconName } from "@/components/ui/Icons";
import { ACCORDS, topAccords, type AccordKey, type Profile } from "@/lib/olfactory";
import type { SlotCandidate, SlotCard } from "@/lib/similar-slots";
import { useSession } from "@/lib/supabase/useSession";

type Taste = { profile: Profile; avoid: Set<string> } | null;

const empty = () => Object.fromEntries(ACCORDS.map((a) => [a.key, 0])) as Profile;
const cos = (a: Profile, b: Profile) => {
  let d = 0,
    na = 0,
    nb = 0;
  for (const { key } of ACCORDS) {
    d += a[key] * b[key];
    na += a[key] ** 2;
    nb += b[key] ** 2;
  }
  return na && nb ? d / Math.sqrt(na * nb) : 0;
};
const listPt = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}`);
const label = (k: AccordKey) => ACCORDS.find((a) => a.key === k)!.label.toLowerCase();

/** Gosto do leitor: mapa olfativo + armário + (com autorização) o que ele tem olhado. Mesmos pesos de "Para você". */
function useTaste(profiles: Record<string, Profile>): { taste: Taste; loading: boolean; logged: boolean } {
  const { sb, session } = useSession();
  const [taste, setTaste] = useState<Taste>(null);
  const [doneFor, setDoneFor] = useState<string | null>(null);
  const uid = session?.user.id;
  const setLoading = (v: boolean) => !v && setDoneFor(uid ?? null);
  useEffect(() => {
    if (!sb || !uid) return;
    let live = true;
    (async () => {
      const [p, w] = await Promise.all([
        sb.from("profiles").select("quiz_profile, learning_consent").eq("user_id", uid).maybeSingle(),
        sb.from("wardrobe").select("status, perfume:perfumes(slug)"),
      ]);
      const consent = (p.data as { learning_consent?: boolean } | null)?.learning_consent;
      const ev = consent
        ? await sb.from("user_events").select("kind, created_at, perfume:perfumes(slug)").not("perfume_id", "is", null).limit(300)
        : { data: [] };
      if (!live) return;
      const u = empty();
      let any = false;
      const add = (pr: Profile | undefined | null, k: number) => {
        if (!pr) return;
        for (const { key } of ACCORDS) u[key] += (pr[key] ?? 0) * k;
        any = true;
      };
      add((p.data as { quiz_profile?: Profile } | null)?.quiz_profile, 1.2);
      const avoid = new Set<string>();
      for (const r of (w.data ?? []) as unknown as { status: string; perfume: { slug: string } | null }[]) {
        const slug = r.perfume?.slug;
        if (!slug) continue;
        if (r.status === "gostei") add(profiles[slug], 0.9);
        if (r.status === "tenho") add(profiles[slug], 0.5);
        if (r.status === "nao_gostei") add(profiles[slug], -0.6);
        if (r.status === "nao_gostei" || r.status === "tenho") avoid.add(slug);
      }
      // Sinais de uso: no máximo 0,8 de peso somado, perdendo força com o tempo.
      const W = { view: 0.15, compare: 0.25, offer_click: 0.45 } as Record<string, number>;
      const sig = ((ev.data ?? []) as unknown as { kind: string; created_at: string; perfume: { slug: string } | null }[])
        .filter((e) => e.perfume?.slug && W[e.kind])
        .map((e) => ({
          slug: e.perfume!.slug,
          w: W[e.kind] * 0.5 ** ((Date.now() - Date.parse(e.created_at)) / 86_400_000 / 30),
        }));
      const total = sig.reduce((a, b) => a + b.w, 0);
      for (const s of sig) add(profiles[s.slug], (s.w * Math.min(0.8, total)) / (total || 1));
      if (!any) return setLoading(false);
      for (const { key } of ACCORDS) u[key] = Math.max(0, u[key]);
      const sum = Object.values(u).reduce((a, b) => a + b, 0);
      if (sum) {
        for (const { key } of ACCORDS) u[key] /= sum;
        setTaste({ profile: u, avoid });
      }
      setLoading(false);
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setLoading só grava o uid atual
  }, [sb, uid, profiles]);
  const loading = session === undefined || (!!uid && doneFor !== uid);
  return { taste: uid ? taste : null, loading, logged: Boolean(uid) };
}

const KIND: Record<string, { title: string; icon: IconName; hint: string }> = {
  inspiracao: { title: "Inspirado em", icon: "star", hint: "O perfume de referência" },
  parecido: { title: "Mais parecido", icon: "sparkle", hint: "Maior afinidade de perfil" },
  custo: { title: "Custo-benefício", icon: "tag", hint: "Parecido e mais em conta" },
  tambem: { title: "Também parecido", icon: "sparkle", hint: "Outra opção de perfil próximo" },
  gosto: { title: "Para o seu gosto", icon: "heart", hint: "Escolhido pelo seu perfil" },
};

function Card({ kind, card: c, note, extra }: { kind: string; card: SlotCard; note?: string; extra?: React.ReactNode }) {
  const k = KIND[kind];
  const img = c.poster ? (
    <Image src={c.poster} alt="" width={240} height={293} />
  ) : (
    <span className="slot-noimg" aria-hidden>
      ✦
    </span>
  );
  return (
    <li className={`slot-card slot-${kind}`}>
      <p className="slot-kicker">
        <Icon name={k.icon} size={14} /> {k.title}
      </p>
      <div className={`slot-img has-ai${c.poster ? "" : " is-empty"}`}>
        <AiBadge show={!!c.poster && c.posterAi} />
        {c.slug ? (
          <Link href={`/perfumes/${c.slug}`} tabIndex={-1} aria-hidden>
            {img}
          </Link>
        ) : (
          img
        )}
      </div>
      <h3 className="slot-name">{c.slug ? <Link href={`/perfumes/${c.slug}`}>{c.name}</Link> : c.name}</h3>
      <p className="slot-meta">
        {c.score !== null ? `Afinidade ${Math.round(c.score * 100)}%` : k.hint}
        {c.price !== null && ` · a partir de ${c.price.toLocaleString("pt-BR", { style: "currency", currency: c.currency })}`}
      </p>
      <p className="slot-reason">{c.reason}</p>
      {note && <p className="slot-note">{note}</p>}
      {extra}
    </li>
  );
}

/** "Perfumes semelhantes": no máximo 3 cartões, cada um com um papel. */
export function SimilarSlots({
  baseSlug,
  first,
  second,
  candidates,
  profiles,
}: {
  baseSlug: string;
  first: { kind: "inspiracao" | "parecido"; card: SlotCard } | null;
  second: { kind: "custo" | "parecido"; card: SlotCard; note?: string } | null;
  candidates: SlotCandidate[];
  profiles: Record<string, Profile>;
}) {
  const { taste, loading, logged } = useTaste(profiles);
  const third = useMemo(() => {
    if (!candidates.length) return null;
    if (!taste) return { card: candidates[0] as SlotCard, personal: false };
    const pool = candidates.filter((c) => !taste.avoid.has(c.slug));
    const best = (pool.length ? pool : candidates)
      .map((c) => ({ c, s: 0.55 * (c.score ?? 0) + 0.45 * cos(taste.profile, c.profile) }))
      .sort((a, b) => b.s - a.s)[0].c;
    const mine = topAccords(taste.profile, 3).map((a) => a.key);
    const shared = topAccords(best.profile, 3)
      .map((a) => a.key)
      .filter((k) => mine.includes(k));
    const reason = shared.length
      ? `Notas parecidas com as deste perfume, puxando para o seu lado ${listPt(shared.map(label))}.`
      : best.reason;
    return { card: { ...best, reason } as SlotCard, personal: true };
  }, [candidates, taste]);

  if (!first && !second && !third) return <p className="text-[var(--z-muted)]">Ainda não há perfumes parecidos no catálogo.</p>;
  return (
    <ul className="slot-list">
      {first && <Card kind={first.kind} card={first.card} />}
      {second && <Card kind={second.kind === "custo" ? "custo" : "tambem"} card={second.card} note={second.note} />}
      {third && (
        <Card
          kind={third.personal ? "gosto" : "tambem"}
          card={third.card}
          note={loading ? "Carregando o seu perfil…" : undefined}
          extra={
            !third.personal && !loading ? (
              <p className="slot-note">
                {logged ? <Link href="/mapa-olfativo">Faça o mapa olfativo</Link> : <Link href="/conta">Entre na sua conta</Link>}{" "}
                para ver aqui a escolha pelo seu gosto.
              </p>
            ) : null
          }
        />
      )}
      {(first?.card.slug || second?.card.slug) && (
        <li className="slot-compare">
          <Link href={`/comparar?a=${baseSlug}&b=${first?.card.slug ?? second?.card.slug}`} className="btn-ghost">
            Comparar em detalhe
          </Link>
        </li>
      )}
    </ul>
  );
}
