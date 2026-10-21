"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Perfume } from "@/data/types";
import { accordProfile, ACCORDS, allNotes, familyTags, normalize, topAccords, type AccordKey } from "@/lib/olfactory";

/**
 * Catálogo com busca, filtros e ordenação. O estado vive na URL (?q=&familia=…),
 * então um filtro pode ser compartilhado. Funciona igual na prévia estática.
 *
 * Filtros de intensidade e faixa de preço ficam desativados até existirem
 * avaliações editoriais e ofertas verificadas (não filtramos por dado provisório).
 */
type FilterKey = "familia" | "marca" | "concentracao" | "publico" | "estacao" | "ocasiao" | "perfil";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "familia", label: "Família" },
  { key: "perfil", label: "Perfil predominante" },
  { key: "marca", label: "Marca" },
  { key: "concentracao", label: "Concentração" },
  { key: "publico", label: "Público" },
  { key: "estacao", label: "Estação" },
  { key: "ocasiao", label: "Ocasião" },
];

const SORTS = [
  { key: "nome", label: "Nome (A–Z)" },
  { key: "marca", label: "Marca (A–Z)" },
  { key: "perfil", label: "Mais intenso no perfil escolhido" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];

interface Item {
  p: Perfume;
  text: string;
  facets: Record<FilterKey, string[]>;
  accords: ReturnType<typeof topAccords>;
  profile: Record<AccordKey, number>;
}

function index(perfumes: Perfume[]): Item[] {
  return perfumes.map((p) => {
    const { profile } = accordProfile(p);
    const accords = topAccords(profile, 3);
    return {
      p,
      profile,
      accords,
      text: normalize([p.fullName, p.brand, p.family.value, ...allNotes(p), ...accords.map((a) => a.label)].join(" ")),
      facets: {
        familia: familyTags(p),
        perfil: accords.map((a) => a.label),
        marca: [p.brand],
        concentracao: [p.concentration.value],
        publico: [p.gender.value],
        estacao: p.seasons.value,
        ocasiao: p.occasions.value,
      },
    };
  });
}

interface State {
  q: string;
  sort: SortKey;
  f: Partial<Record<FilterKey, string>>;
}

function readUrl(): State {
  if (typeof window === "undefined") return { q: "", sort: "nome", f: {} };
  const src = window.location.search || (window.location.hash.includes("=") ? "?" + window.location.hash.slice(1) : "");
  const u = new URLSearchParams(src);
  const f: State["f"] = {};
  FILTERS.forEach(({ key }) => {
    const v = u.get(key);
    if (v) f[key] = v;
  });
  const sort = (SORTS.find((s) => s.key === u.get("ordem"))?.key ?? "nome") as SortKey;
  return { q: u.get("q") ?? "", sort, f };
}

export function CatalogView({ perfumes }: { perfumes: Perfume[] }) {
  const items = useMemo(() => index(perfumes), [perfumes]);
  const [st, setSt] = useState<State>({ q: "", sort: "nome", f: {} });

  // Lê a URL no cliente (evita divergência com o HTML do servidor).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSt(readUrl());
  }, []);

  // Grava a URL (sem recarregar).
  useEffect(() => {
    const u = new URLSearchParams();
    if (st.q) u.set("q", st.q);
    Object.entries(st.f).forEach(([k, v]) => v && u.set(k, v));
    if (st.sort !== "nome") u.set("ordem", st.sort);
    const qs = u.toString();
    const url = window.location.pathname + (qs ? `?${qs}` : "");
    if (url !== window.location.pathname + window.location.search) window.history.replaceState(null, "", url);
  }, [st]);

  const options = useMemo(() => {
    const o: Record<FilterKey, string[]> = { familia: [], perfil: [], marca: [], concentracao: [], publico: [], estacao: [], ocasiao: [] };
    items.forEach((it) => FILTERS.forEach(({ key }) => it.facets[key].forEach((v) => !o[key].includes(v) && o[key].push(v))));
    FILTERS.forEach(({ key }) => o[key].sort((a, b) => a.localeCompare(b, "pt-BR")));
    return o;
  }, [items]);

  const results = useMemo(() => {
    const words = normalize(st.q).split(/\s+/).filter(Boolean);
    const out = items.filter(
      (it) =>
        words.every((w) => it.text.includes(w)) &&
        (Object.entries(st.f) as [FilterKey, string][]).every(([k, v]) => !v || it.facets[k].includes(v)),
    );
    const accordKey = ACCORDS.find((a) => a.label === st.f.perfil)?.key;
    out.sort((a, b) => {
      if (st.sort === "marca") return a.p.brand.localeCompare(b.p.brand, "pt-BR") || a.p.name.localeCompare(b.p.name, "pt-BR");
      if (st.sort === "perfil" && accordKey) return b.profile[accordKey] - a.profile[accordKey];
      return a.p.fullName.localeCompare(b.p.fullName, "pt-BR");
    });
    return out;
  }, [items, st]);

  const setFilter = (k: FilterKey, v: string) => setSt((s) => ({ ...s, f: { ...s.f, [k]: v || undefined } }));
  const active = Object.values(st.f).filter(Boolean).length + (st.q ? 1 : 0);

  return (
    <div className="catalog">
      <form className="catalog-controls" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="catalog-search">
          <label htmlFor="cat-q">Buscar</label>
          <input
            id="cat-q"
            type="search"
            placeholder="Nome, marca, nota ou família — ex.: vetiver, baunilha"
            value={st.q}
            onChange={(e) => setSt((s) => ({ ...s, q: e.target.value }))}
            autoComplete="off"
          />
        </div>
        <div className="catalog-filters">
          {FILTERS.map(({ key, label }) => (
            <div key={key} className="catalog-field">
              <label htmlFor={`cat-${key}`}>{label}</label>
              <select id={`cat-${key}`} value={st.f[key] ?? ""} onChange={(e) => setFilter(key, e.target.value)}>
                <option value="">Todos</option>
                {options[key].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="catalog-field is-disabled" title="Disponível quando houver avaliação editorial">
            <label htmlFor="cat-int">Intensidade</label>
            <select id="cat-int" disabled>
              <option>Em avaliação</option>
            </select>
          </div>
          <div className="catalog-field is-disabled" title="Disponível quando houver ofertas verificadas">
            <label htmlFor="cat-preco">Faixa de preço</label>
            <select id="cat-preco" disabled>
              <option>Sem ofertas ainda</option>
            </select>
          </div>
        </div>
        <div className="catalog-bar">
          <p aria-live="polite">
            {results.length} {results.length === 1 ? "perfume" : "perfumes"}
            {active > 0 && (
              <button type="button" className="catalog-clear" onClick={() => setSt({ q: "", sort: st.sort, f: {} })}>
                Limpar filtros
              </button>
            )}
          </p>
          <div className="catalog-field catalog-sort">
            <label htmlFor="cat-ordem">Ordenar por</label>
            <select id="cat-ordem" value={st.sort} onChange={(e) => setSt((s) => ({ ...s, sort: e.target.value as SortKey }))}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} disabled={s.key === "perfil" && !st.f.perfil}>
                  {s.label}
                  {s.key === "perfil" && !st.f.perfil ? " (escolha um perfil)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {results.length === 0 ? (
        <div className="catalog-empty">
          <p>Nenhum perfume com essa combinação.</p>
          <button type="button" className="btn-ghost" onClick={() => setSt({ q: "", sort: "nome", f: {} })}>
            Limpar busca e filtros
          </button>
        </div>
      ) : (
        <ul className="catalog-grid">
          {results.map(({ p, accords }, i) => (
            <li key={p.slug} className="perfume-card">
              <Link href={`/perfumes/${p.slug}`} className="perfume-card-link" aria-label={`Ver resenha do ${p.fullName}`}>
                <div className="perfume-card-img">
                  {p.poster ? (
                    <Image src={p.poster} alt="" width={450} height={550} loading={i < 4 ? "eager" : "lazy"} />
                  ) : (
                    <span className="poster-empty" aria-hidden>
                      ✦
                    </span>
                  )}
                </div>
              </Link>
              <div className="perfume-card-body">
                <p className="perfume-card-brand">{p.brand}</p>
                <h2 className="perfume-card-name">{p.name}</h2>
                <p className="perfume-card-family">{p.family.value}</p>
                <ul className="chips" aria-label="Perfil olfativo estimado">
                  {accords.map((a) => (
                    <li key={a.key}>{a.label}</li>
                  ))}
                </ul>
                <p className="perfume-card-rating">{p.verdict.rating.value === null ? "Avaliação editorial em produção" : `Nota ${p.verdict.rating.value}/10`}</p>
                <Link href={`/perfumes/${p.slug}`} className="btn-ghost perfume-card-cta">
                  Ver resenha
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
