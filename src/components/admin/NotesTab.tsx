"use client";

import { useMemo, useState } from "react";
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
}

/**
 * Classificação das notas em acordes (pesos de 0 a 1). É o que alimenta o
 * perfil olfativo estimado e a semelhança entre perfumes.
 */
export function NotesTab({ sb, refreshSite }: TabProps) {
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const { data, error, loading, reload } = useLoad<NoteRow[]>(
    () => sb.from("notes").select("id, slug, name_pt, name_en, note_accords(accord_key, weight), perfume_notes(perfume_id)").order("name_pt"),
  );
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (data ?? []).filter(
      (n) =>
        (!onlyMissing || !n.note_accords.length) &&
        (!t || n.name_pt.toLowerCase().includes(t) || n.name_en?.toLowerCase().includes(t)),
    );
  }, [data, onlyMissing, q]);
  const missing = (data ?? []).filter((n) => !n.note_accords.length).length;

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
          <button className="btn-ghost" aria-pressed={onlyMissing} onClick={() => setOnlyMissing(!onlyMissing)}>
            Sem classificação ({missing})
          </button>
        </div>
      </header>
      {loading && <p className="admin-muted">Carregando…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!loading && !rows.length && <p className="admin-muted">{onlyMissing ? "Todas as notas estão classificadas." : "Nenhuma nota."}</p>}
      <ul className="admin-list">
        {rows.map((n) => (
          <li key={n.id} className="admin-item admin-item-col">
            <button className="admin-link admin-strong" aria-expanded={open === n.id} onClick={() => setOpen(open === n.id ? null : n.id)}>
              {n.name_pt}
              {n.name_en && <span className="admin-muted"> · {n.name_en}</span>}
              <span className="admin-muted"> · {new Set(n.perfume_notes.map((x) => x.perfume_id)).size} perfume(s)</span>
              {!n.note_accords.length && <span className="admin-tag admin-tag-warn">sem classificação</span>}
            </button>
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
