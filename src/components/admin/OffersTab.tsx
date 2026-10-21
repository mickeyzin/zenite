"use client";

import { useState } from "react";
import type { TabProps } from "./AdminApp";
import { useLoad } from "./useLoad";

interface Store {
  id: string;
  slug: string;
  name: string;
}
interface Offer {
  id: string;
  title: string;
  volume_ml: number | null;
  price: number | null;
  url: string;
  affiliate_url: string | null;
  is_affiliate: boolean;
  available: boolean;
  active: boolean;
  checked_at: string | null;
  store: { name: string } | null;
}

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Ofertas por perfume. Preço só entra com a data em que foi conferido; link de
 * afiliado sempre marcado como afiliado (o banco recusa o contrário).
 */
export function OffersTab({ sb, refreshSite }: TabProps) {
  const [perfumeId, setPerfumeId] = useState("");
  const perfumes = useLoad<{ id: string; full_name: string }[]>(() => sb.from("perfumes").select("id, full_name").order("full_name"));
  const stores = useLoad<Store[]>(() => sb.from("stores").select("id, slug, name").order("name"));
  const offers = useLoad<Offer[]>(
    () =>
      perfumeId
        ? sb
            .from("offers")
            .select("id, title, volume_ml, price, url, affiliate_url, is_affiliate, available, active, checked_at, store:stores(name)")
            .eq("perfume_id", perfumeId)
            .order("price", { ascending: true, nullsFirst: false })
        : Promise.resolve({ data: [], error: null }),
    perfumeId,
  );

  // Ofertas ativas sem conferência recente (o site já não mostra o preço delas).
  const stale = useLoad<StaleOffer[]>(async () => {
    const r = await sb
      .from("offers")
      .select("id, title, checked_at, perfume_id, perfume:perfumes(full_name), store:stores(name)")
      .eq("active", true)
      .order("checked_at", { ascending: true, nullsFirst: true });
    const limit = Date.now() - STALE_HOURS * 3600_000;
    return { data: (r.data as StaleOffer[] | null)?.filter((o) => !o.checked_at || Date.parse(o.checked_at) < limit) ?? null, error: r.error };
  }, String(perfumeId));

  const update = async (id: string, patch: Partial<Offer>) => {
    const { error } = await sb.from("offers").update(patch).eq("id", id);
    if (error) return alert(error.message);
    offers.reload();
    stale.reload();
    await refreshSite();
  };
  const remove = async (id: string) => {
    if (!confirm("Excluir esta oferta? O histórico de preços dela também será apagado.")) return;
    const { error } = await sb.from("offers").delete().eq("id", id);
    if (error) return alert(error.message);
    offers.reload();
    await refreshSite();
  };

  return (
    <section className="admin-section" aria-labelledby="offers-title">
      <header className="admin-section-head">
        <div>
          <h2 id="offers-title">Ofertas</h2>
          <p className="admin-muted">
            Preços conferidos à mão: o Mercado Livre bloqueia a leitura de anúncios pela API oficial (testado em out/2026). Confira
            o preço na loja e confirme aqui — no site, preço com mais de 3 dias deixa de aparecer. Link de afiliado: gere no painel
            de afiliados do Mercado Livre e cole no cadastro.
          </p>
        </div>
        <label className="admin-field admin-select-wide">
          Perfume
          <select value={perfumeId} onChange={(e) => setPerfumeId(e.target.value)}>
            <option value="">Escolha um perfume…</option>
            {(perfumes.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>
        </label>
      </header>

      {!!stale.data?.length && (
        <details className="admin-log" open={!perfumeId}>
          <summary>Preços para conferir ({stale.data.length})</summary>
          <ul>
            {stale.data.map((o) => (
              <li key={o.id}>
                <button className="admin-link" onClick={() => setPerfumeId(o.perfume_id)}>
                  {o.perfume?.full_name}
                </button>{" "}
                · {o.store?.name} · {o.checked_at ? `conferido em ${new Date(o.checked_at).toLocaleDateString("pt-BR")}` : "nunca conferido"}
              </li>
            ))}
          </ul>
        </details>
      )}

      {perfumeId && (
        <>
          {offers.error && <p className="admin-error">{offers.error}</p>}
          <ul className="admin-list">
            {(offers.data ?? []).map((o) => (
              <li key={o.id} className="admin-item">
                <div className="admin-item-body">
                  <p className="admin-item-title">
                    <strong>{o.store?.name}</strong> · {o.title}
                    {o.volume_ml ? ` · ${o.volume_ml} ml` : ""}
                    {o.is_affiliate && <span className="admin-tag">afiliado</span>}
                    {!o.active && <span className="admin-tag admin-tag-arquivado">inativa</span>}
                    {!o.available && <span className="admin-tag admin-tag-warn">indisponível</span>}
                  </p>
                  <p className="admin-muted">
                    {o.price != null ? brl(Number(o.price)) : "Sem preço"}
                    {o.checked_at ? ` · conferido em ${new Date(o.checked_at).toLocaleDateString("pt-BR")}` : ""} ·{" "}
                    <a href={o.affiliate_url ?? o.url} target="_blank" rel="noreferrer">
                      link ↗
                    </a>
                  </p>
                  {o.active && <PriceCheck offer={o} onSave={(patch) => update(o.id, patch)} />}
                </div>
                <div className="admin-item-actions">
                  <button className="admin-link" onClick={() => update(o.id, { active: !o.active })}>
                    {o.active ? "Desativar" : "Ativar"}
                  </button>
                  <button className="admin-link" onClick={() => remove(o.id)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {!offers.loading && !offers.data?.length && <p className="admin-muted">Nenhuma oferta para este perfume.</p>}
          <NewOffer
            sb={sb}
            perfumeId={perfumeId}
            stores={stores.data ?? []}
            onSaved={async () => {
              stores.reload();
              offers.reload();
              await refreshSite();
            }}
          />
        </>
      )}
    </section>
  );
}

const STALE_HOURS = 72;

/** "1.249,90" → 1249.9 · "249,90" → 249.9 · "249.90" → 249.9 (ponto só como decimal se não houver vírgula). */
export function parsePrice(s: string) {
  const t = s.replace(/[^\d.,]/g, "");
  if (t.includes(",")) return Number(t.replace(/\./g, "").replace(",", "."));
  return /^\d+\.\d{1,2}$/.test(t) ? Number(t) : Number(t.replace(/\./g, ""));
}

interface StaleOffer {
  id: string;
  title: string;
  checked_at: string | null;
  perfume_id: string;
  perfume: { full_name: string } | null;
  store: { name: string } | null;
}

/** Confirma o preço visto agora na loja (ou que está esgotado). */
function PriceCheck({ offer, onSave }: { offer: Offer; onSave: (patch: Partial<Offer>) => Promise<void> }) {
  const [price, setPrice] = useState(offer.price != null ? String(offer.price).replace(".", ",") : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const save = async (patch: Partial<Offer>) => {
    setBusy(true);
    await onSave({ ...patch, checked_at: new Date().toISOString() });
    setBusy(false);
  };
  return (
    <div className="admin-pricecheck">
      <input
        type="text"
        inputMode="decimal"
        aria-label={`Preço atual em ${offer.store?.name ?? "loja"}`}
        placeholder="Preço agora (R$)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        className="btn-ghost"
        disabled={busy}
        onClick={() => {
          const v = parsePrice(price);
          if (!price.trim() || !(v >= 0)) return setErr("Preço inválido.");
          setErr(null);
          save({ price: v, available: true });
        }}
      >
        Confirmar preço
      </button>
      <button className="admin-link" disabled={busy} onClick={() => save({ available: false })}>
        Esgotado
      </button>
      {err && <span className="admin-error">{err}</span>}
    </div>
  );
}

function NewOffer({
  sb,
  perfumeId,
  stores,
  onSaved,
}: Pick<TabProps, "sb"> & { perfumeId: string; stores: Store[]; onSaved: () => Promise<void> }) {
  const empty = { store: "", newStore: "", title: "", volume: "", price: "", url: "", affiliate: "", isAffiliate: false };
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setMsg(null);
    const price = f.price.trim() ? parsePrice(f.price) : null;
    const isUrl = (u: string) => /^https:\/\/\S+$/.test(u.trim());
    if (!f.title.trim() || !isUrl(f.url)) return setMsg("Informe o título e um link https da oferta.");
    if (f.affiliate.trim() && !isUrl(f.affiliate)) return setMsg("O link de afiliado precisa começar com https://.");
    if (price !== null && !(price >= 0)) return setMsg("Preço inválido.");
    if (!f.store && !f.newStore.trim()) return setMsg("Escolha ou cadastre a loja.");
    setBusy(true);
    let storeId = f.store;
    if (!storeId) {
      // Loja com o mesmo nome já cadastrada: reaproveita.
      const s = await sb
        .from("stores")
        .upsert({ slug: slugify(f.newStore), name: f.newStore.trim() }, { onConflict: "slug" })
        .select("id")
        .single();
      if (s.error) {
        setBusy(false);
        return setMsg(`Erro na loja: ${s.error.message}`);
      }
      storeId = s.data.id;
    }
    const affiliate = f.affiliate.trim() || null;
    const { error } = await sb.from("offers").insert({
      perfume_id: perfumeId,
      store_id: storeId,
      title: f.title.trim(),
      volume_ml: f.volume.trim() ? Number(f.volume) : null,
      price,
      url: f.url.trim(),
      affiliate_url: affiliate,
      is_affiliate: Boolean(affiliate) || f.isAffiliate,
      checked_at: price !== null ? new Date().toISOString() : null,
    });
    setBusy(false);
    if (error) return setMsg(`Erro: ${error.message}`);
    setF(empty);
    setMsg("Oferta salva.");
    await onSaved();
  };

  const bind = (k: "newStore" | "title" | "volume" | "price" | "url" | "affiliate") => ({
    value: f[k],
    onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }),
  });

  return (
    <fieldset className="admin-fieldset">
      <legend>Nova oferta</legend>
      <div className="admin-grid">
        <label className="admin-field">
          Loja
          <select value={f.store} onChange={(e) => setF({ ...f, store: e.target.value })}>
            <option value="">Nova loja…</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        {!f.store && (
          <label className="admin-field">
            Nome da nova loja
            <input type="text" {...bind("newStore")} />
          </label>
        )}
        <label className="admin-field">
          Título do anúncio
          <input type="text" {...bind("title")} />
        </label>
        <label className="admin-field">
          Volume (ml)
          <input type="text" inputMode="numeric" {...bind("volume")} />
        </label>
        <label className="admin-field">
          Preço conferido agora (R$)
          <input type="text" inputMode="decimal" placeholder="Vazio = sem preço" {...bind("price")} />
        </label>
        <label className="admin-field">
          Link da oferta
          <input type="url" placeholder="https://" {...bind("url")} />
        </label>
        <label className="admin-field">
          Link de afiliado (opcional)
          <input type="url" placeholder="https://" {...bind("affiliate")} />
        </label>
        <label className="admin-check">
          <input type="checkbox" checked={f.isAffiliate || Boolean(f.affiliate.trim())} disabled={Boolean(f.affiliate.trim())} onChange={(e) => setF({ ...f, isAffiliate: e.target.checked })} />
          É link de afiliado (será identificado no site)
        </label>
      </div>
      <div className="admin-actions">
        <button className="btn-ghost" disabled={busy} onClick={save}>
          {busy ? "Salvando…" : "Salvar oferta"}
        </button>
        {msg && <span className={msg.startsWith("Oferta") ? "admin-notice" : "admin-error"}>{msg}</span>}
      </div>
    </fieldset>
  );
}
