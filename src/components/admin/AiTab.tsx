"use client";

import { useMemo, useRef, useState } from "react";
import { AI_LICENSE } from "@/lib/ai-label";
import type { TabProps } from "./AdminApp";
import { describe, fileToDataUrl, generate, saveAiPoster } from "./AiPoster";
import { useLoad } from "./useLoad";

interface Row {
  id: string;
  slug: string;
  name: string;
  full_name: string;
  status: string;
  brand: { name: string } | null;
  perfume_images: { id: string; url: string; kind: string; license: string | null }[];
}
type RowState = { state: "fila" | "gerando" | "ok" | "pulado" | "erro"; msg?: string; url?: string };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const posterOf = (p: Row) => p.perfume_images.find((i) => i.kind === "poster");
const kindOf = (p: Row) => {
  const poster = posterOf(p);
  return !poster ? "sem" : poster.license === AI_LICENSE ? "ia" : "real";
};

/**
 * Ilustrações IA por marca: todos os perfumes cadastrados de uma marca, com referências opcionais
 * (uma por perfume, ou várias de uma vez casadas pelo nome do arquivo) e geração em lote.
 */
export function AiTab({ sb, refreshSite }: TabProps) {
  const { data, error, loading, reload } = useLoad<Row[]>(() =>
    sb.from("perfumes").select("id, slug, name, full_name, status, brand:brands(name), perfume_images(id, url, kind, license)").order("name"),
  );
  const [brand, setBrand] = useState("");
  const [refs, setRefs] = useState<Record<string, { data: string; file: string }>>({});
  const [states, setStates] = useState<Record<string, RowState>>({});
  const [redo, setRedo] = useState(false);
  const [fromMemory, setFromMemory] = useState(false);
  const [running, setRunning] = useState(false);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const stop = useRef(false);

  const brands = useMemo(() => {
    const count = new Map<string, number>();
    for (const p of data ?? []) if (p.brand?.name) count.set(p.brand.name, (count.get(p.brand.name) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [data]);
  const rows = useMemo(() => (data ?? []).filter((p) => p.brand?.name === brand), [data, brand]);

  // Quem entra no lote: sem foto real; com ilustração IA só se "refazer"; sem referência só se "de memória"
  // (a referência automática do site oficial é tentada na hora).
  const targets = rows.filter((p) => kindOf(p) === "sem" || (redo && kindOf(p) === "ia"));
  const counts = { sem: rows.filter((p) => kindOf(p) === "sem").length, ia: rows.filter((p) => kindOf(p) === "ia").length, real: rows.filter((p) => kindOf(p) === "real").length };

  const setState = (id: string, s: RowState) => setStates((cur) => ({ ...cur, [id]: s }));

  /** Várias fotos de referência: cada arquivo vai para o perfume cujo nome aparece no nome do arquivo. */
  const bulkRefs = async (files: FileList | null) => {
    if (!files?.length) return;
    const pool = [...rows].sort((a, b) => b.name.length - a.name.length); // nomes longos primeiro ("Yara Tous" antes de "Yara")
    const next = { ...refs };
    const miss: string[] = [];
    for (const f of [...files]) {
      const fname = norm(f.name.replace(/\.[a-z0-9]+$/i, ""));
      const hit =
        pool.find((p) => norm(p.name) === fname || norm(p.full_name) === fname) ??
        pool.find((p) => norm(p.name).length >= 3 && ` ${fname} `.includes(` ${norm(p.name)} `));
      if (!hit) {
        miss.push(f.name);
        continue;
      }
      next[hit.id] = { data: await fileToDataUrl(f), file: f.name };
    }
    setRefs(next);
    setUnmatched(miss);
  };

  const one = async (p: Row) => {
    setState(p.id, { state: "gerando", msg: "descrevendo o frasco…" });
    try {
      const d = await describe(sb, p.id, refs[p.id]?.data ?? null);
      if (!d.description && !fromMemory) {
        setState(p.id, { state: "pulado", msg: "sem foto de referência" });
        return false;
      }
      setState(p.id, { state: "gerando", msg: "gerando a imagem (cerca de 1 min)…" });
      const g = await generate(sb, p.id, d.description);
      const url = await saveAiPoster(sb, p, g.image);
      setState(p.id, { state: "ok", msg: d.description ? undefined : "de memória — confira", url });
      return true;
    } catch (e) {
      setState(p.id, { state: "erro", msg: (e as Error).message });
      return false;
    }
  };

  const runBatch = async (list: Row[]) => {
    if (!list.length) return;
    if (list.length > 1 && !confirm(`Gerar ${list.length} ilustração(ões)? Leva cerca de 1 minuto cada e usa créditos da OpenAI.`)) return;
    stop.current = false;
    setRunning(true);
    setStates((cur) => ({ ...cur, ...Object.fromEntries(list.map((p) => [p.id, { state: "fila" } as RowState])) }));
    let ok = 0;
    for (const p of list) {
      if (stop.current) {
        setState(p.id, { state: "pulado", msg: "interrompido" });
        continue;
      }
      if (await one(p)) ok++;
    }
    setRunning(false);
    reload();
    if (ok) await refreshSite();
  };

  const done = Object.values(states).filter((s) => s.state === "ok").length;
  const queued = Object.values(states).filter((s) => s.state === "fila" || s.state === "gerando").length;

  return (
    <section className="admin-section" aria-labelledby="ai-title">
      <header className="admin-section-head">
        <div>
          <h2 id="ai-title">Ilustrações IA</h2>
          <p className="admin-muted">
            Escolha a marca: aparecem todos os perfumes cadastrados dela. A IA usa a foto de referência que você enviar ou, se não houver,
            a do site oficial (Afnan, Swiss Arabian e Khadlaj; a Lattafa bloqueia robôs, então para ela envie as referências). As
            referências não são guardadas nem publicadas. No site, as imagens saem com o selo “Ilustração IA”. Perfumes com foto real
            nunca são alterados.
          </p>
        </div>
        <label className="admin-field admin-select-wide">
          Marca
          <select
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setStates({});
              setUnmatched([]);
            }}
          >
            <option value="">Escolha uma marca…</option>
            {brands.map(([b, n]) => (
              <option key={b} value={b}>
                {b} ({n})
              </option>
            ))}
          </select>
        </label>
      </header>

      {loading && <p className="admin-muted">Carregando…</p>}
      {error && <p className="admin-error">{error}</p>}

      {brand && (
        <>
          <p className="admin-muted">
            {rows.length} perfume(s): {counts.sem} sem imagem · {counts.ia} com ilustração IA · {counts.real} com foto real ·{" "}
            {Object.keys(refs).filter((id) => rows.some((p) => p.id === id)).length} com referência enviada
          </p>

          <div className="admin-fieldset">
            <label className="admin-field">
              Enviar várias referências de uma vez (o nome de cada arquivo deve conter o nome do perfume, ex.: “Oud Lail Maleki.jpg”)
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => bulkRefs(e.target.files)} />
            </label>
            {unmatched.length > 0 && (
              <p className="admin-error">Sem perfume correspondente: {unmatched.join(", ")}. Renomeie o arquivo ou envie direto na linha do perfume.</p>
            )}
          </div>

          <div className="admin-actions">
            <button className="btn-primary" disabled={running || !targets.length} onClick={() => runBatch(targets)}>
              {running ? `Gerando… (${done} prontas, ${queued} na fila)` : `Gerar para todos desta marca (${targets.length})`}
            </button>
            {running && (
              <button className="btn-ghost" onClick={() => (stop.current = true)}>
                Parar depois do atual
              </button>
            )}
            <label className="admin-check">
              <input type="checkbox" checked={redo} disabled={running} onChange={(e) => setRedo(e.target.checked)} /> refazer os que já têm
              ilustração IA
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={fromMemory} disabled={running} onChange={(e) => setFromMemory(e.target.checked)} /> sem
              referência, gerar de memória (menos fiel)
            </label>
          </div>

          <ul className="admin-ai-list">
            {rows.map((p) => {
              const k = kindOf(p);
              const st = states[p.id];
              const ref = refs[p.id];
              const thumb = st?.url ?? posterOf(p)?.url;
              return (
                <li key={p.id} className={`admin-ai-row is-${st?.state ?? "idle"}`}>
                  <div className="admin-ai-thumbs">
                    {ref ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ref.data} alt="" title={`Referência: ${ref.file}`} />
                    ) : (
                      <span className="admin-ai-empty">sem ref.</span>
                    )}
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" />
                    ) : (
                      <span className="admin-ai-empty">—</span>
                    )}
                  </div>
                  <div className="admin-ai-info">
                    <strong>{p.name}</strong>
                    <span className="admin-muted">
                      {k === "real" ? "foto real (não muda)" : k === "ia" ? "ilustração IA" : "sem imagem"}
                      {p.status !== "publicado" ? ` · ${p.status}` : ""}
                    </span>
                    {st && (
                      <span className={st.state === "erro" ? "admin-error" : "admin-muted"}>
                        {{ fila: "na fila", gerando: "gerando", ok: "✔ pronta", pulado: "— pulado", erro: "✘ erro" }[st.state]}
                        {st.msg ? `: ${st.msg}` : ""}
                      </span>
                    )}
                  </div>
                  <div className="admin-ai-actions">
                    <label className="admin-link">
                      {ref ? "Trocar referência" : "Enviar referência"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const d = await fileToDataUrl(f);
                          setRefs((cur) => ({ ...cur, [p.id]: { data: d, file: f.name } }));
                        }}
                      />
                    </label>
                    {k !== "real" && (
                      <button className="admin-link" disabled={running} onClick={() => runBatch([p])}>
                        {k === "ia" ? "Gerar de novo" : "Gerar só este"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
