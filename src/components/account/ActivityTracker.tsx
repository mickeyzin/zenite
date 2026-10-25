"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { normalize } from "@/lib/olfactory";
import { ALL_NOTES } from "@/lib/quiz";
import { useSession } from "@/lib/supabase/useSession";

/**
 * Registra sinais de uso SÓ para quem entrou na conta E autorizou em
 * "Minha conta" (learning_consent). O banco também recusa sem autorização.
 * - resenha lida com calma (8 s com a aba visível) → view
 * - comparação aberta → compare (os dois perfumes)
 * - clique em oferta → offer_click
 * - busca no catálogo que é exatamente uma nota conhecida → search_note
 */
export const CONSENT_EVENT = "zenite:consentimento";
export const SEARCH_EVENT = "zenite:busca";

const NOTE_BY_KEY = new Map(ALL_NOTES.map((n) => [normalize(n), n]));
const ids = new Map<string, string>();
const once = (key: string) => {
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
  } catch {
    /* sem armazenamento: registra mesmo assim */
  }
  return true;
};

async function idOf(sb: SupabaseClient, slug: string) {
  if (ids.has(slug)) return ids.get(slug)!;
  const { data } = await sb.from("perfumes").select("id").eq("slug", slug).maybeSingle();
  const id = (data as { id: string } | null)?.id;
  if (id) ids.set(slug, id);
  return id ?? null;
}

export function ActivityTracker() {
  const { sb, session } = useSession();
  const pathname = usePathname();
  const uid = session?.user.id;
  const consent = useRef(false);

  // Lê a autorização (e relê quando a pessoa muda em Minha conta).
  useEffect(() => {
    if (!sb || !uid) {
      consent.current = false;
      return;
    }
    const read = () =>
      sb
        .from("profiles")
        .select("learning_consent")
        .eq("user_id", uid)
        .maybeSingle()
        .then(({ data }) => (consent.current = Boolean((data as { learning_consent?: boolean } | null)?.learning_consent)));
    read();
    window.addEventListener(CONSENT_EVENT, read);
    return () => window.removeEventListener(CONSENT_EVENT, read);
  }, [sb, uid]);

  useEffect(() => {
    if (!sb || !uid) return;
    const log = async (kind: string, slug: string | null, note?: string) => {
      if (!consent.current) return;
      const perfume_id = slug ? await idOf(sb, slug) : null;
      if (slug && !perfume_id) return;
      await sb.from("user_events").insert({ user_id: uid, kind, perfume_id, note: note ?? null });
    };
    const timers: number[] = [];
    const review = pathname?.match(/^\/perfumes\/([^/]+)$/)?.[1];

    if (review) {
      // Conta como "lida" após 8 s com a aba visível.
      let seen = 0;
      const tick = window.setInterval(() => {
        if (document.visibilityState !== "visible") return;
        seen += 1;
        if (seen >= 8) {
          window.clearInterval(tick);
          if (once(`zv:${review}`)) log("view", review);
        }
      }, 1000);
      timers.push(tick);
    }
    if (pathname === "/comparar") {
      const q = new URLSearchParams(location.search || (location.hash.includes("=") ? "?" + location.hash.slice(1) : ""));
      const pair = [q.get("a"), q.get("b")].filter(Boolean) as string[];
      if (pair.length === 2 && once(`zc:${pair.join("|")}`)) timers.push(window.setTimeout(() => pair.forEach((s) => log("compare", s)), 3000));
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="/oferta/"]');
      if (a && review) log("offer_click", review);
    };
    const onSearch = (e: Event) => {
      const note = NOTE_BY_KEY.get(normalize(String((e as CustomEvent).detail ?? "")));
      if (note && once(`zn:${note}`)) log("search_note", null, note);
    };
    document.addEventListener("click", onClick);
    window.addEventListener(SEARCH_EVENT, onSearch);
    return () => {
      timers.forEach((t) => window.clearInterval(t));
      document.removeEventListener("click", onClick);
      window.removeEventListener(SEARCH_EVENT, onSearch);
    };
  }, [sb, uid, pathname]);

  return null;
}
