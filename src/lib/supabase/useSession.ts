"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState, useSyncExternalStore } from "react";
import { browserClient } from "./client";

const noop = () => () => {};

/** Sessão do visitante no navegador. undefined = ainda verificando. */
export function useSession() {
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  const sb = isClient ? browserClient() : null;
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    if (!sb) return;
    let live = true;
    sb.auth.getSession().then(({ data }) => live && setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => live && setSession(s));
    return () => {
      live = false;
      data.subscription.unsubscribe();
    };
  }, [sb]);
  return { sb, session: sb ? session : isClient ? null : undefined };
}

/** Respostas do quiz guardadas até a pessoa entrar na conta. */
export const PENDING_QUIZ_KEY = "zenite:quiz-pendente";
