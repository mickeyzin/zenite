"use client";

import { useEffect, useEffectEvent, useState } from "react";

type Result = { data: unknown; error: { message: string } | null };

/**
 * Carrega dados do banco. Recarrega quando `key` muda ou ao chamar reload().
 * (O cliente Supabase é único na página, então não precisa entrar na chave.)
 */
export function useLoad<T>(load: () => PromiseLike<Result>, key: string = "") {
  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>({
    data: null,
    error: null,
    loading: true,
  });
  const [tick, setTick] = useState(0);
  const run = useEffectEvent(() => load());

  useEffect(() => {
    let live = true;
    Promise.resolve(run()).then(
      ({ data, error }) => live && setState({ data: data as T | null, error: error?.message ?? null, loading: false }),
      (e: Error) => live && setState({ data: null, error: e.message, loading: false }),
    );
    return () => {
      live = false;
    };
  }, [key, tick]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}
