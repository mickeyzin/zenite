"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icons";
import { useSession } from "@/lib/supabase/useSession";
import { WARDROBE_LABEL, type WardrobeStatus } from "./AccountView";

const ICON: Record<WardrobeStatus, IconName> = { tenho: "bottle", gostei: "heart", nao_gostei: "off", quero: "star" };

/** "Tenho / Gostei / Não gostei / Quero experimentar" na resenha. */
export function WardrobeButtons({ slug, name }: { slug: string; name: string }) {
  const { sb, session } = useSession();
  const [perfumeId, setPerfumeId] = useState<string | null>(null);
  const [status, setStatus] = useState<WardrobeStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const uid = session?.user.id;

  useEffect(() => {
    if (!sb || !uid) return;
    let live = true;
    (async () => {
      const { data: p } = await sb.from("perfumes").select("id").eq("slug", slug).maybeSingle();
      const id = (p as { id: string } | null)?.id ?? null;
      if (!live || !id) return;
      setPerfumeId(id);
      const { data: w } = await sb.from("wardrobe").select("status").eq("perfume_id", id).maybeSingle();
      if (live) setStatus((w as { status: WardrobeStatus } | null)?.status ?? null);
    })();
    return () => {
      live = false;
    };
  }, [sb, uid, slug]);

  if (!sb || session === undefined) return null;
  if (!session)
    return (
      <p className="wardrobe-cta">
        <Icon name="bottle" size={16} />
        <span>
          <Link href="/conta">Entre</Link> para guardar este perfume no seu armário.
        </span>
      </p>
    );

  const choose = async (st: WardrobeStatus) => {
    if (!perfumeId || !uid) return;
    setBusy(true);
    const next = status === st ? null : st;
    const { error } = next
      ? await sb.from("wardrobe").upsert({ user_id: uid, perfume_id: perfumeId, status: next })
      : await sb.from("wardrobe").delete().eq("user_id", uid).eq("perfume_id", perfumeId);
    setBusy(false);
    if (!error) setStatus(next);
  };

  return (
    <div className="wardrobe" role="group" aria-label={`Seu armário: ${name}`}>
      {(Object.keys(WARDROBE_LABEL) as WardrobeStatus[]).map((st) => (
        <button key={st} type="button" className="wardrobe-btn" aria-pressed={status === st} disabled={busy || !perfumeId} onClick={() => choose(st)}>
          <Icon name={ICON[st]} size={16} />
          {WARDROBE_LABEL[st]}
        </button>
      ))}
      {status && (
        <Link href="/conta" className="admin-link wardrobe-link">
          Ver meu armário
        </Link>
      )}
    </div>
  );
}
