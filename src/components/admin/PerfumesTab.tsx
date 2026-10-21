"use client";

import { useMemo, useState } from "react";
import type { TabProps } from "./AdminApp";
import { PerfumeEditor } from "./PerfumeEditor";
import { useLoad } from "./useLoad";

export interface PerfumeListRow {
  id: string;
  slug: string;
  name: string;
  full_name: string;
  status: "rascunho" | "publicado" | "arquivado";
  featured: boolean;
  updated_at: string;
  brand: { name: string } | null;
  perfume_images: { id: string }[];
  perfume_notes: { note_id: string }[];
}

const STATUS_LABEL = { rascunho: "Rascunho", publicado: "Publicado", arquivado: "Arquivado" } as const;

export function PerfumesTab({ sb, refreshSite }: TabProps) {
  const [filter, setFilter] = useState<PerfumeListRow["status"] | "todos">("todos");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<{ id: string; focus?: "poster" } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const { data, error, loading, reload } = useLoad<PerfumeListRow[]>(
    () =>
      sb
        .from("perfumes")
        .select("id, slug, name, full_name, status, featured, updated_at, brand:brands(name), perfume_images(id), perfume_notes(note_id)")
        .order("updated_at", { ascending: false }),
  );

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (data ?? []).filter((p) => (filter === "todos" || p.status === filter) && (!t || p.full_name.toLowerCase().includes(t)));
  }, [data, filter, q]);

  const set = async (p: PerfumeListRow, patch: Partial<Pick<PerfumeListRow, "status" | "featured">>) => {
    setBusy(p.id);
    const { error } = await sb.from("perfumes").update(patch).eq("id", p.id);
    setBusy(null);
    if (error) return alert(error.message);
    reload();
    // Só o que é (ou era) público muda o site.
    if (p.status === "publicado" || patch.status === "publicado") await refreshSite();
  };

  if (editing)
    return (
      <PerfumeEditor
        sb={sb}
        refreshSite={refreshSite}
        id={editing.id}
        focus={editing.focus}
        onClose={() => {
          setEditing(null);
          reload();
        }}
      />
    );

  return (
    <section className="admin-section" aria-labelledby="perfumes-title">
      <header className="admin-section-head">
        <div>
          <h2 id="perfumes-title">Perfumes</h2>
          <p className="admin-muted">
            Publicar coloca o perfume no catálogo. “Destaque” inclui na apresentação 3D da home — só funciona para perfumes
            com modelo 3D e pôster.
          </p>
        </div>
        <div className="admin-filters">
          <input
            type="search"
            className="admin-search"
            placeholder="Buscar…"
            aria-label="Buscar perfume"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {(["todos", "rascunho", "publicado", "arquivado"] as const).map((s) => (
            <button key={s} className="btn-ghost" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s === "todos" ? "Todos" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </header>

      {loading && <p className="admin-muted">Carregando…</p>}
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Perfume</th>
              <th scope="col">Situação</th>
              <th scope="col">Notas</th>
              <th scope="col">Pôster</th>
              <th scope="col">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <button className="admin-link admin-strong" onClick={() => setEditing({ id: p.id })}>
                    {p.full_name}
                  </button>
                  {p.featured && <span className="admin-tag">destaque</span>}
                </td>
                <td>
                  <span className={`admin-tag admin-tag-${p.status}`}>{STATUS_LABEL[p.status]}</span>
                </td>
                <td>{p.perfume_notes.length || <span className="admin-tag admin-tag-warn">sem notas</span>}</td>
                <td>
                  <button className="admin-link" onClick={() => setEditing({ id: p.id, focus: "poster" })}>
                    {p.perfume_images.length ? "Trocar" : "Enviar pôster"}
                  </button>
                </td>
                <td className="admin-row-actions">
                  {p.status !== "publicado" ? (
                    <button
                      className="btn-ghost"
                      disabled={busy === p.id || !p.perfume_notes.length}
                      title={!p.perfume_notes.length ? "Cadastre a pirâmide antes de publicar" : undefined}
                      onClick={() => set(p, { status: "publicado" })}
                    >
                      Publicar
                    </button>
                  ) : (
                    <button className="btn-ghost" disabled={busy === p.id} onClick={() => set(p, { status: "rascunho" })}>
                      Despublicar
                    </button>
                  )}
                  <button
                    className="admin-link"
                    disabled={busy === p.id}
                    aria-pressed={p.featured}
                    onClick={() => set(p, { featured: !p.featured })}
                  >
                    {p.featured ? "Tirar destaque" : "Destacar"}
                  </button>
                  {p.status === "publicado" && (
                    <a className="admin-link" href={`/perfumes/${p.slug}`} target="_blank" rel="noreferrer">
                      Ver ↗
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && !rows.length && <p className="admin-muted">Nenhum perfume.</p>}
    </section>
  );
}
