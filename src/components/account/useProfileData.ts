"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Perfume } from "@/data/types";
import type { Profile } from "@/lib/olfactory";
import type { Answers } from "@/lib/quiz";
import { recommend, signalsFrom, tasteProfile, type UserEvent, type UserTaste, type WardrobeStatus } from "@/lib/recommend";

export interface ProfileRow {
  display_name: string | null;
  quiz_answers: Partial<Answers> | null;
  quiz_profile: Profile | null;
  quiz_updated_at: string | null;
  learning_consent: boolean | null;
}

export interface EventRow extends UserEvent {
  perfumeName: string | null;
}

export interface ProfileData {
  profile: ProfileRow | null;
  /** slug → status */
  wardrobe: Record<string, WardrobeStatus>;
  /** slug → id (para gravar no armário) */
  ids: Record<string, string>;
  events: EventRow[];
}

/** Carrega de uma vez tudo o que a página do perfil mostra. */
export function useProfileData(sb: SupabaseClient, uid: string, catalog: Perfume[], before?: () => Promise<unknown>) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let live = true;
    (async () => {
      if (before) await before();
      const [p, w, ids] = await Promise.all([
        sb
          .from("profiles")
          .select("display_name, quiz_answers, quiz_profile, quiz_updated_at, learning_consent")
          .eq("user_id", uid)
          .maybeSingle(),
        sb.from("wardrobe").select("status, perfume:perfumes(slug)").order("updated_at", { ascending: false }),
        sb.from("perfumes").select("id, slug"),
      ]);
      // Sem a migração 0005 a coluna learning_consent não existe: tenta de novo sem ela.
      let prof = p.data as ProfileRow | null;
      if (p.error && /learning_consent/.test(p.error.message)) {
        const again = await sb
          .from("profiles")
          .select("display_name, quiz_answers, quiz_profile, quiz_updated_at")
          .eq("user_id", uid)
          .maybeSingle();
        prof = again.data ? { ...(again.data as ProfileRow), learning_consent: false } : null;
      }
      const ev = prof?.learning_consent
        ? await sb
            .from("user_events")
            .select("kind, note, created_at, perfume:perfumes(slug, full_name)")
            .order("created_at", { ascending: false })
            .limit(500)
        : { data: [] };
      if (!live) return;
      const wardrobe: ProfileData["wardrobe"] = {};
      for (const r of (w.data ?? []) as unknown as { status: WardrobeStatus; perfume: { slug: string } | null }[])
        if (r.perfume) wardrobe[r.perfume.slug] = r.status;
      type Raw = {
        kind: UserEvent["kind"];
        note: string | null;
        created_at: string;
        perfume: { slug: string; full_name: string } | null;
      };
      setData({
        profile: prof,
        wardrobe,
        ids: Object.fromEntries(((ids.data ?? []) as { id: string; slug: string }[]).map((x) => [x.slug, x.id])),
        events: ((ev.data ?? []) as unknown as Raw[]).map((e) => ({
          kind: e.kind,
          note: e.note,
          created_at: e.created_at,
          slug: e.perfume?.slug ?? null,
          perfumeName: e.perfume?.full_name ?? null,
        })),
      });
    })();
    return () => {
      live = false;
    };
    // `before` roda só na primeira carga de cada conta (salvar o quiz pendente).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sb, uid, tick]);

  const taste = useMemo<UserTaste | null>(() => {
    if (!data) return null;
    const answers = data.profile?.quiz_answers ?? {};
    return {
      quizProfile: data.profile?.quiz_profile ?? null,
      loved: answers.loved ?? [],
      avoided: answers.avoided ?? [],
      wardrobe: data.wardrobe,
      signals: data.events.length ? signalsFrom(data.events) : undefined,
    };
  }, [data]);

  const combined = useMemo(() => (taste ? tasteProfile(taste, catalog) : null), [taste, catalog]);
  const rec = useMemo(() => (taste ? recommend(taste, catalog) : null), [taste, catalog]);

  /** Marca no armário com resposta imediata na tela. */
  const mark = useCallback(
    async (slug: string, status: WardrobeStatus | null) => {
      const id = data?.ids[slug];
      if (!data || !id) return;
      const wardrobe = { ...data.wardrobe };
      if (status) wardrobe[slug] = status;
      else delete wardrobe[slug];
      setData({ ...data, wardrobe });
      if (status) await sb.from("wardrobe").upsert({ user_id: uid, perfume_id: id, status });
      else await sb.from("wardrobe").delete().eq("user_id", uid).eq("perfume_id", id);
    },
    [data, sb, uid],
  );

  return { data, taste, combined, rec, reload, mark, setData };
}
