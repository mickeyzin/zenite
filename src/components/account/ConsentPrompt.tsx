"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { CONSENT_EVENT } from "./ActivityTracker";

/** Pergunta de autorização para aprender com o uso (começa desligado). */
export function ConsentPrompt({ sb, uid, onDone }: { sb: SupabaseClient; uid: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const answer = async (yes: boolean) => {
    setBusy(true);
    await sb.from("profiles").upsert({ user_id: uid, learning_consent: yes, learning_consent_at: new Date().toISOString() });
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setBusy(false);
    onDone();
  };
  return (
    <aside className="consent" aria-labelledby="consent-t">
      <h2 id="consent-t">Posso aprender com o que você vê?</h2>
      <p>
        Se você autorizar, a Zênite passa a considerar as resenhas que você lê com calma, as comparações, os cliques em ofertas e as
        notas que você pesquisa, para afinar estas recomendações.
      </p>
      <ul>
        <li>Fica só na sua conta — ninguém mais vê.</li>
        <li>Você vê tudo em “Minha conta” e pode apagar ou desligar quando quiser.</li>
        <li>Sinais antigos perdem força com o tempo e somem depois de 180 dias.</li>
      </ul>
      <div className="admin-actions">
        <button type="button" className="btn-primary" disabled={busy} onClick={() => answer(true)}>
          Sim, pode aprender
        </button>
        <button type="button" className="btn-ghost" disabled={busy} onClick={() => answer(false)}>
          Agora não
        </button>
      </div>
    </aside>
  );
}
