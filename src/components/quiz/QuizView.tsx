"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProfileBars } from "@/components/charts/Charts";
import { PerfumeArt } from "@/components/ui/PerfumeArt";
import type { Perfume } from "@/data/types";
import { normalize, topAccords, type AccordKey } from "@/lib/olfactory";
import {
  ALL_NOTES,
  AVOID_SUGGESTIONS,
  EMPTY_ANSWERS,
  FAMILIES,
  hasEnough,
  LOVED_SUGGESTIONS,
  rankMatches,
  type Answers,
  type Climate,
  type Intensity,
  type Moment,
} from "@/lib/quiz";

type StepKey = "describe" | "families" | "loved" | "avoided" | "intensity" | "moment" | "climate" | "reference";
const ALL_STEPS: { key: StepKey; title: string; help: string; optional?: boolean }[] = [
  { key: "describe", title: "Descreva com suas palavras", help: "Opcional: a IA da Zênite traduz em famílias e notas, e você ajusta nas próximas etapas.", optional: true },
  { key: "families", title: "Quais famílias te atraem?", help: "Escolha até 3.", optional: true },
  { key: "loved", title: "Notas que você ama", help: "Toque nas que reconhece ou busque outras.", optional: true },
  { key: "avoided", title: "Alguma nota que você evita?", help: "Perfumes com elas descem no resultado.", optional: true },
  { key: "intensity", title: "Que intensidade você prefere?", help: "Como o perfume se faz notar.", optional: true },
  { key: "moment", title: "Quando você mais usaria?", help: "", optional: true },
  { key: "climate", title: "Para que clima?", help: "", optional: true },
  { key: "reference", title: "Já tem um perfume favorito do catálogo?", help: "Opcional: ele entra como referência.", optional: true },
];

const INTENSITY: { v: Intensity; label: string; hint: string }[] = [
  { v: "suave", label: "Suave", hint: "perto da pele, discreto" },
  { v: "moderada", label: "Moderada", hint: "percebido de perto" },
  { v: "marcante", label: "Marcante", hint: "deixa rastro" },
];
const MOMENT: { v: Moment; label: string }[] = [
  { v: "dia", label: "Durante o dia" },
  { v: "noite", label: "À noite" },
  { v: "ambos", label: "Tanto faz" },
];
const CLIMATE: { v: Climate; label: string }[] = [
  { v: "calor", label: "Dias quentes" },
  { v: "frio", label: "Dias frios" },
  { v: "todos", label: "O ano todo" },
];

const toggle = <T,>(list: T[], v: T, max = Infinity) =>
  list.includes(v) ? list.filter((x) => x !== v) : list.length >= max ? list : [...list, v];

export function QuizView({ catalog, aiEnabled = false }: { catalog: Perfume[]; aiEnabled?: boolean }) {
  const STEPS = aiEnabled ? ALL_STEPS : ALL_STEPS.filter((x) => x.key !== "describe");
  const [a, setA] = useState<Answers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  // Leva o foco ao título a cada etapa (leitores de tela e teclado), exceto ao abrir a página.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: "center" });
  }, [step, done]);

  const result = useMemo(() => (done ? rankMatches(a, catalog) : null), [done, a, catalog]);
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  if (done && result) return <Result answers={a} result={result} headingRef={heading} onRestart={() => { setA(EMPTY_ANSWERS); setStep(0); setDone(false); }} onEdit={() => { setStep(0); setDone(false); }} />;

  return (
    <section className="quiz" aria-labelledby="quiz-step-title">
      <div className="quiz-progress" aria-hidden>
        {STEPS.map((x, i) => (
          <span key={x.key} className={i <= step ? "on" : ""} />
        ))}
      </div>
      <p className="quiz-count">
        Etapa {step + 1} de {STEPS.length}
      </p>
      <h2 id="quiz-step-title" className="quiz-title" tabIndex={-1} ref={heading}>
        {s.title}
      </h2>
      {s.help && <p className="quiz-help">{s.help}</p>}

      <div className="quiz-body">
        {s.key === "describe" && <Describe answers={a} onApply={setA} />}
        {s.key === "families" && (
          <div className="quiz-grid">
            {FAMILIES.map((f) => (
              <button
                key={f.key}
                type="button"
                className="quiz-option"
                aria-pressed={a.families.includes(f.key)}
                disabled={!a.families.includes(f.key) && a.families.length >= 3}
                onClick={() => setA({ ...a, families: toggle(a.families, f.key, 3) })}
              >
                <strong>{f.label}</strong>
                <span>{f.hint}</span>
              </button>
            ))}
          </div>
        )}
        {s.key === "loved" && (
          <NotePicker
            suggestions={LOVED_SUGGESTIONS}
            selected={a.loved}
            blocked={a.avoided}
            onChange={(loved) => setA({ ...a, loved })}
          />
        )}
        {s.key === "avoided" && (
          <NotePicker
            suggestions={AVOID_SUGGESTIONS}
            selected={a.avoided}
            blocked={a.loved}
            onChange={(avoided) => setA({ ...a, avoided })}
          />
        )}
        {s.key === "intensity" && (
          <div className="quiz-grid quiz-grid-3">
            {INTENSITY.map((o) => (
              <button key={o.v} type="button" className="quiz-option" aria-pressed={a.intensity === o.v} onClick={() => setA({ ...a, intensity: a.intensity === o.v ? null : o.v })}>
                <strong>{o.label}</strong>
                <span>{o.hint}</span>
              </button>
            ))}
          </div>
        )}
        {s.key === "moment" && (
          <div className="quiz-grid quiz-grid-3">
            {MOMENT.map((o) => (
              <button key={o.v} type="button" className="quiz-option" aria-pressed={a.moment === o.v} onClick={() => setA({ ...a, moment: a.moment === o.v ? null : o.v })}>
                <strong>{o.label}</strong>
              </button>
            ))}
          </div>
        )}
        {s.key === "climate" && (
          <div className="quiz-grid quiz-grid-3">
            {CLIMATE.map((o) => (
              <button key={o.v} type="button" className="quiz-option" aria-pressed={a.climate === o.v} onClick={() => setA({ ...a, climate: a.climate === o.v ? null : o.v })}>
                <strong>{o.label}</strong>
              </button>
            ))}
          </div>
        )}
        {s.key === "reference" && (
          <div className="quiz-grid">
            {catalog.map((p) => (
              <button
                key={p.slug}
                type="button"
                className="quiz-option quiz-ref"
                aria-pressed={a.reference === p.slug}
                onClick={() => setA({ ...a, reference: a.reference === p.slug ? null : p.slug })}
              >
                <strong>{p.name}</strong>
                <span>{p.brand}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="quiz-nav">
        <button type="button" className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Voltar
        </button>
        {last ? (
          <button type="button" className="btn-primary" disabled={!hasEnough(a)} onClick={() => setDone(true)}>
            Ver meu mapa
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={() => setStep(step + 1)}>
            {s.optional && isEmptyStep(s.key, a) ? "Pular" : "Continuar"}
          </button>
        )}
      </div>
      {last && !hasEnough(a) && (
        <p className="quiz-help" role="status">
          Escolha pelo menos uma família, uma nota ou um perfume de referência.
        </p>
      )}
    </section>
  );
}

function Describe({ answers, onApply }: { answers: Answers; onApply: (a: Answers) => void }) {
  const [text, setText] = useState("");
  const [state, setState] = useState<{ busy: boolean; error?: string; summary?: string; added?: string[] }>({ busy: false });
  const run = async () => {
    setState({ busy: true });
    try {
      const res = await fetch("/api/mapa-ia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json();
      if (!res.ok) return setState({ busy: false, error: data.error ?? "Não foi possível interpretar agora." });
      const fams = (Object.entries(data.accords as Record<string, number>) as [AccordKey, number][])
        .filter(([, v]) => v >= 0.4)
        .sort((x, y) => y[1] - x[1])
        .slice(0, 3)
        .map(([k]) => k);
      const loved = [...new Set([...answers.loved, ...(data.notes as string[])])];
      onApply({ ...answers, families: fams.length ? fams : answers.families, loved });
      setState({
        busy: false,
        summary: data.summary,
        added: [...fams.map((f) => FAMILIES.find((x) => x.key === f)?.label ?? f), ...(data.notes as string[])],
      });
    } catch {
      setState({ busy: false, error: "Sem conexão com a IA agora. Siga pelas perguntas." });
    }
  };
  return (
    <div className="quiz-describe">
      <label htmlFor="quiz-describe" className="sr-only">
        Descreva o cheiro que você procura
      </label>
      <textarea
        id="quiz-describe"
        rows={3}
        maxLength={300}
        placeholder="Ex.: cheiro de praia no fim da tarde, algo fresco mas aconchegante"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="quiz-describe-row">
        <button type="button" className="btn-ghost" disabled={state.busy || text.trim().length < 3} onClick={run}>
          {state.busy ? "Interpretando…" : "Interpretar com IA"}
        </button>
        <span className="quiz-help">{text.length}/300</span>
      </div>
      {state.error && (
        <p className="admin-error" role="alert">
          {state.error}
        </p>
      )}
      {state.summary && (
        <div className="quiz-ai" role="status">
          <p>{state.summary}</p>
          {!!state.added?.length && (
            <ul className="quiz-chips">
              {state.added.map((n) => (
                <li key={n}>
                  <span className="quiz-chip-static">{n}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="quiz-help">Já marquei isso nas próximas etapas — confira e ajuste.</p>
        </div>
      )}
      <p className="quiz-help">O texto é enviado à OpenAI só para essa interpretação e não fica guardado pela Zênite.</p>
    </div>
  );
}

function isEmptyStep(k: StepKey, a: Answers) {
  if (k === "describe") return !a.families.length && !a.loved.length;
  if (k === "families") return !a.families.length;
  if (k === "loved") return !a.loved.length;
  if (k === "avoided") return !a.avoided.length;
  if (k === "intensity") return !a.intensity;
  if (k === "moment") return !a.moment;
  if (k === "climate") return !a.climate;
  if (k === "reference") return !a.reference;
  return false;
}

function NotePicker({
  suggestions,
  selected,
  blocked,
  onChange,
}: {
  suggestions: string[];
  selected: string[];
  blocked: string[];
  onChange: (v: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const blockedSet = new Set(blocked.map(normalize));
  const t = normalize(q);
  const found = t.length >= 2 ? ALL_NOTES.filter((n) => normalize(n).includes(t) && !selected.includes(n)).slice(0, 8) : [];
  const shown = [...new Set([...suggestions, ...selected])];
  return (
    <div className="quiz-notes">
      <div className="quiz-search">
        <label htmlFor="quiz-note-search" className="sr-only">
          Buscar nota
        </label>
        <input id="quiz-note-search" type="search" placeholder="Buscar outra nota (ex.: figo, chá, açafrão)" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        {found.length > 0 && (
          <ul className="quiz-found">
            {found.map((n) => (
              <li key={n}>
                <button
                  type="button"
                  disabled={blockedSet.has(normalize(n))}
                  onClick={() => {
                    onChange([...selected, n]);
                    setQ("");
                  }}
                >
                  + {n}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ul className="quiz-chips">
        {shown.map((n) => (
          <li key={n}>
            <button
              type="button"
              aria-pressed={selected.includes(n)}
              disabled={blockedSet.has(normalize(n))}
              title={blockedSet.has(normalize(n)) ? "Já marcada na outra lista" : undefined}
              onClick={() => onChange(toggle(selected, n))}
            >
              {n}
            </button>
          </li>
        ))}
      </ul>
      <p className="quiz-help">{selected.length ? `${selected.length} selecionada(s)` : "Nenhuma selecionada"}</p>
    </div>
  );
}

function Result({
  answers,
  result,
  headingRef,
  onRestart,
  onEdit,
}: {
  answers: Answers;
  result: ReturnType<typeof rankMatches>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
  onEdit: () => void;
}) {
  const top = topAccords(result.profile, 3);
  const matches = result.matches.slice(0, 6);
  return (
    <section className="quiz quiz-result" aria-labelledby="quiz-result-title">
      <p className="eyebrow">
        <span>✦</span> Seu mapa olfativo
      </p>
      <h2 id="quiz-result-title" className="quiz-title" tabIndex={-1} ref={headingRef}>
        {top.length ? top.map((t) => t.label).join(" · ") : "Perfil equilibrado"}
      </h2>
      <p className="quiz-help">
        Perfil estimado a partir das suas respostas. As recomendações comparam esse perfil com o perfil estimado de cada perfume
        do catálogo — é um ponto de partida, não substitui testar na pele.
      </p>
      <div className="quiz-profile">
        <ProfileBars profile={result.profile} caption="Seu perfil olfativo estimado" />
      </div>

      <h3 className="review-h3">Perfumes mais compatíveis</h3>
      <ol className="quiz-matches">
        {matches.map((m, i) => (
          <li key={m.perfume.slug} className="quiz-match">
            <Link href={`/perfumes/${m.perfume.slug}`} className="quiz-match-img" tabIndex={-1} aria-hidden>
              {m.perfume.poster ? (
                <Image src={m.perfume.poster} alt="" width={180} height={220} />
              ) : (
                <PerfumeArt perfume={m.perfume} className="poster-art" />
              )}
            </Link>
            <div className="quiz-match-body">
              <p className="quiz-match-rank">
                {i + 1}º · afinidade {Math.round(m.score * 100)}%
              </p>
              <h4>
                <Link href={`/perfumes/${m.perfume.slug}`}>{m.perfume.fullName}</Link>
              </h4>
              <p>{m.reason}</p>
              {answers.reference && (
                <Link className="admin-link" href={`/comparar?a=${answers.reference}&b=${m.perfume.slug}`}>
                  Comparar com o seu favorito
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
      {matches.length === 0 && <p className="quiz-help">O catálogo ainda não tem perfumes suficientes para comparar.</p>}

      <div className="quiz-nav">
        <button type="button" className="btn-ghost" onClick={onEdit}>
          Ajustar respostas
        </button>
        <button type="button" className="btn-ghost" onClick={onRestart}>
          Refazer do zero
        </button>
      </div>
      <p className="quiz-help">Suas respostas ficam só neste aparelho; nada é enviado para a Zênite.</p>
    </section>
  );
}
