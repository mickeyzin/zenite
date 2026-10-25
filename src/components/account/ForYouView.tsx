"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProfileBars } from "@/components/charts/Charts";
import { PerfumeArt } from "@/components/ui/PerfumeArt";
import type { Perfume } from "@/data/types";
import { topAccords, type Profile } from "@/lib/olfactory";
import { recommend, type Pick, type WardrobeStatus } from "@/lib/recommend";
import { useSession } from "@/lib/supabase/useSession";

interface Loaded {
  quizProfile: Profile | null;
  loved: string[];
  avoided: string[];
  wardrobe: Record<string, WardrobeStatus>;
  ids: Record<string, string>; // slug → id (para gravar no armário)
}

export function ForYouView({ catalog }: { catalog: Perfume[] }) {
  const { sb, session } = useSession();
  const [data, setData] = useState<Loaded | null>(null);
  const uid = session?.user.id;

  useEffect(() => {
    if (!sb || !uid) return;
    let live = true;
    (async () => {
      const [p, w, ids] = await Promise.all([
        sb.from("profiles").select("quiz_answers, quiz_profile").eq("user_id", uid).maybeSingle(),
        sb.from("wardrobe").select("status, perfume:perfumes(slug)"),
        sb.from("perfumes").select("id, slug"),
      ]);
      if (!live) return;
      const answers = (p.data?.quiz_answers ?? {}) as { loved?: string[]; avoided?: string[] };
      const wardrobe: Loaded["wardrobe"] = {};
      for (const r of (w.data ?? []) as unknown as { status: WardrobeStatus; perfume: { slug: string } | null }[]) if (r.perfume) wardrobe[r.perfume.slug] = r.status;
      setData({
        quizProfile: (p.data?.quiz_profile as Profile | null) ?? null,
        loved: answers.loved ?? [],
        avoided: answers.avoided ?? [],
        wardrobe,
        ids: Object.fromEntries(((ids.data ?? []) as { id: string; slug: string }[]).map((x) => [x.slug, x.id])),
      });
    })();
    return () => {
      live = false;
    };
  }, [sb, uid]);

  const rec = useMemo(() => (data ? recommend(data, catalog) : null), [data, catalog]);

  if (session === undefined || (session && !data)) return <p className="admin-muted">Carregando…</p>;
  if (!sb || !session)
    return (
      <div className="account-card foryou-empty">
        <h2>Entre para ver as suas recomendações</h2>
        <p className="admin-muted">Elas são feitas a partir do seu mapa olfativo e dos perfumes que você marca no armário.</p>
        <div className="admin-actions">
          <Link href="/conta" className="btn-primary">
            Entrar ou criar conta
          </Link>
          <Link href="/mapa-olfativo" className="btn-ghost">
            Fazer o mapa olfativo
          </Link>
        </div>
      </div>
    );
  if (!rec?.profile)
    return (
      <div className="account-card foryou-empty">
        <h2>Falta conhecer o seu gosto</h2>
        <p className="admin-muted">
          Faça o mapa olfativo e salve no perfil, ou marque nas resenhas perfumes que você tem ou já usou.
        </p>
        <Link href="/mapa-olfativo" className="btn-primary inline-block">
          Fazer o mapa olfativo
        </Link>
      </div>
    );

  const mark = async (slug: string, status: WardrobeStatus) => {
    const id = data!.ids[slug];
    if (!id) return;
    setData({ ...data!, wardrobe: { ...data!.wardrobe, [slug]: status } }); // ajusta na hora
    await (sb as SupabaseClient).from("wardrobe").upsert({ user_id: uid, perfume_id: id, status });
  };

  const top = topAccords(rec.profile, 3);
  return (
    <div className="foryou">
      <section className="account-card foryou-profile" aria-labelledby="fy-perfil">
        <div>
          <h2 id="fy-perfil">O seu perfil hoje</h2>
          <p className="account-big">{top.map((t) => t.label).join(" · ")}</p>
          <p className="admin-muted">
            Mapa olfativo{Object.keys(data!.wardrobe).length ? ` + ${Object.keys(data!.wardrobe).length} perfume(s) do armário` : ""}.{" "}
            <Link href="/conta" className="admin-link">
              Ver minha conta
            </Link>
          </p>
        </div>
        <ProfileBars profile={rec.profile} caption="Seu perfil olfativo combinado" />
      </section>

      {rec.sections.map((s) => (
        <section key={s.key} className="foryou-section" aria-labelledby={`fy-${s.key}`}>
          <h2 id={`fy-${s.key}`}>{s.title}</h2>
          <p className="admin-muted">{s.subtitle}</p>
          {s.picks.length ? (
            <ul className={`foryou-grid ${s.key === "top" ? "is-hero" : ""}`}>
              {s.picks.map((pick, i) => (
                <PickCard key={`${pick.perfume.slug}-${i}`} pick={pick} hero={s.key === "top"} onMark={mark} />
              ))}
            </ul>
          ) : (
            <p className="admin-muted">{s.empty ?? "Nada por aqui ainda — o catálogo está crescendo."}</p>
          )}
        </section>
      ))}
      <p className="admin-muted foryou-note">
        Sugestões estimadas a partir das notas declaradas de cada perfume. Teste na pele antes de comprar.
      </p>
    </div>
  );
}

function PickCard({ pick: { perfume: p, score, reason }, hero, onMark }: { pick: Pick; hero: boolean; onMark: (slug: string, s: WardrobeStatus) => void }) {
  const offer = p.offers?.find((o) => o.available && o.price !== null);
  return (
    <li className={`foryou-card ${hero ? "is-hero" : ""}`}>
      <Link href={`/perfumes/${p.slug}`} className="foryou-img" tabIndex={-1} aria-hidden>
        {p.poster ? <Image src={p.poster} alt="" width={360} height={440} /> : <PerfumeArt perfume={p} className="poster-art" />}
      </Link>
      <div className="foryou-body">
        <p className="foryou-score">Afinidade {Math.round(score * 100)}%</p>
        <h3>
          <Link href={`/perfumes/${p.slug}`}>{p.fullName}</Link>
        </h3>
        <p className="foryou-reason">{reason}</p>
        {offer && (
          <p className="foryou-offer">
            a partir de {offer.price!.toLocaleString("pt-BR", { style: "currency", currency: offer.currency })} · {offer.store}
          </p>
        )}
        <div className="foryou-actions">
          <button type="button" className="admin-link" onClick={() => onMark(p.slug, "nao_gostei")}>
            Não é pra mim
          </button>
          <button type="button" className="admin-link" onClick={() => onMark(p.slug, "tenho")}>
            Já tenho
          </button>
          <button type="button" className="admin-link" onClick={() => onMark(p.slug, "quero")}>
            Quero experimentar
          </button>
        </div>
      </div>
    </li>
  );
}
