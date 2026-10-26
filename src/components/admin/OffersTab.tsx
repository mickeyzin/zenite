"use client";

import { useState } from "react";
import { isAffiliateLink, storeFromUrl } from "@/lib/affiliate";
import { cropToWebp } from "@/lib/image-resize";
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
  shipping?: string | null;
  seller_reputation?: string | null;
  image_url?: string | null;
  image_credit?: string | null;
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
        ? (async () => {
            const base = "id, title, volume_ml, price, url, affiliate_url, is_affiliate, available, active, checked_at, shipping, seller_reputation, store:stores(name)";
            const q = (cols: string) => sb.from("offers").select(cols).eq("perfume_id", perfumeId).order("price", { ascending: true, nullsFirst: false });
            const r = await q(`${base}, image_url, image_credit`);
            // Sem a migração 0003, a foto da oferta ainda não existe.
            return r.error && /image_url/.test(r.error.message) ? q(base) : r;
          })()
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
            de afiliados do Mercado Livre e cole no cadastro (ou cole vários de uma vez logo abaixo). Links da Amazon e de lojas
            da Awin viram link de afiliado sozinhos quando os códigos estão configurados na Vercel.
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

      <BulkOffers
        sb={sb}
        perfumes={perfumes.data ?? []}
        onSaved={async () => {
          stores.reload();
          offers.reload();
          stale.reload();
          await refreshSite();
        }}
      />

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
                <OfferPhoto sb={sb} offer={o} onSaved={async () => {
                  offers.reload();
                  await refreshSite();
                }} />
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
                    {o.checked_at ? ` · conferido em ${new Date(o.checked_at).toLocaleDateString("pt-BR")}` : ""}
                    {o.shipping ? ` · ${o.shipping}` : ""}
                    {o.seller_reputation ? ` · ${o.seller_reputation}` : ""} ·{" "}
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
  const empty = { store: "", newStore: "", title: "", volume: "", price: "", url: "", affiliate: "", isAffiliate: false, shipping: "", seller: "", credit: "" };
  const [photo, setPhoto] = useState<{ data: Blob; preview: string } | null>(null);
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
    if (photo && !f.credit.trim()) return setMsg("Informe o crédito da foto (ex.: material do programa de afiliados).");
    setBusy(true);
    let imageUrl: string | null = null;
    if (photo) {
      const path = `ofertas/${perfumeId}-${Date.now()}.webp`;
      const up = await sb.storage.from("perfumes").upload(path, photo.data, { contentType: "image/webp", upsert: false });
      if (up.error) {
        setBusy(false);
        return setMsg(`Erro no envio da foto: ${up.error.message}`);
      }
      imageUrl = sb.storage.from("perfumes").getPublicUrl(path).data.publicUrl;
    }
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
      shipping: f.shipping.trim() || null,
      seller_reputation: f.seller.trim() || null,
      ...(imageUrl ? { image_url: imageUrl, image_credit: f.credit.trim() } : {}),
    });
    setBusy(false);
    if (error) return setMsg(`Erro: ${error.message}`);
    setF(empty);
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
    setMsg("Oferta salva.");
    await onSaved();
  };

  const bind = (k: "newStore" | "title" | "volume" | "price" | "url" | "affiliate" | "shipping" | "seller" | "credit") => ({
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
        <label className="admin-field">
          Frete (opcional)
          <input type="text" list="frete-opcoes" placeholder="Ex.: Frete grátis" {...bind("shipping")} />
          <datalist id="frete-opcoes">
            <option value="Frete grátis" />
            <option value="Frete grátis acima de R$ 79" />
            <option value="Chega amanhã" />
            <option value="Full (envio pelo Mercado Livre)" />
          </datalist>
        </label>
        <label className="admin-field">
          Reputação do vendedor (opcional)
          <input type="text" list="reputacao-opcoes" placeholder="Ex.: MercadoLíder Platinum" {...bind("seller")} />
          <datalist id="reputacao-opcoes">
            <option value="Loja oficial" />
            <option value="MercadoLíder Platinum" />
            <option value="MercadoLíder Gold" />
            <option value="MercadoLíder" />
          </datalist>
        </label>
        <label className="admin-field">
          Foto do anúncio (opcional; sem ela, usa o pôster do perfume)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const data = await cropToWebp(file, 480, 480);
                if (photo) URL.revokeObjectURL(photo.preview);
                setPhoto({ data, preview: URL.createObjectURL(data) });
              } catch (err) {
                setMsg(`Erro: ${(err as Error).message}`);
              }
            }}
          />
        </label>
        {photo && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.preview} alt="Pré-visualização da foto da oferta" width={96} height={96} className="admin-offer-thumb" />
            <label className="admin-field">
              Crédito da foto (obrigatório)
              <input type="text" placeholder="Ex.: Material do programa de afiliados" {...bind("credit")} />
            </label>
          </>
        )}
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

/** Foto de uma oferta já cadastrada: trocar ou remover. */
function OfferPhoto({ sb, offer, onSaved }: Pick<TabProps, "sb"> & { offer: Offer; onSaved: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const pick = async (file: File | undefined) => {
    if (!file) return;
    const credit = prompt("Crédito da foto (ex.: Material do programa de afiliados):", offer.image_credit ?? "");
    if (!credit?.trim()) return;
    setBusy(true);
    try {
      const data = await cropToWebp(file, 480, 480);
      const path = `ofertas/${offer.id}-${Date.now()}.webp`;
      const up = await sb.storage.from("perfumes").upload(path, data, { contentType: "image/webp", upsert: false });
      if (up.error) throw new Error(up.error.message);
      const url = sb.storage.from("perfumes").getPublicUrl(path).data.publicUrl;
      const { error } = await sb.from("offers").update({ image_url: url, image_credit: credit.trim() }).eq("id", offer.id);
      if (error) throw new Error(error.message);
      await onSaved();
    } catch (e) {
      alert(`Erro: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!confirm("Remover a foto? A resenha volta a usar o pôster do perfume.")) return;
    setBusy(true);
    const { error } = await sb.from("offers").update({ image_url: null, image_credit: null }).eq("id", offer.id);
    setBusy(false);
    if (error) return alert(error.message);
    await onSaved();
  };
  return (
    <div className="admin-offer-photo">
      {offer.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={offer.image_url} alt="" width={72} height={72} className="admin-offer-thumb" />
      ) : (
        <span className="admin-offer-thumb admin-note-thumb-empty" aria-hidden />
      )}
      <label className="admin-link">
        {busy ? "Enviando…" : offer.image_url ? "Trocar foto" : "Adicionar foto"}
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={(e) => pick(e.target.files?.[0])} />
      </label>
      {offer.image_url && (
        <button className="admin-link" disabled={busy} onClick={remove}>
          Remover
        </button>
      )}
    </div>
  );
}

interface BulkRow {
  line: number;
  raw: string;
  perfume?: { id: string; full_name: string };
  url?: string;
  price: number | null;
  volume: number | null;
  error?: string;
}

const normName = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Várias ofertas de uma vez: uma por linha, "perfume ; link ; preço ; volume" (preço e volume opcionais;
 * aceita ";", "|" ou tabulação, então dá para colar de uma planilha). A loja sai do link.
 */
export function BulkOffers({
  sb,
  perfumes,
  onSaved,
}: Pick<TabProps, "sb"> & { perfumes: { id: string; full_name: string }[]; onSaved: () => Promise<void> }) {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<BulkRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const check = () => {
    setMsg(null);
    const byName = new Map(perfumes.map((p) => [normName(p.full_name), p]));
    const out: BulkRow[] = [];
    text.split(/\r?\n/).forEach((raw, i) => {
      if (!raw.trim()) return;
      const [name = "", link = "", price = "", volume = ""] = raw.split(/\s*[;|\t]\s*/);
      const r: BulkRow = { line: i + 1, raw, price: null, volume: null };
      const n = normName(name);
      r.perfume = byName.get(n);
      if (!r.perfume && n) {
        const hits = perfumes.filter((p) => normName(p.full_name).includes(n));
        if (hits.length === 1) r.perfume = hits[0];
        else if (hits.length > 1) r.error = `nome ambíguo (${hits.length} perfumes): escreva o nome completo`;
      }
      if (!r.perfume && !r.error) r.error = "perfume não encontrado";
      if (/^https:\/\/\S+$/.test(link.trim())) r.url = link.trim();
      else r.error ??= "link precisa começar com https://";
      if (price.trim()) {
        const v = parsePrice(price);
        if (v >= 0) r.price = v;
        else r.error ??= "preço inválido";
      }
      if (volume.trim()) r.volume = Number(volume.replace(/[^\d.,]/g, "").replace(",", ".")) || null;
      out.push(r);
    });
    setRows(out);
  };

  const save = async () => {
    const ok = (rows ?? []).filter((r) => !r.error);
    if (!ok.length) return;
    setBusy(true);
    const stores = new Map<string, string>();
    let saved = 0;
    const errors: string[] = [];
    for (const r of ok) {
      const st = storeFromUrl(r.url!);
      if (!st) continue;
      if (!stores.has(st.slug)) {
        const s = await sb.from("stores").upsert({ slug: st.slug, name: st.name }, { onConflict: "slug" }).select("id").single();
        if (s.error) {
          errors.push(`linha ${r.line}: loja — ${s.error.message}`);
          continue;
        }
        stores.set(st.slug, s.data.id);
      }
      const aff = isAffiliateLink(r.url!);
      const { error } = await sb.from("offers").insert({
        perfume_id: r.perfume!.id,
        store_id: stores.get(st.slug),
        title: `${r.perfume!.full_name}${r.volume ? ` ${r.volume} ml` : ""}`,
        volume_ml: r.volume,
        price: r.price,
        url: r.url,
        affiliate_url: aff ? r.url : null,
        is_affiliate: aff,
        checked_at: r.price !== null ? new Date().toISOString() : null,
      });
      if (error) errors.push(`linha ${r.line}: ${error.message}`);
      else saved++;
    }
    setBusy(false);
    setMsg(`${saved} oferta(s) cadastrada(s).${errors.length ? ` Erros: ${errors.join("; ")}` : ""}`);
    if (saved) {
      setText("");
      setRows(null);
      await onSaved();
    }
  };

  const good = rows?.filter((r) => !r.error).length ?? 0;
  return (
    <details className="admin-fieldset admin-bulk">
      <summary>Colar vários links de uma vez</summary>
      <p className="admin-muted">
        Uma oferta por linha: <code>perfume ; link ; preço ; volume</code>. Preço e volume são opcionais. Funciona com links de
        afiliado do Mercado Livre (copiados do painel de afiliados), da Amazon e de outras lojas — a loja é reconhecida pelo
        link. Dá para colar direto de uma planilha.
      </p>
      <textarea
        className="admin-textarea"
        rows={6}
        aria-label="Ofertas, uma por linha"
        placeholder={"Lattafa Khamrah ; https://mercadolivre.com/sec/abc123 ; 249,90 ; 100\nAfnan 9 PM ; https://www.amazon.com.br/dp/B0XXXX ; 199,00"}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setRows(null);
        }}
      />
      <div className="admin-actions">
        <button className="btn-ghost" disabled={!text.trim()} onClick={check}>
          Conferir
        </button>
        <button className="btn-primary" disabled={busy || !good} onClick={save}>
          {busy ? "Salvando…" : `Cadastrar ${good} oferta(s)`}
        </button>
      </div>
      {rows && (
        <ul className="admin-bulk-list">
          {rows.map((r) => (
            <li key={r.line} className={r.error ? "is-error" : "is-ok"}>
              <span>{r.error ? "✘" : "✔"}</span> linha {r.line}: {r.perfume?.full_name ?? r.raw.split(/[;|\t]/)[0]}
              {r.url && ` · ${storeFromUrl(r.url)?.name ?? ""}${isAffiliateLink(r.url) ? " (afiliado)" : ""}`}
              {r.price !== null && ` · ${brl(r.price)}`}
              {r.error && <em> — {r.error}</em>}
            </li>
          ))}
        </ul>
      )}
      {msg && (
        <p className="admin-notice" role="status">
          {msg}
        </p>
      )}
    </details>
  );
}
