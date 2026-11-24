"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { AI_LICENSE } from "@/lib/ai-label";
import { isAffiliateLink, storeFromUrl } from "@/lib/affiliate";
import { cropToWebp } from "@/lib/image-resize";

export interface LinkRow {
  id: string;
  slug: string;
  full_name: string;
  perfume_images: { id: string; url?: string; kind?: string; license?: string | null }[];
}
type Pasted = { blob: Blob; preview: string };
type RowState = { state: "ok" | "erro" | "aviso" | "salvando"; msg: string };

const DRAFT_KEY = "zenite:links-rascunho";
const POSTER_W = 900;
const POSTER_H = 1100;
const ML_CREDIT = "Foto do anúncio no Mercado Livre";

/* ——— Chamadas à rota /api/mercadolivre ——— */
async function ml(sb: SupabaseClient, body: Record<string, string>) {
  const { data } = await sb.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sessão expirada: entre de novo.");
  const res = await fetch("/api/mercadolivre", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `Erro ${res.status}`);
  return json;
}

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const random = (n: number) => b64url(crypto.getRandomValues(new Uint8Array(n)));

const posterOf = (p: LinkRow) => p.perfume_images.find((i) => i.kind === "poster");
const isML = (url: string) => storeFromUrl(url)?.slug === "mercado-livre";
const realPoster = (p: LinkRow) => {
  const poster = posterOf(p);
  return !!poster && poster.license !== AI_LICENSE;
};

/** Conexão com o Mercado Livre: status, botão de conectar e o retorno do login. */
function MercadoLivreConnect({ sb, onStatus }: { sb: SupabaseClient; onStatus: (connected: boolean) => void }) {
  const [st, setSt] = useState<{ configured: boolean; connected: boolean } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const statusRef = useRef(onStatus);
  useEffect(() => {
    statusRef.current = onStatus;
  });

  useEffect(() => {
    let live = true;
    (async () => {
      const q = new URLSearchParams(location.search);
      if (q.has("ml_code") || q.has("ml_error")) {
        history.replaceState(null, "", location.pathname);
        const saved = (() => {
          try {
            return JSON.parse(sessionStorage.getItem("zenite:ml-login") ?? "null") as { state: string; verifier: string } | null;
          } catch {
            return null;
          }
        })();
        if (q.has("ml_error")) setMsg(`Mercado Livre: ${q.get("ml_error")}`);
        else if (!saved || saved.state !== q.get("ml_state"))
          setMsg("Login do Mercado Livre não confere. Tente conectar de novo.");
        else {
          try {
            await ml(sb, { action: "exchange", code: q.get("ml_code")!, verifier: saved.verifier });
            setMsg("Mercado Livre conectado.");
          } catch (e) {
            setMsg((e as Error).message);
          }
        }
        try {
          sessionStorage.removeItem("zenite:ml-login");
        } catch {}
      }
      try {
        const s = await ml(sb, { action: "status" });
        if (live) {
          setSt(s);
          statusRef.current(s.connected);
        }
      } catch (e) {
        if (live) setMsg((e as Error).message);
      }
    })();
    return () => {
      live = false;
    };
  }, [sb]);

  const connect = async () => {
    setBusy(true);
    try {
      const state = random(24);
      const verifier = random(48);
      const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
      sessionStorage.setItem("zenite:ml-login", JSON.stringify({ state, verifier }));
      const { url } = await ml(sb, { action: "start", state, challenge: b64url(digest) });
      location.href = url;
    } catch (e) {
      setMsg((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="admin-ml">
      {st === null ? (
        !msg && <span className="admin-muted">Verificando Mercado Livre…</span>
      ) : !st.configured ? (
        <span className="admin-error">Faltam ML_CLIENT_ID e ML_CLIENT_SECRET na Vercel.</span>
      ) : st.connected ? (
        <span className="admin-muted">
          ✔ Mercado Livre conectado ·{" "}
          <button className="admin-link" disabled={busy} onClick={connect}>
            reconectar
          </button>
        </span>
      ) : (
        <button className="btn-ghost" disabled={busy} onClick={connect}>
          {busy ? "Abrindo…" : "Conectar Mercado Livre"}
        </button>
      )}
      {msg && <span className={/conectado\.$/.test(msg) ? "admin-notice" : "admin-error"}>{msg}</span>}
    </div>
  );
}

/**
 * Links e fotos em série: em cada perfume, cole o link (Mercado Livre ou Amazon) e, se quiser, a foto (Ctrl+V ou arrastar).
 * "Salvar tudo" cadastra as ofertas e os pôsteres. Sem foto colada, links do Mercado Livre buscam a foto do anúncio pela API.
 */
export function LinksBoard({ sb, rows, onSaved }: { sb: SupabaseClient; rows: LinkRow[]; onSaved: () => Promise<void> }) {
  const [links, setLinks] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "{}");
    } catch {
      return {};
    }
  });
  const [pasted, setPasted] = useState<Record<string, Pasted>>({});
  const [states, setStates] = useState<Record<string, RowState>>({});
  const [credit, setCredit] = useState("Imagem de divulgação do fabricante");
  const [replaceReal, setReplaceReal] = useState(false);
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(Object.fromEntries(Object.entries(links).filter(([, v]) => v.trim()))));
    } catch {}
  }, [links]);

  const setState = (id: string, s: RowState) => setStates((cur) => ({ ...cur, [id]: s }));
  const pending = useMemo(() => rows.filter((p) => links[p.id]?.trim() || pasted[p.id]), [rows, links, pasted]);

  const takeImage = async (id: string, file: File | null | undefined) => {
    if (!file || !/^image\//.test(file.type)) return;
    try {
      const blob = await cropToWebp(file, POSTER_W, POSTER_H);
      setPasted((cur) => {
        if (cur[id]) URL.revokeObjectURL(cur[id].preview);
        return { ...cur, [id]: { blob, preview: URL.createObjectURL(blob) } };
      });
    } catch (e) {
      setState(id, { state: "erro", msg: (e as Error).message });
    }
  };

  const savePoster = async (p: LinkRow, blob: Blob, creditText: string, license: string | null) => {
    const path = `${p.slug}/poster-${Date.now()}.webp`;
    const up = await sb.storage.from("perfumes").upload(path, blob, { contentType: "image/webp", upsert: false });
    if (up.error) throw new Error(`envio da foto: ${up.error.message}`);
    const url = sb.storage.from("perfumes").getPublicUrl(path).data.publicUrl;
    await sb.from("perfume_images").delete().eq("perfume_id", p.id).eq("kind", "poster");
    const ins = await sb.from("perfume_images").insert({ perfume_id: p.id, url, kind: "poster", credit: creditText, license });
    if (ins.error) throw new Error(ins.error.message);
  };

  /** Foto do anúncio do Mercado Livre pela API → pôster. Devolve a mensagem para a linha. */
  const fetchPhoto = async (p: LinkRow, link: string) => {
    try {
      const r = await ml(sb, { action: "photo", url: link });
      const blob = await cropToWebp(new File([await (await fetch(r.image)).blob()], "ml.jpg"), POSTER_W, POSTER_H);
      await savePoster(p, blob, ML_CREDIT, `Mercado Livre ${r.permalink}`);
      return "foto do anúncio salva";
    } catch (e) {
      return `foto: ${(e as Error).message}`;
    }
  };

  /** Para os perfumes da lista que já têm oferta do Mercado Livre: busca a foto sem precisar colar o link de novo. */
  const photosFromOffers = async () => {
    const targets = rows.filter((p) => !realPoster(p) || replaceReal);
    if (!targets.length) return;
    setBusy(true);
    const { data, error } = await sb
      .from("offers")
      .select("perfume_id, url, affiliate_url, store:stores!inner(slug)")
      .eq("store.slug", "mercado-livre")
      .in(
        "perfume_id",
        targets.map((p) => p.id),
      );
    if (error) {
      setBusy(false);
      return alert(error.message);
    }
    const byPerfume = new Map<string, string>();
    for (const o of (data ?? []) as { perfume_id: string; url: string; affiliate_url: string | null }[])
      if (!byPerfume.has(o.perfume_id)) byPerfume.set(o.perfume_id, o.url || o.affiliate_url!);
    let saved = 0;
    for (const p of targets) {
      const link = byPerfume.get(p.id);
      if (!link) continue;
      setState(p.id, { state: "salvando", msg: "buscando a foto do anúncio…" });
      const msg = await fetchPhoto(p, link);
      if (msg.startsWith("foto do")) saved++;
      setState(p.id, { state: msg.startsWith("foto do") ? "ok" : "aviso", msg });
    }
    setBusy(false);
    if (saved) await onSaved();
    else if (!byPerfume.size) alert("Nenhum perfume desta lista (sem foto real) tem oferta do Mercado Livre.");
  };

  const saveAll = async () => {
    if (!pending.length) return;
    if (Object.keys(pasted).length && !credit.trim()) return alert("Informe o crédito das fotos coladas.");
    setBusy(true);
    const storeIds = new Map<string, string>();
    let changed = 0;
    for (const p of pending) {
      setState(p.id, { state: "salvando", msg: "salvando…" });
      const link = links[p.id]?.trim() ?? "";
      const notes: string[] = [];
      try {
        // 1) Oferta
        if (link) {
          if (!/^https:\/\/\S+$/.test(link)) throw new Error("o link precisa começar com https://");
          const st = storeFromUrl(link)!;
          const dup = await sb.from("offers").select("id").eq("perfume_id", p.id).eq("url", link).limit(1);
          if (dup.data?.length) notes.push("oferta já existia");
          else {
            if (!storeIds.has(st.slug)) {
              const s = await sb
                .from("stores")
                .upsert({ slug: st.slug, name: st.name }, { onConflict: "slug" })
                .select("id")
                .single();
              if (s.error) throw new Error(`loja: ${s.error.message}`);
              storeIds.set(st.slug, s.data.id);
            }
            const aff = isAffiliateLink(link);
            const o = await sb.from("offers").insert({
              perfume_id: p.id,
              store_id: storeIds.get(st.slug),
              title: p.full_name,
              price: null,
              url: link,
              affiliate_url: aff ? link : null,
              is_affiliate: aff,
            });
            if (o.error) throw new Error(`oferta: ${o.error.message}`);
            notes.push(`oferta ${st.name}${aff ? " (afiliado)" : ""}`);
          }
        }
        // 2) Foto: a colada tem prioridade; sem ela, a do anúncio do Mercado Livre
        const img = pasted[p.id];
        if (img) {
          await savePoster(p, img.blob, credit.trim(), null);
          notes.push("foto colada salva");
        } else if (link && isML(link) && (!realPoster(p) || replaceReal)) {
          if (!connected) notes.push("foto não buscada: conecte o Mercado Livre");
          else notes.push(await fetchPhoto(p, link));
        } else if (link && isML(link)) notes.push("já tem foto real (mantida)");
        changed++;
        setState(p.id, {
          state: notes.some((n) => n.startsWith("foto:") || n.startsWith("foto não")) ? "aviso" : "ok",
          msg: notes.join(" · "),
        });
        setLinks((cur) => ({ ...cur, [p.id]: "" }));
        setPasted((cur) => {
          const n = { ...cur };
          if (n[p.id]) URL.revokeObjectURL(n[p.id].preview);
          delete n[p.id];
          return n;
        });
      } catch (e) {
        setState(p.id, { state: "erro", msg: (e as Error).message });
      }
    }
    setBusy(false);
    if (changed) await onSaved();
  };

  return (
    <div className="admin-links">
      <div className="admin-fieldset">
        <p className="admin-muted">
          Em cada perfume, cole o link de afiliado. Para a foto, clique na caixa da linha e cole com <kbd>Ctrl</kbd>+<kbd>V</kbd>{" "}
          (botão direito na foto → “Copiar imagem”) ou arraste o arquivo. No fim, “Salvar tudo”. Links do Mercado Livre sem foto
          colada buscam a foto do anúncio pela API. Da Amazon, só o link: fotos da Amazon só podem vir da API deles. Os links
          digitados ficam guardados neste navegador até você salvar.
        </p>
        <div className="admin-actions">
          <MercadoLivreConnect sb={sb} onStatus={setConnected} />
        </div>
        <div className="admin-grid">
          <label className="admin-field">
            Crédito das fotos coladas
            <input type="text" value={credit} onChange={(e) => setCredit(e.target.value)} />
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={replaceReal} onChange={(e) => setReplaceReal(e.target.checked)} /> trocar também fotos
            reais já existentes pela do anúncio
          </label>
        </div>
        <div className="admin-actions">
          <button className="btn-primary" disabled={busy || !pending.length} onClick={saveAll}>
            {busy ? "Salvando…" : `Salvar tudo (${pending.length})`}
          </button>
          <button
            className="btn-ghost"
            disabled={busy || !connected}
            title={connected ? undefined : "Conecte o Mercado Livre primeiro"}
            onClick={photosFromOffers}
          >
            Buscar fotos dos anúncios já cadastrados
          </button>
        </div>
      </div>

      <ul className="admin-links-list">
        {rows.map((p) => {
          const img = pasted[p.id];
          const current = posterOf(p);
          const st = states[p.id];
          const link = links[p.id] ?? "";
          const store = link.trim() ? storeFromUrl(link.trim()) : null;
          return (
            <li key={p.id} className={`admin-links-row ${st ? `is-${st.state}` : ""}`}>
              <div
                className={`admin-paste${img ? " has-img" : ""}`}
                tabIndex={0}
                role="button"
                aria-label={`Colar ou arrastar a foto de ${p.full_name}`}
                title="Clique e cole com Ctrl+V, ou arraste a imagem"
                onPaste={(e) => {
                  const f = [...e.clipboardData.items].find((i) => i.type.startsWith("image/"))?.getAsFile();
                  if (f) {
                    e.preventDefault();
                    takeImage(p.id, f);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  takeImage(p.id, e.dataTransfer.files[0]);
                }}
              >
                {img || current?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img?.preview ?? current!.url} alt="" />
                ) : (
                  <span>Ctrl+V</span>
                )}
                {img && <span className="admin-paste-new">nova</span>}
                {!img && current?.license === AI_LICENSE && <span className="admin-paste-new">IA</span>}
              </div>
              <div className="admin-links-main">
                <strong>{p.full_name}</strong>
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://mercadolivre.com/sec/… ou https://amzn.to/…"
                  aria-label={`Link de afiliado de ${p.full_name}`}
                  value={link}
                  onChange={(e) => setLinks((cur) => ({ ...cur, [p.id]: e.target.value }))}
                  onPaste={(e) => {
                    // Colar uma imagem no campo do link também vale como foto.
                    const f = [...e.clipboardData.items].find((i) => i.type.startsWith("image/"))?.getAsFile();
                    if (f) {
                      e.preventDefault();
                      takeImage(p.id, f);
                    }
                  }}
                />
                <span className={st?.state === "erro" ? "admin-error" : "admin-muted"}>
                  {st
                    ? `${{ ok: "✔", aviso: "⚠", erro: "✘", salvando: "…" }[st.state]} ${st.msg}`
                    : store
                      ? `${store.name}${isAffiliateLink(link.trim()) ? " · afiliado" : " · link comum"}`
                      : current
                        ? current.license === AI_LICENSE
                          ? "com ilustração IA"
                          : "com foto"
                        : "sem foto"}
                </span>
              </div>
              {img && (
                <button
                  className="admin-link"
                  onClick={() =>
                    setPasted((cur) => {
                      const n = { ...cur };
                      URL.revokeObjectURL(n[p.id].preview);
                      delete n[p.id];
                      return n;
                    })
                  }
                >
                  tirar foto
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
