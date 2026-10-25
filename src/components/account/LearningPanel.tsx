"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_EVENT } from "./ActivityTracker";

interface Ev {
  kind: "view" | "compare" | "offer_click" | "search_note";
  note: string | null;
  created_at: string;
  perfume: { slug: string; full_name: string } | null;
}

const KIND = { view: "leu a resenha", compare: "comparou", offer_click: "abriu uma oferta" } as const;

/** "O que aprendemos com você": autorização, resumo dos sinais e apagar histórico. */
export function LearningPanel({ sb, uid, consent, onChange }: { sb: SupabaseClient; uid: string; consent: boolean | null; onChange: () => void }) {
  const [events, setEvents] = useState<Ev[]>([]);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!consent) return;
    let live = true;
    sb.from("user_events")
      .select("kind, note, created_at, perfume:perfumes(slug, full_name)")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data }) => live && setEvents((data as unknown as Ev[]) ?? []));
    return () => {
      live = false;
    };
  }, [sb, consent, tick]);

  const setConsent = async (yes: boolean) => {
    if (!yes && !confirm("Desligar também apaga todo o histórico de uso. Continuar?")) return;
    setBusy(true);
    await sb.from("profiles").upsert({ user_id: uid, learning_consent: yes, learning_consent_at: new Date().toISOString() });
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setBusy(false);
    if (!yes) setEvents([]);
    onChange();
  };
  const clear = async () => {
    if (!confirm("Apagar todo o histórico de uso? As recomendações voltam a usar só o mapa e o armário.")) return;
    setBusy(true);
    await sb.from("user_events").delete().eq("user_id", uid);
    setBusy(false);
    setEvents([]);
    setTick((t) => t + 1);
  };

  // Resumo: perfumes por número de sinais; notas pesquisadas.
  const byPerfume = new Map<string, { name: string; slug: string; kinds: Record<string, number> }>();
  const notes = new Map<string, number>();
  for (const e of events) {
    if (e.kind === "search_note" && e.note) notes.set(e.note, (notes.get(e.note) ?? 0) + 1);
    else if (e.perfume) {
      const cur = byPerfume.get(e.perfume.slug) ?? { name: e.perfume.full_name, slug: e.perfume.slug, kinds: {} };
      cur.kinds[e.kind] = (cur.kinds[e.kind] ?? 0) + 1;
      byPerfume.set(e.perfume.slug, cur);
    }
  }
  const tops = [...byPerfume.values()].sort((a, b) => sum(b.kinds) - sum(a.kinds)).slice(0, 6);

  return (
    <section className="account-card" aria-labelledby="acc-aprender">
      <h2 id="acc-aprender">O que aprendemos com você</h2>
      <label className="learning-toggle">
        <input type="checkbox" checked={Boolean(consent)} disabled={busy} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          <strong>Aprender com o que eu vejo</strong>
          <small>
            Resenhas lidas com calma, comparações, cliques em ofertas e notas pesquisadas afinam as suas recomendações em{" "}
            <Link href="/para-voce">Para você</Link>. Desligado por padrão.
          </small>
        </span>
      </label>
      {consent ? (
        events.length === 0 ? (
          <p className="admin-muted">Nada registrado ainda. Navegue pelas resenhas e pelo catálogo.</p>
        ) : (
          <>
            {tops.length > 0 && (
              <div className="learning-list">
                <h3>Perfumes que você tem olhado</h3>
                <ul>
                  {tops.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/perfumes/${t.slug}`}>{t.name}</Link>
                      <span className="admin-muted">
                        {Object.entries(t.kinds)
                          .map(([k, n]) => `${KIND[k as keyof typeof KIND]}${n > 1 ? ` (${n}×)` : ""}`)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {notes.size > 0 && (
              <div className="learning-list">
                <h3>Notas que você pesquisou</h3>
                <ul className="chips">
                  {[...notes.keys()].map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="admin-muted">
              {events.length} sinal(is) nos últimos 180 dias. Sinais antigos pesam menos.{" "}
              <button type="button" className="admin-link" disabled={busy} onClick={clear}>
                Apagar histórico
              </button>
            </p>
          </>
        )
      ) : (
        <p className="admin-muted">Desligado: nada do que você faz no site é registrado.</p>
      )}
    </section>
  );
}

const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);
