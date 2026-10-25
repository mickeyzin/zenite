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
  const [brand, setBrand] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMsg, setBulkMsg] = useState<string | null>(null);
  const { data, error, loading, reload } = useLoad<PerfumeListRow[]>(() =>
    sb
      .from("perfumes")
      .select(
        "id, slug, name, full_name, status, featured, updated_at, brand:brands(name), perfume_images(id), perfume_notes(note_id)",
      )
      .order("updated_at", { ascending: false }),
  );

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (data ?? []).filter(
      (p) =>
        (filter === "todos" || p.status === filter) &&
        (!brand || p.brand?.name === brand) &&
        (!t || p.full_name.toLowerCase().includes(t)),
    );
  }, [data, filter, q, brand]);
  const brands = useMemo(() => [...new Set((data ?? []).map((p) => p.brand?.name).filter(Boolean) as string[])].sort(), [data]);
  const picked = rows.filter((p) => selected.has(p.id));
  const publishable = picked.filter((p) => p.status !== "publicado" && p.perfume_notes.length);
  const allShown = rows.length > 0 && rows.every((p) => selected.has(p.id));
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  /** Publica ou despublica vários de uma vez (em lotes, para não estourar o tamanho da requisição). */
  const bulk = async (status: "publicado" | "rascunho") => {
    const targets = status === "publicado" ? publishable : picked.filter((p) => p.status === "publicado");
    if (!targets.length) return;
    const verb = status === "publicado" ? "Publicar" : "Despublicar";
    if (!confirm(`${verb} ${targets.length} perfume(s)?`)) return;
    setBusy("bulk");
    setBulkMsg(null);
    let done = 0;
    for (let i = 0; i < targets.length; i += 100) {
      const ids = targets.slice(i, i + 100).map((p) => p.id);
      const { error } = await sb.from("perfumes").update({ status }).in("id", ids);
      if (error) {
        setBulkMsg(`Erro depois de ${done}: ${error.message}`);
        break;
      }
      done += ids.length;
    }
    const skipped = status === "publicado" ? picked.filter((p) => p.status !== "publicado" && !p.perfume_notes.length).length : 0;
    setBulkMsg(
      (m) =>
        m ??
        `${done} perfume(s) ${status === "publicado" ? "publicados" : "despublicados"}.${skipped ? ` ${skipped} sem notas ficaram de fora.` : ""}`,
    );
    setBusy(null);
    setSelected(new Set());
    reload();
    await refreshSite();
  };

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
            Publicar coloca o perfume no catálogo. “Destaque” inclui na apresentação 3D da home — só funciona para perfumes com
            modelo 3D e pôster.
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
            <button
              key={s}
              className="btn-ghost"
              aria-pressed={filter === s}
              onClick={() => {
                setFilter(s);
                setSelected(new Set());
              }}
            >
              {s === "todos" ? "Todos" : STATUS_LABEL[s]}
            </button>
          ))}
          {brands.length > 1 && (
            <select
              aria-label="Filtrar por marca"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setSelected(new Set());
              }}
            >
              <option value="">Todas as marcas</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b} ({(data ?? []).filter((p) => p.brand?.name === b).length})
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      <div className="admin-actions">
        <button
          className="btn-ghost"
          disabled={!rows.length}
          onClick={() => setSelected(allShown ? new Set() : new Set(rows.map((p) => p.id)))}
        >
          {allShown ? "Desmarcar todos" : `Marcar todos da lista (${rows.length})`}
        </button>
        <button className="btn-primary" disabled={busy === "bulk" || !publishable.length} onClick={() => bulk("publicado")}>
          Publicar selecionados ({publishable.length})
        </button>
        <button
          className="btn-ghost"
          disabled={busy === "bulk" || !picked.some((p) => p.status === "publicado")}
          onClick={() => bulk("rascunho")}
        >
          Despublicar selecionados
        </button>
      </div>
      {bulkMsg && (
        <p className="admin-notice" role="status">
          {bulkMsg}
        </p>
      )}

      {loading && <p className="admin-muted">Carregando…</p>}
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  aria-label="Marcar todos da lista"
                  checked={allShown}
                  onChange={() => setSelected(allShown ? new Set() : new Set(rows.map((p) => p.id)))}
                />
              </th>
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
                  <input
                    type="checkbox"
                    aria-label={`Selecionar ${p.full_name}`}
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                  />
                </td>
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
