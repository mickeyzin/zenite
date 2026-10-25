"use client";

import Link from "next/link";
import { useState } from "react";
import type { Profile } from "@/lib/olfactory";
import type { Answers } from "@/lib/quiz";
import { PENDING_QUIZ_KEY, useSession } from "@/lib/supabase/useSession";

/** Fim do quiz: salvar no perfil (logado) ou guardar até a pessoa criar a conta. */
export function SaveToProfile({ answers, profile }: { answers: Answers; profile: Profile }) {
  const { sb, session } = useSession();
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  if (!sb || session === undefined) return <p className="quiz-help">Suas respostas ficam só neste aparelho.</p>;

  if (!session)
    return (
      <div className="quiz-save">
        <p>Quer guardar este mapa e receber recomendações feitas para você?</p>
        <Link
          href="/conta"
          className="btn-primary inline-block"
          onClick={() => {
            try {
              localStorage.setItem(PENDING_QUIZ_KEY, JSON.stringify({ answers, profile }));
            } catch {
              /* sem armazenamento: a pessoa refaz depois */
            }
          }}
        >
          Criar conta e salvar
        </Link>
        <p className="quiz-help">Sem conta, suas respostas ficam só neste aparelho.</p>
      </div>
    );

  const save = async () => {
    setState("saving");
    const { error } = await sb
      .from("profiles")
      .upsert({ user_id: session.user.id, quiz_answers: answers, quiz_profile: profile, quiz_updated_at: new Date().toISOString() });
    setState(error ? "error" : "saved");
  };

  return (
    <div className="quiz-save">
      {state === "saved" ? (
        <p role="status">
          Mapa salvo no seu perfil. <Link href="/conta#para-voce">Ver recomendações para você</Link>
        </p>
      ) : (
        <button type="button" className="btn-primary" disabled={state === "saving"} onClick={save}>
          {state === "saving" ? "Salvando…" : "Salvar no meu perfil"}
        </button>
      )}
      {state === "error" && <p className="admin-error">Não foi possível salvar agora. Tente de novo.</p>}
    </div>
  );
}
