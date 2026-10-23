"use client";

import { useMemo, useState } from "react";
import { cropToWebp } from "@/lib/image-resize";
import { ACCORDS } from "@/lib/olfactory";
import type { TabProps } from "./AdminApp";
import { useLoad } from "./useLoad";

interface NoteRow {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string | null;
  note_accords: { accord_key: string; weight: number }[];
  perfume_notes: { perfume_id: string }[];
  image_url?: string | null;
  image_credit?: string | null;
}

/**
 * Classificação das notas em acordes (pesos de 0 a 1). É o que alimenta o
 * perfil olfativo estimado e a semelhança entre perfumes.
 */
export function NotesTab({ sb, refreshSite }: TabProps) {
  const [filter, setFilter] = useState<"classificar" | "imagem" | "todas">("classificar");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const { data, error, loading, reload } = useLoad<{ rows: NoteRow[]; hasImages: boolean }>(async () => {
    const base = "id, slug, name_pt, name_en, note_accords(accord_key, weight), perfume_notes(perfume_id)";
    const r = await sb.from("notes").select(`${base}, image_url, image_credit`).order("name_pt");
    // Sem a migração 0002, a coluna de imagem ainda não existe.
    if (r.error && /image_url/.test(r.error.message)) {
      const r2 = await sb.from("notes").select(base).order("name_pt");
      return { data: r2.data ? { rows: r2.data as NoteRow[], hasImages: false } : null, error: r2.error };
    }
    return { data: r.data ? { rows: r.data as NoteRow[], hasImages: true } : null, error: r.error };
  });
  const all = useMemo(() => data?.rows ?? [], [data]);
  const hasImages = data?.hasImages ?? true;
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    // A nota aberta continua na lista mesmo depois de sair do filtro (ex.: ganhou imagem).
    return all.filter(
      (n) =>
        n.id === open ||
        ((filter === "todas" || (filter === "classificar" ? !n.note_accords.length : !n.image_url)) &&
          (!t || n.name_pt.toLowerCase().includes(t) || n.name_en?.toLowerCase().includes(t))),
    );
  }, [all, filter, q, open]);
  const missing = all.filter((n) => !n.note_accords.length).length;
  const noImage = all.filter((n) => !n.image_url).length;

  return (
    <section className="admin-section" aria-labelledby="notes-title">
      <header className="admin-section-head">
        <div>
          <h2 id="notes-title">Notas</h2>
          <p className="admin-muted">
            Peso de cada nota em cada acorde (0 a 1). Ex.: bergamota = cítrico 1, aromático 0,2. Notas sem classificação não
            entram no perfil estimado — a resenha avisa quando falta alguma.
          </p>
        </div>
        <div className="admin-filters">
          <input
            type="search"
            className="admin-search"
            placeholder="Buscar nota…"
            aria-label="Buscar nota"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-ghost" aria-pressed={filter === "classificar"} onClick={() => setFilter("classificar")}>
            Sem classificação ({missing})
          </button>
          {hasImages && (
            <button className="btn-ghost" aria-pressed={filter === "imagem"} onClick={() => setFilter("imagem")}>
              Sem imagem ({noImage})
            </button>
          )}
          <button className="btn-ghost" aria-pressed={filter === "todas"} onClick={() => setFilter("todas")}>
            Todas
          </button>
        </div>
      </header>
      {loading && <p className="admin-muted">Carregando…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!hasImages && (
        <p className="admin-error">
          Para enviar imagens das notas, rode no Supabase (SQL Editor) o arquivo supabase/migrations/0002_note_images.sql.
        </p>
      )}
      {!loading && !rows.length && (
        <p className="admin-muted">
          {filter === "classificar" ? "Todas as notas estão classificadas." : filter === "imagem" ? "Todas as notas têm imagem." : "Nenhuma nota."}
        </p>
      )}
      <ul className="admin-list">
        {rows.map((n) => (
          <li key={n.id} className="admin-item admin-item-col">
            <button className="admin-link admin-strong admin-note-row" aria-expanded={open === n.id} onClick={() => setOpen(open === n.id ? null : n.id)}>
              {n.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={n.image_url} alt="" width={32} height={32} className="admin-note-thumb" />
              ) : (
                <span className="admin-note-thumb admin-note-thumb-empty" aria-hidden />
              )}
              {n.name_pt}
              {n.name_en && <span className="admin-muted"> · {n.name_en}</span>}
              <span className="admin-muted"> · {new Set(n.perfume_notes.map((x) => x.perfume_id)).size} perfume(s)</span>
              {!n.note_accords.length && <span className="admin-tag admin-tag-warn">sem classificação</span>}
            </button>
            {open === n.id && hasImages && (
              <NoteImage
                key={`img-${n.id}`}
                sb={sb}
                note={n}
                onSaved={async () => {
                  reload();
                  await refreshSite();
                }}
              />
            )}
            {open === n.id && (
              <WeightsForm
                key={n.id}
                note={n}
                onSaved={async () => {
                  reload();
                  await refreshSite();
                }}
                sb={sb}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function WeightsForm({ sb, note, onSaved }: Pick<TabProps, "sb"> & { note: NoteRow; onSaved: () => Promise<void> }) {
  const [name, setName] = useState(note.name_pt);
  const [w, setW] = useState<Record<string, string>>(() =>
    Object.fromEntries(ACCORDS.map((a) => [a.key, String(note.note_accords.find((x) => x.accord_key === a.key)?.weight ?? "")])),
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    const entries = Object.entries(w)
      .map(([k, v]) => [k, Number(v.replace(",", "."))] as const)
      .filter(([, v]) => v > 0);
    if (entries.some(([, v]) => !(v <= 1))) return setMsg("Os pesos vão de 0 a 1.");
    setBusy(true);
    const steps = [
      name.trim() !== note.name_pt ? await sb.from("notes").update({ name_pt: name.trim() }).eq("id", note.id) : { error: null },
      await sb.from("note_accords").delete().eq("note_id", note.id),
      entries.length
        ? await sb.from("note_accords").insert(entries.map(([accord_key, weight]) => ({ note_id: note.id, accord_key, weight })))
        : { error: null },
    ];
    setBusy(false);
    const err = steps.find((s) => s.error)?.error;
    if (err) return setMsg(`Erro: ${err.message}`);
    setMsg("Salvo.");
    await onSaved();
  };

  return (
    <div className="admin-weights">
      <label className="admin-field">
        Nome em português
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="admin-grid admin-grid-5">
        {ACCORDS.map((a) => (
          <label key={a.key} className="admin-field">
            {a.label}
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={w[a.key]}
              onChange={(e) => setW({ ...w, [a.key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="admin-actions">
        <button className="btn-ghost" disabled={busy} onClick={save}>
          {busy ? "Salvando…" : "Salvar nota"}
        </button>
        {msg && <span className={msg === "Salvo." ? "admin-notice" : "admin-error"}>{msg}</span>}
      </div>
    </div>
  );
}

/** Imagem da nota: recortada em quadrado 256×256 WebP e guardada no Storage. */
function NoteImage({ sb, note, onSaved }: Pick<TabProps, "sb"> & { note: NoteRow; onSaved: () => Promise<void> }) {
  const [blob, setBlob] = useState<{ data: Blob; preview: string } | null>(null);
  const [credit, setCredit] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const pick = async (file: File | undefined) => {
    setMsg(null);
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) return setMsg("Imagem acima de 25 MB.");
    try {
      const data = await cropToWebp(file, 256, 256);
      if (blob) URL.revokeObjectURL(blob.preview);
      setBlob({ data, preview: URL.createObjectURL(data) });
    } catch (e) {
      setMsg(`Erro: ${(e as Error).message}`);
    }
  };

  const upload = async () => {
    if (!blob) return;
    if (!credit.trim()) return setMsg("Informe o crédito ou a licença da imagem.");
    setBusy(true);
    const path = `notas/${note.slug}-${Date.now()}.webp`;
    const up = await sb.storage.from("perfumes").upload(path, blob.data, { contentType: "image/webp", upsert: false });
    if (up.error) {
      setBusy(false);
      return setMsg(`Erro no envio: ${up.error.message}`);
    }
    const url = sb.storage.from("perfumes").getPublicUrl(path).data.publicUrl;
    const { error } = await sb.from("notes").update({ image_url: url, image_credit: credit.trim() }).eq("id", note.id);
    setBusy(false);
    if (error) return setMsg(`Erro: ${error.message}`);
    URL.revokeObjectURL(blob.preview);
    setBlob(null);
    setMsg("Imagem salva.");
    await onSaved();
  };

  const remove = async () => {
    if (!confirm("Remover a imagem desta nota? Ela volta a usar o ícone.")) return;
    setBusy(true);
    const { error } = await sb.from("notes").update({ image_url: null, image_credit: null }).eq("id", note.id);
    setBusy(false);
    if (error) return setMsg(`Erro: ${error.message}`);
    setMsg("Imagem removida.");
    await onSaved();
  };

  const shown = blob?.preview ?? note.image_url;
  return (
    <div className="admin-note-image">
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shown} alt={blob ? "Pré-visualização da imagem da nota" : `Imagem atual de ${note.name_pt}`} width={96} height={96} />
      ) : (
        <span className="admin-note-thumb-empty admin-note-big" aria-hidden />
      )}
      <div className="admin-grid">
        <label className="admin-field">
          Imagem da nota (recortada em quadrado automaticamente)
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        <label className="admin-field">
          Crédito / licença (obrigatório)
          <input type="text" placeholder="Ex.: Foto Zênite · Unsplash (licença livre)" value={credit} onChange={(e) => setCredit(e.target.value)} />
        </label>
        {note.image_credit && <p className="admin-muted">Crédito atual: {note.image_credit}</p>}
        <div className="admin-actions">
          <button className="btn-ghost" disabled={!blob || busy} onClick={upload}>
            {busy ? "Enviando…" : "Enviar imagem"}
          </button>
          {note.image_url && (
            <button className="admin-link" disabled={busy} onClick={remove}>
              Remover imagem
            </button>
          )}
          {msg && <span className={/salva|removida/.test(msg) ? "admin-notice" : "admin-error"}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
