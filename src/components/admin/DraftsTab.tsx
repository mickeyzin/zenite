"use client";

import { useState } from "react";
import type { TabProps } from "./AdminApp";
import { useLoad } from "./useLoad";

interface Draft {
  id: string;
  url: string;
  brand_slug: string;
  status: "pendente" | "aprovado" | "rejeitado";
  fetched_at: string | null;
  payload: {
    name?: string;
    size?: string | null;
    gender?: string | null;
    notes?: { top: string[]; heart: string[]; base: string[] } | null;
    unknownNotes?: string[];
    review?: string;
  };
  perfume: { slug: string; status: string } | null;
}

const FILTERS = [
  { key: "pendente", label: "Pendentes" },
  { key: "aprovado", label: "Aprovados" },
  { key: "rejeitado", label: "Rejeitados" },
] as const;

/**
 * Fila de revisão dos dados importados dos sites oficiais. Aprovar cria o
 * perfume como rascunho (não publicado); a publicação é um passo separado.
 */
export function DraftsTab({ sb }: TabProps) {
  const [filter, setFilter] = useState<Draft["status"]>("pendente");
  const [brand, setBrand] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const { data, error, loading, reload } = useLoad<Draft[]>(
    () =>
      sb
        .from("import_drafts")
        .select("id, url, brand_slug, status, fetched_at, payload, perfume:perfumes(slug, status)")
        .eq("status", filter)
        .order("brand_slug")
        .order("url"),
    filter,
  );
  const all = data ?? [];
  const brands = [...new Set(all.map((d) => d.brand_slug))];
  const drafts = brand ? all.filter((d) => d.brand_slug === brand) : all;
  const ready = drafts.filter((d) => d.payload.review === "ok");

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const approve = async (ids: string[]) => {
    setBusy(true);
    const out: string[] = [];
    for (const id of ids) {
      const d = drafts.find((x) => x.id === id);
      const { error } = await sb.rpc("approve_draft", { draft: id });
      out.push(error ? `✘ ${d?.payload.name}: ${error.message}` : `✔ ${d?.payload.name}`);
    }
    setLog(out);
    setSelected(new Set());
    setBusy(false);
    reload();
  };

  const reject = async (ids: string[]) => {
    setBusy(true);
    const { data: u } = await sb.auth.getUser();
    await sb
      .from("import_drafts")
      .update({ status: "rejeitado", reviewed_by: u.user?.id, reviewed_at: new Date().toISOString() })
      .in("id", ids);
    setSelected(new Set());
    setBusy(false);
    reload();
  };

  return (
    <section className="admin-section" aria-labelledby="drafts-title">
      <header className="admin-section-head">
        <div>
          <h2 id="drafts-title">Importados dos sites oficiais</h2>
          <p className="admin-muted">
            Confira nome, volume e pirâmide com a página de origem antes de aprovar. Aprovar cria o perfume como
            rascunho — ele só aparece no site depois de publicado em “Perfumes”.
          </p>
        </div>
        <div className="admin-filters" role="group" aria-label="Situação">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className="btn-ghost"
              aria-pressed={filter === f.key}
              onClick={() => {
                setFilter(f.key);
                setSelected(new Set());
              }}
            >
              {f.label}
            </button>
          ))}
          {brands.length > 1 && (
            <select
              className="admin-select"
              aria-label="Filtrar por marca"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setSelected(new Set());
              }}
            >
              <option value="">Todas as marcas ({all.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b} ({all.filter((d) => d.brand_slug === b).length})
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {filter === "pendente" && drafts.length > 0 && (
        <div className="admin-actions">
          <button className="btn-ghost" onClick={() => setSelected(new Set(ready.map((d) => d.id)))}>
            Selecionar completos ({ready.length})
          </button>
          <button className="btn-primary" disabled={busy || !selected.size} onClick={() => approve([...selected])}>
            Aprovar selecionados ({selected.size})
          </button>
          <button className="btn-ghost" disabled={busy || !selected.size} onClick={() => reject([...selected])}>
            Rejeitar selecionados
          </button>
        </div>
      )}
      {log.length > 0 && (
        <details className="admin-log" open>
          <summary>Resultado ({log.length})</summary>
          <ul>
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </details>
      )}

      {loading && <p className="admin-muted">Carregando…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!loading && !drafts.length && <p className="admin-muted">Nada aqui.</p>}

      <ul className="admin-list">
        {drafts.map((d) => (
          <li key={d.id} className="admin-item">
            {filter === "pendente" && (
              <input
                type="checkbox"
                aria-label={`Selecionar ${d.payload.name ?? d.url}`}
                checked={selected.has(d.id)}
                onChange={() => toggle(d.id)}
              />
            )}
            <div className="admin-item-body">
              <p className="admin-item-title">
                <strong>{d.payload.name ?? "Sem nome"}</strong>
                <span className="admin-muted">
                  {" "}
                  · {d.brand_slug}
                  {d.payload.size ? ` · ${d.payload.size}` : ""}
                  {d.payload.gender ? ` · ${d.payload.gender}` : ""}
                </span>
                {d.payload.review !== "ok" && <span className="admin-tag admin-tag-warn">{d.payload.review}</span>}
              </p>
              {d.payload.notes ? (
                <dl className="admin-notes">
                  <dt>Saída</dt>
                  <dd>{d.payload.notes.top.join(", ") || "—"}</dd>
                  <dt>Coração</dt>
                  <dd>{d.payload.notes.heart.join(", ") || "—"}</dd>
                  <dt>Fundo</dt>
                  <dd>{d.payload.notes.base.join(", ") || "—"}</dd>
                </dl>
              ) : (
                <p className="admin-muted">Sem pirâmide na página.</p>
              )}
              {!!d.payload.unknownNotes?.length && (
                <p className="admin-muted">Sem tradução: {d.payload.unknownNotes.join(", ")}</p>
              )}
              <p className="admin-item-links">
                <a href={d.url} target="_blank" rel="noreferrer">
                  Página de origem ↗
                </a>
                {d.perfume && <span className="admin-muted"> · perfume: {d.perfume.slug} ({d.perfume.status})</span>}
              </p>
            </div>
            {filter === "pendente" && (
              <div className="admin-item-actions">
                <button className="btn-ghost" disabled={busy || !d.payload.name} onClick={() => approve([d.id])}>
                  Aprovar
                </button>
                <button className="admin-link" disabled={busy} onClick={() => reject([d.id])}>
                  Rejeitar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
