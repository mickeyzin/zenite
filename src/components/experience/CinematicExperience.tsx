"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Perfume } from "@/data/types";
import { experienceState } from "@/lib/experience-state";
import { activeStageIndex, perfumeAt, SCREENS_PER_PERFUME, STAGES } from "@/lib/timeline";
import { StagePanels } from "./StagePanels";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), { ssr: false });

type Mode = "cinema" | "static";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Apresentação cinematográfica de N perfumes numa única rolagem.
 * Cada perfume tem um trecho de SCREENS_PER_PERFUME telas com 4 etapas; entre
 * trechos, o frasco se dissolve e o universo muda de cor (ver lib/timeline).
 */
export function CinematicExperience({ perfumes }: { perfumes: Perfume[] }) {
  const n = perfumes.length;
  const section = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("cinema");
  const [reason, setReason] = useState<"reduced" | "nowebgl" | null>(null);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState({ perfume: 0, stage: -1 });
  const [mounted, setMounted] = useState(false);

  // Decide o modo no cliente: sem WebGL ou com movimento reduzido → estático.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    experienceState.reducedMotion = reduced;
    // Ganchos de verificação automatizada (?debug na URL).
    if (window.location.search.includes("debug")) {
      (window as unknown as { __zenite: typeof experienceState }).__zenite = experienceState;
      // Prints automatizados em GPU lenta: sem "lag smoothing", o GSAP não freia as animações.
      gsap.ticker.lagSmoothing(0);
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!hasWebGL()) {
      setMode("static");
      setReason("nowebgl");
    } else if (reduced) {
      setMode("static");
      setReason("reduced");
    }
    const onResize = () => setMobile(window.innerWidth / window.innerHeight < 0.85 || window.innerWidth < 768);
    onResize();
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    window.addEventListener("resize", onResize);
    const onPointer = (e: PointerEvent) => {
      experienceState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      experienceState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useGSAP(
    () => {
      if (mode !== "cinema" || !section.current) return;
      const root = section.current;
      const proxy = { p: 0 };
      // Posição global (0–1) de um ponto local do perfume i.
      const at = (i: number, local: number) => (i + local) / n;

      gsap.set(".stage-panel", { autoAlpha: 0 });
      gsap.set(".stage-panel [data-reveal]", { y: 46, opacity: 0, filter: "blur(8px)" });
      gsap.set(".metric-fill", { scaleX: 0 });
      gsap.set(".ring-fg", { strokeDashoffset: 1 });
      gsap.set(".hero-intro[data-perfume]:not([data-perfume='0'])", { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.9, invalidateOnRefresh: true },
      });

      // Relógio mestre: o 3D lê o mesmo valor que move os textos.
      tl.to(
        proxy,
        {
          p: 1,
          duration: 1,
          onUpdate: () => {
            experienceState.progress = proxy.p;
            const { index, local } = perfumeAt(proxy.p, n);
            const stage = activeStageIndex(local);
            setActive((prev) => (prev.perfume === index && prev.stage === stage ? prev : { perfume: index, stage }));
          },
        },
        0,
      );
      tl.to(".scroll-cue", { autoAlpha: 0, duration: 0.01 }, 0);

      perfumes.forEach((_, i) => {
        // Cartão de abertura do perfume: o primeiro já começa visível.
        const hero = root.querySelector(`.hero-intro[data-perfume='${i}']`);
        if (hero) {
          if (i > 0) tl.fromTo(hero, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.012, immediateRender: false }, at(i, 0.012));
          tl.to(hero, { autoAlpha: 0, y: -40, duration: 0.02 / n * 3 }, at(i, 0.05));
        }

        const panels = root.querySelectorAll<HTMLElement>(`.stage-panel[data-perfume='${i}']`);
        STAGES.forEach((st, k) => {
          const panel = panels[k];
          if (!panel) return;
          const items = panel.querySelectorAll("[data-reveal]");
          const inAt = at(i, st.start - 0.045);
          const d = (x: number) => x / n; // durações locais → globais
          tl.set(panel, { autoAlpha: 1 }, inAt);
          tl.to(items, { y: 0, opacity: 1, filter: "blur(0px)", duration: d(0.04), stagger: d(0.008), ease: "power2.out" }, inAt);
          const fills = panel.querySelectorAll<HTMLElement>(".metric-fill");
          if (fills.length)
            tl.to(fills, { scaleX: (_: number, el: HTMLElement) => Number(el.dataset.metric) / 10, duration: d(0.06), stagger: d(0.01), ease: "power2.out" }, at(i, st.start));
          const ring = panel.querySelector(".ring-fg");
          if (ring) tl.to(ring, { strokeDashoffset: 0, duration: d(0.08), ease: "power2.out" }, at(i, st.start));
          const outAt = k < STAGES.length - 1 ? st.end : 0.945;
          tl.to(items, { y: -34, opacity: 0, filter: "blur(6px)", duration: d(0.035), stagger: d(0.004), ease: "power1.in" }, at(i, outAt));
          tl.set(panel, { autoAlpha: 0 }, at(i, outAt + 0.045));
        });
      });
      tl.to(".outro-cue", { autoAlpha: 1, y: 0, duration: 0.01 }, at(n - 1, 0.975));
      // Borda inferior esmaece para o espaço: a cena "entrega" a página à Linha Zênite.
      tl.fromTo(".cinema-fade", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.012, immediateRender: false }, at(n - 1, 0.982));

      return () => {
        experienceState.progress = 0;
      };
    },
    { scope: section, dependencies: [mode, n], revertOnUpdate: true },
  );

  /**
   * Arrastar sobre a cena inclina e gira o frasco. No toque, o deslize vertical
   * continua rolando a página (touch-action: pan-y); o horizontal move o frasco.
   */
  const dragRef = useRef<{ x: number; y: number; t: number; id: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a, button, .stage-panel, .stage-rail")) return;
    dragRef.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
    experienceState.drag.active = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const g = dragRef.current;
    if (!g || g.id !== e.pointerId) return;
    const now = performance.now();
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    const vx = dx / Math.max(now - g.t, 8); // px/ms
    const d = experienceState.drag;
    d.spin += (dx / window.innerWidth) * Math.PI * 1.4;
    // Inclina na direção do movimento (como segurar e balançar o frasco).
    d.tiltZ = Math.max(-0.6, Math.min(0.6, d.tiltZ * 0.85 - vx * 0.6));
    if (e.pointerType !== "touch") d.tiltX = Math.max(-0.5, Math.min(0.5, d.tiltX + (dy / window.innerHeight) * 1.6));
    g.x = e.clientX;
    g.y = e.clientY;
    g.t = now;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragRef.current?.id !== e.pointerId) return;
    dragRef.current = null;
    experienceState.drag.active = false;
  };

  const goTo = (perfume: number, stage: number) => {
    const el = section.current;
    if (!el) return;
    const st = STAGES[stage];
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const target = top + travel * ((perfume + (st.start + st.end) / 2) / n);
    window.scrollTo({ top: target, behavior: experienceState.reducedMotion ? "auto" : "smooth" });
  };

  /** Teclado: quando o foco entra num painel oculto, rola até sua etapa. */
  const onFocusCapture = (e: React.FocusEvent) => {
    if (mode !== "cinema") return;
    const panel = (e.target as HTMLElement).closest<HTMLElement>(".stage-panel");
    if (!panel) return;
    goTo(Number(panel.dataset.perfume), Number(panel.dataset.stage));
  };

  if (mode === "static") {
    return (
      <section className="static-experience" aria-label="Perfumes em destaque">
        <p className="text-[var(--z-muted)] max-w-xl">
          {reason === "reduced"
            ? "Você ativou a redução de movimento no sistema, então mostramos as resenhas sem animações."
            : "Seu navegador não suporta WebGL, então mostramos as resenhas em versão estática."}
        </p>
        {reason === "reduced" && (
          <button type="button" className="btn-ghost mt-6" onClick={() => setMode("cinema")}>
            Ver a experiência 3D mesmo assim
          </button>
        )}
        {perfumes.map((p, i) => (
          <article key={p.slug} className="static-perfume" aria-labelledby={`${p.slug}-static-title`}>
            <div className="static-hero">
              <div className="static-poster">
                {p.poster && <Image src={p.poster} alt={`Frasco do ${p.fullName}`} width={900} height={1100} priority={i === 0} />}
              </div>
              <div>
                <p className="eyebrow">
                  <span>{pad(i + 1)}</span> de {pad(n)} · {p.universe}
                </p>
                <h2 id={`${p.slug}-static-title`} className="stage-title">
                  {p.fullName}
                </h2>
              </div>
            </div>
            <div className="static-panels">
              <StagePanels perfume={p} index={i} />
            </div>
          </article>
        ))}
      </section>
    );
  }

  const current = perfumes[active.perfume] ?? perfumes[0];

  return (
    <section
      ref={section}
      className="cinema"
      style={{ height: `${SCREENS_PER_PERFUME * n * 100}svh` }}
      aria-label="Apresentação cinematográfica dos perfumes em destaque"
      onFocusCapture={onFocusCapture}
    >
      <div
        className={`cinema-stage ${mobile ? "is-mobile" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {mounted && <ExperienceCanvas perfumes={perfumes} mobile={mobile} />}
        <div className="cinema-grade" aria-hidden />
        <div className="cinema-fade" aria-hidden />

        {perfumes.map((p, i) => (
          <header key={p.slug} className="hero-intro" data-perfume={i}>
            <p className="eyebrow justify-center">
              <span>{pad(i + 1)}</span> / {pad(n)} · {p.universe}
            </p>
            {i === 0 ? <h1 className="hero-title">{p.fullName}</h1> : <h2 className="hero-title">{p.fullName}</h2>}
            {i === 0 && <p className="hero-sub">Role para girar o frasco e ler a resenha em quatro movimentos. Arraste para inclinar.</p>}
          </header>
        ))}
        <div className="scroll-cue" aria-hidden>
          <span />
        </div>

        <div className="panels-layer">
          {perfumes.map((p, i) => (
            <StagePanels key={p.slug} perfume={p} index={i} />
          ))}
        </div>

        <nav className="stage-rail" aria-label="Etapas da apresentação">
          <p className="rail-perfume">
            <span>{pad(active.perfume + 1)}</span> / {pad(n)}
            <strong>{current.name}</strong>
          </p>
          <ol>
            {STAGES.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={active.stage === i ? "is-active" : ""}
                  onClick={() => goTo(active.perfume, i)}
                  aria-current={active.stage === i ? "step" : undefined}
                  aria-label={`${s.label} — ${current.name}`}
                >
                  <span className="rail-dot" aria-hidden />
                  <span className="rail-label">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <ol className="rail-perfumes" aria-label="Perfumes">
            {perfumes.map((p, i) => (
              <li key={p.slug}>
                <button type="button" className={active.perfume === i ? "is-active" : ""} onClick={() => goTo(i, 0)} aria-label={`Ir para ${p.fullName}`}>
                  <span aria-hidden>{pad(i + 1)}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <p className="outro-cue" aria-hidden>
          Continue rolando para explorar a Zênite
        </p>
      </div>
    </section>
  );
}
