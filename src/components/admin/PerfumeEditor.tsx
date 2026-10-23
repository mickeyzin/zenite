"use client";

import { useEffect, useId, useState } from "react";
import type { DataStatus, Metric } from "@/data/types";
import { cropToWebp } from "@/lib/image-resize";
import type { TabProps } from "./AdminApp";
import { useLoad } from "./useLoad";

/* ——— Formatos do banco ——— */
interface PerfumeRow {
  id: string;
  slug: string;
  line: string | null;
  name: string;
  full_name: string;
  concentration: string | null;
  concentration_status: DataStatus;
  year: number | null;
  year_status: DataStatus;
  year_note: string | null;
  gender: string | null;
  gender_status: DataStatus;
  gender_note: string | null;
  perfumers: string[] | null;
  perfumers_status: DataStatus;
  perfumers_note: string | null;
  family: string | null;
  family_status: DataStatus;
  family_note: string | null;
  notes_status: DataStatus;
  notes_note: string | null;
  intro: string | null;
  intro_status: DataStatus;
  intro_note: string | null;
  volume_ml: number | null;
  perfume_notes: { tier: "top" | "heart" | "base"; position: number; note: { name_pt: string } | null }[];
  perfume_sources: { id: string; field: string; label: string; url: string }[];
  perfume_images: { id: string; url: string; kind: string; credit: string | null }[];
}

interface ReviewRow {
  status: DataStatus;
  status_note: string | null;
  evolution: { phase: string; text: string }[];
  evolution_note: string | null;
  performance: Metric[];
  seasons: string[];
  occasions: string[];
  pros: string[];
  pros_note: string | null;
  cons: string[];
  cons_note: string | null;
  profile: string | null;
  rating: number | null;
  rating_note: string | null;
}

const PHASES = ["Saída", "Coração", "Fundo"];
const METRICS = [
  { key: "fixacao", label: "Fixação" },
  { key: "projecao", label: "Projeção" },
  { key: "intensidade", label: "Intensidade" },
  { key: "versatilidade", label: "Versatilidade" },
];
const STATUSES: { value: DataStatus; label: string }[] = [
  { value: "verificado", label: "Verificado" },
  { value: "a-confirmar", label: "A confirmar" },
  { value: "provisorio", label: "Provisório" },
];

const list = (s: string, sep: RegExp = /,/) =>
  s
    .split(sep)
    .map((x) => x.trim())
    .filter(Boolean);
const nul = (s: string) => (s.trim() ? s.trim() : null);

export function PerfumeEditor({ sb, refreshSite, id, onClose, focus }: TabProps & { id: string; onClose: () => void; focus?: "poster" }) {
  const { data, error, loading } = useLoad<{ p: PerfumeRow; r: ReviewRow | null }>(
    async () => {
      const [p, r] = await Promise.all([
        sb
          .from("perfumes")
          .select(
            "*, perfume_notes(tier, position, note:notes(name_pt)), perfume_sources(id, field, label, url), perfume_images(id, url, kind, credit)",
          )
          .eq("id", id)
          .single(),
        sb.from("reviews").select("*").eq("perfume_id", id).maybeSingle(),
      ]);
      return { data: p.data ? { p: p.data as PerfumeRow, r: r.data as ReviewRow | null } : null, error: p.error ?? r.error };
    },
    id,
  );

  if (loading) return <p className="admin-muted">Carregando…</p>;
  if (error || !data) return <p className="admin-error">{error ?? "Perfume não encontrado."}</p>;
  return <EditorForm key={id} sb={sb} refreshSite={refreshSite} initial={data} onClose={onClose} focus={focus} />;
}

function EditorForm({
  sb,
  refreshSite,
  initial,
  onClose,
  focus,
}: TabProps & { initial: { p: PerfumeRow; r: ReviewRow | null }; onClose: () => void; focus?: "poster" }) {
  // Atalho "Enviar pôster" da lista: rola direto até a seção.
  useEffect(() => {
    if (focus === "poster") document.getElementById("poster")?.scrollIntoView({ block: "start" });
  }, [focus]);
  const { p, r } = initial;
  const tierText = (t: "top" | "heart" | "base") =>
    p.perfume_notes
      .filter((n) => n.tier === t)
      .sort((a, b) => a.position - b.position)
      .map((n) => n.note?.name_pt)
      .filter(Boolean)
      .join(", ");

  const [f, setF] = useState({
    line: p.line ?? "",
    name: p.name,
    full_name: p.full_name,
    concentration: p.concentration ?? "",
    concentration_status: p.concentration_status,
    year: p.year ? String(p.year) : "",
    year_status: p.year_status,
    year_note: p.year_note ?? "",
    gender: p.gender ?? "",
    gender_status: p.gender_status,
    gender_note: p.gender_note ?? "",
    perfumers: (p.perfumers ?? []).join(", "),
    perfumers_status: p.perfumers_status,
    perfumers_note: p.perfumers_note ?? "",
    family: p.family ?? "",
    family_status: p.family_status,
    family_note: p.family_note ?? "",
    intro: p.intro ?? "",
    intro_status: p.intro_status,
    intro_note: p.intro_note ?? "",
    notes_status: p.notes_status,
    notes_note: p.notes_note ?? "",
    top: tierText("top"),
    heart: tierText("heart"),
    base: tierText("base"),
  });
  const [rv, setRv] = useState({
    status: r?.status ?? ("provisorio" as DataStatus),
    status_note: r?.status_note ?? "",
    evolution: PHASES.map((ph) => r?.evolution.find((e) => e.phase === ph)?.text ?? ""),
    evolution_note: r?.evolution_note ?? "",
    performance: METRICS.map((m) => {
      const v = r?.performance.find((x) => x.key === m.key)?.value;
      return v == null ? "" : String(v);
    }),
    seasons: (r?.seasons ?? []).join(", "),
    occasions: (r?.occasions ?? []).join(", "),
    pros: (r?.pros ?? []).join("\n"),
    pros_note: r?.pros_note ?? "",
    cons: (r?.cons ?? []).join("\n"),
    cons_note: r?.cons_note ?? "",
    profile: r?.profile ?? "",
    rating: r?.rating == null ? "" : String(r.rating),
    rating_note: r?.rating_note ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const field = (k: keyof typeof f) => ({ value: f[k], onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }) });
  const rfield = (k: Exclude<keyof typeof rv, "evolution" | "performance">) => ({
    value: rv[k],
    onChange: (e: { target: { value: string } }) => setRv({ ...rv, [k]: e.target.value }),
  });

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const year = f.year.trim() ? Number(f.year) : null;
    const rating = rv.rating.trim() ? Number(rv.rating.replace(",", ".")) : null;
    const problems = [
      year !== null && !(year >= 1700 && year <= 2100) && "Ano inválido.",
      rating !== null && !(rating >= 0 && rating <= 10) && "Nota editorial deve ficar entre 0 e 10.",
      rv.performance.some((v) => v.trim() && !(Number(v) >= 0 && Number(v) <= 10)) && "Métricas vão de 0 a 10.",
    ].filter(Boolean);
    if (problems.length) {
      setSaving(false);
      return setMsg(problems.join(" "));
    }

    const perfume = {
      line: nul(f.line),
      name: f.name.trim(),
      full_name: f.full_name.trim(),
      concentration: nul(f.concentration),
      concentration_status: f.concentration_status,
      year,
      year_status: f.year_status,
      year_note: nul(f.year_note),
      gender: nul(f.gender),
      gender_status: f.gender_status,
      gender_note: nul(f.gender_note),
      perfumers: list(f.perfumers).length ? list(f.perfumers) : null,
      perfumers_status: f.perfumers_status,
      perfumers_note: nul(f.perfumers_note),
      family: nul(f.family),
      family_status: f.family_status,
      family_note: nul(f.family_note),
      intro: nul(f.intro),
      intro_status: f.intro_status,
      intro_note: nul(f.intro_note),
      notes_status: f.notes_status,
      notes_note: nul(f.notes_note),
    };
    const review = {
      perfume_id: p.id,
      status: rv.status,
      status_note: nul(rv.status_note),
      evolution: PHASES.map((phase, i) => ({ phase, text: rv.evolution[i].trim() })).filter((e) => e.text),
      evolution_note: nul(rv.evolution_note),
      performance: METRICS.map((m, i) => ({ ...m, value: rv.performance[i].trim() ? Number(rv.performance[i]) : null })),
      seasons: list(rv.seasons),
      occasions: list(rv.occasions),
      pros: list(rv.pros, /\n/),
      pros_note: nul(rv.pros_note),
      cons: list(rv.cons, /\n/),
      cons_note: nul(rv.cons_note),
      profile: nul(rv.profile),
      rating,
      rating_note: nul(rv.rating_note),
    };
    const results = await Promise.all([
      sb.from("perfumes").update(perfume).eq("id", p.id),
      sb.rpc("set_perfume_notes", { pid: p.id, top: list(f.top), heart: list(f.heart), base: list(f.base) }),
      sb.from("reviews").upsert(review),
    ]);
    const err = results.find((x) => x.error)?.error;
    setSaving(false);
    if (err) return setMsg(`Erro: ${err.message}`);
    setMsg("Salvo.");
    await refreshSite();
  };

  return (
    <section className="admin-section admin-editor" aria-labelledby="editor-title">
      <header className="admin-section-head">
        <div>
          <button className="admin-link" onClick={onClose}>
            ← Perfumes
          </button>
          <h2 id="editor-title">{p.full_name}</h2>
          <p className="admin-muted">/perfumes/{p.slug}</p>
        </div>
        <div className="admin-actions">
          <button className="btn-primary" disabled={saving} onClick={save}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </header>
      {msg && (
        <p className={msg.startsWith("Erro") || msg.includes("inválid") || msg.includes("entre") ? "admin-error" : "admin-notice"} role="status">
          {msg}
        </p>
      )}

      <fieldset className="admin-fieldset">
        <legend>Dados do perfume (fatos, com fonte)</legend>
        <div className="admin-grid">
          <Text label="Nome" {...field("name")} />
          <Text label="Nome completo (com marca)" {...field("full_name")} />
          <Text label="Linha" {...field("line")} />
          <Sourced label="Concentração" value={field("concentration")} status={field("concentration_status")} />
          <Sourced label="Ano" value={field("year")} status={field("year_status")} note={field("year_note")} inputMode="numeric" />
          <Sourced label="Público" value={field("gender")} status={field("gender_status")} note={field("gender_note")} />
          <Sourced
            label="Perfumistas (separados por vírgula)"
            value={field("perfumers")}
            status={field("perfumers_status")}
            note={field("perfumers_note")}
          />
          <Sourced
            label="Família (ex.: Amadeirado · Aromático)"
            value={field("family")}
            status={field("family_status")}
            note={field("family_note")}
          />
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Pirâmide olfativa (nomes em português, separados por vírgula)</legend>
        <div className="admin-grid">
          <Area label="Saída" rows={2} {...field("top")} />
          <Area label="Coração" rows={2} {...field("heart")} />
          <Area label="Fundo" rows={2} {...field("base")} />
          <Status label="Situação da pirâmide" {...field("notes_status")} />
          <Text label="Observação" {...field("notes_note")} />
        </div>
        <p className="admin-muted">
          Notas que ainda não existem são criadas e aparecem em “Notas” para classificar.
          {p.perfume_sources.length > 0 && (
            <>
              {" "}
              Fontes:{" "}
              {p.perfume_sources.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && ", "}
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.label} ↗
                  </a>
                </span>
              ))}
            </>
          )}
        </p>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Apresentação</legend>
        <Area label="Introdução" rows={3} {...field("intro")} />
        <div className="admin-grid">
          <Status label="Situação" {...field("intro_status")} />
          <Text label="Observação" {...field("intro_note")} />
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Avaliação editorial (opinião da Zênite, separada dos fatos)</legend>
        <div className="admin-grid">
          <Status label="Situação da avaliação" {...rfield("status")} />
          <Text label="Observação sobre o desempenho" {...rfield("status_note")} />
        </div>
        <div className="admin-grid">
          {PHASES.map((ph, i) => (
            <Area
              key={ph}
              label={`Evolução — ${ph}`}
              rows={2}
              value={rv.evolution[i]}
              onChange={(e) => setRv({ ...rv, evolution: rv.evolution.map((x, j) => (j === i ? e.target.value : x)) })}
            />
          ))}
          <Text label="Observação sobre a evolução" {...rfield("evolution_note")} />
        </div>
        <div className="admin-grid admin-grid-4">
          {METRICS.map((m, i) => (
            <Text
              key={m.key}
              label={`${m.label} (0–10)`}
              inputMode="decimal"
              value={rv.performance[i]}
              onChange={(e) => setRv({ ...rv, performance: rv.performance.map((x, j) => (j === i ? e.target.value : x)) })}
            />
          ))}
        </div>
        <div className="admin-grid">
          <Text label="Estações (vírgula)" {...rfield("seasons")} />
          <Text label="Ocasiões (vírgula)" {...rfield("occasions")} />
          <Area label="Pontos positivos (um por linha)" rows={3} {...rfield("pros")} />
          <Area label="Pontos negativos (um por linha)" rows={3} {...rfield("cons")} />
          <Text label="Observação (positivos)" {...rfield("pros_note")} />
          <Text label="Observação (negativos)" {...rfield("cons_note")} />
          <Text label="Perfil recomendado" {...rfield("profile")} />
          <Text label="Nota editorial (0–10, vazio = em avaliação)" inputMode="decimal" {...rfield("rating")} />
          <Text label="Observação da nota" {...rfield("rating_note")} />
        </div>
      </fieldset>

      <PosterUpload sb={sb} refreshSite={refreshSite} perfume={p} />
    </section>
  );
}

/* ——— Pôster ——— */
const POSTER_W = 900;
const POSTER_H = 1100;

function PosterUpload({ sb, refreshSite, perfume }: TabProps & { perfume: PerfumeRow }) {
  const [poster, setPoster] = useState(perfume.perfume_images.find((i) => i.kind === "poster") ?? null);
  const [blob, setBlob] = useState<{ data: Blob; preview: string } | null>(null);
  const [credit, setCredit] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const pick = async (file: File | undefined) => {
    setMsg(null);
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) return setMsg("Imagem acima de 25 MB.");
    try {
      const data = await cropToWebp(file, POSTER_W, POSTER_H);
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
    setMsg(null);
    const path = `${perfume.slug}/poster-${Date.now()}.webp`;
    const up = await sb.storage.from("perfumes").upload(path, blob.data, { contentType: "image/webp", upsert: false });
    if (up.error) {
      setBusy(false);
      return setMsg(`Erro no envio: ${up.error.message}`);
    }
    const url = sb.storage.from("perfumes").getPublicUrl(path).data.publicUrl;
    await sb.from("perfume_images").delete().eq("perfume_id", perfume.id).eq("kind", "poster");
    const ins = await sb
      .from("perfume_images")
      .insert({ perfume_id: perfume.id, url, kind: "poster", credit: credit.trim() })
      .select("id, url, kind, credit")
      .single();
    setBusy(false);
    if (ins.error) return setMsg(`Erro: ${ins.error.message}`);
    setPoster(ins.data);
    URL.revokeObjectURL(blob.preview);
    setBlob(null);
    setMsg("Pôster atualizado.");
    await refreshSite();
  };

  const remove = async () => {
    if (!poster || !confirm("Remover o pôster? O site volta a mostrar a arte automática.")) return;
    setBusy(true);
    const { error } = await sb.from("perfume_images").delete().eq("id", poster.id);
    setBusy(false);
    if (error) return setMsg(`Erro: ${error.message}`);
    setPoster(null);
    setMsg("Pôster removido.");
    await refreshSite();
  };

  return (
    <fieldset className="admin-fieldset" id="poster">
      <legend>Pôster</legend>
      <div className="admin-poster">
        <figure>
          {blob ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={blob.preview} alt="Pré-visualização do novo pôster" width={135} height={165} />
          ) : poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster.url} alt="Pôster atual" width={135} height={165} />
          ) : (
            <span className="poster-empty admin-poster-empty" aria-hidden>
              ✦
            </span>
          )}
          <figcaption className="admin-muted">{blob ? "Novo (não enviado)" : poster ? "Atual" : "Sem pôster: o site usa a arte automática"}</figcaption>
        </figure>
        <div className="admin-grid">
          <label className="admin-field">
            Escolher imagem (JPG, PNG, WebP ou foto do celular). Ela é recortada no centro em formato vertical e reduzida
            automaticamente.
            <input type="file" accept="image/jpeg,image/png,image/webp,image/heic" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          <Text
            label="Crédito / licença (obrigatório)"
            placeholder="Ex.: Foto Zênite · Imagem cedida pela marca"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />
          {poster?.credit && <p className="admin-muted">Crédito atual: {poster.credit}</p>}
          <div className="admin-actions">
            <button className="btn-ghost" disabled={!blob || busy} onClick={upload}>
              {busy ? "Enviando…" : "Enviar pôster"}
            </button>
            {poster && (
              <button className="admin-link" disabled={busy} onClick={remove}>
                Remover pôster
              </button>
            )}
          </div>
        </div>
      </div>
      {msg && <p className={msg.startsWith("Pôster") ? "admin-notice" : "admin-error"}>{msg}</p>}
      <p className="admin-muted">Use só imagens próprias ou com autorização. Fotos de lojas e da marca têm direitos autorais.</p>
    </fieldset>
  );
}

/* ——— Campos ——— */
type InputProps = {
  label: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  inputMode?: "numeric" | "decimal";
  placeholder?: string;
};

// Rótulo ligado por id (e não envolvendo o campo), para o nome acessível
// não incluir o texto digitado.
function Text({ label, ...rest }: InputProps) {
  const id = useId();
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" {...rest} />
    </div>
  );
}

function Area({ label, rows, ...rest }: InputProps & { rows: number }) {
  const id = useId();
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} rows={rows} {...rest} />
    </div>
  );
}

function Status({ label, value, onChange }: Omit<InputProps, "inputMode">) {
  const id = useId();
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={onChange}>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type Bound = Pick<InputProps, "value" | "onChange">;
function Sourced({ label, value, status, note, inputMode }: { label: string; value: Bound; status: Bound; note?: Bound; inputMode?: "numeric" }) {
  return (
    <div className="admin-sourced">
      <Text label={label} inputMode={inputMode} {...value} />
      <Status label="Situação" {...status} />
      {note && <Text label="Observação" {...note} />}
    </div>
  );
}
