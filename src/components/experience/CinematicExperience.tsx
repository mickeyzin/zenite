"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Perfume } from "@/data/types";
import { experienceState } from "@/lib/experience-state";
import { activeStageIndex, SECTION_SCREENS, STAGES } from "@/lib/timeline";
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

export function CinematicExperience({ perfume, index, total }: { perfume: Perfume; index: number; total: number }) {
  const section = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("cinema");
  const [reason, setReason] = useState<"reduced" | "nowebgl" | null>(null);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(-1);
  const [mounted, setMounted] = useState(false);

  // Decide o modo no cliente: sem WebGL ou com movimento reduzido → estático.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    experienceState.reducedMotion = reduced;
    // Ganchos de verificação automatizada (?debug na URL).
    if (window.location.search.includes("debug")) (window as unknown as { __zenite: typeof experienceState }).__zenite = experienceState;
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
      const panels = gsap.utils.toArray<HTMLElement>(".stage-panel", root);
      const proxy = { p: 0 };

      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(".stage-panel [data-reveal]", { y: 46, opacity: 0, filter: "blur(8px)" });
      gsap.set(".metric-fill", { scaleX: 0 });
      gsap.set(".ring-fg", { strokeDashoffset: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      // Relógio mestre: o 3D lê o mesmo valor que move os textos.
      tl.to(
        proxy,
        {
          p: 1,
          duration: 1,
          onUpdate: () => {
            experienceState.progress = proxy.p;
            const i = activeStageIndex(proxy.p);
            setActive((prev) => (prev === i ? prev : i));
          },
        },
        0,
      );

      // Abertura: título some enquanto a câmera se aproxima.
      tl.to(".hero-intro", { autoAlpha: 0, y: -40, duration: 0.06 }, 0.015);
      tl.to(".scroll-cue", { autoAlpha: 0, duration: 0.03 }, 0.0);

      STAGES.forEach((st, i) => {
        const panel = panels[i];
        if (!panel) return;
        const items = panel.querySelectorAll("[data-reveal]");
        const inAt = st.start - 0.045;
        tl.set(panel, { autoAlpha: 1 }, inAt);
        tl.to(items, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.04, stagger: 0.008, ease: "power2.out" }, inAt);
        const fills = panel.querySelectorAll<HTMLElement>(".metric-fill");
        if (fills.length)
          tl.to(fills, { scaleX: (_: number, el: HTMLElement) => Number(el.dataset.metric) / 10, duration: 0.06, stagger: 0.01, ease: "power2.out" }, st.start);
        const ring = panel.querySelector(".ring-fg");
        if (ring) tl.to(ring, { strokeDashoffset: 0, duration: 0.08, ease: "power2.out" }, st.start);
        if (i < STAGES.length - 1) {
          tl.to(items, { y: -34, opacity: 0, filter: "blur(6px)", duration: 0.035, stagger: 0.004, ease: "power1.in" }, st.end);
          tl.set(panel, { autoAlpha: 0 }, st.end + 0.05);
        } else {
          tl.to(items, { y: -34, opacity: 0, filter: "blur(6px)", duration: 0.04, stagger: 0.004, ease: "power1.in" }, 0.955);
          tl.set(panel, { autoAlpha: 0 }, 0.999);
        }
      });
      tl.to(".outro-cue", { autoAlpha: 1, y: 0, duration: 0.03 }, 0.965);

      return () => {
        experienceState.progress = 0;
      };
    },
    { scope: section, dependencies: [mode], revertOnUpdate: true },
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
    const w = window.innerWidth;
    d.spin += (dx / w) * Math.PI * 1.4;
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

  /** Teclado: quando o foco entra num painel oculto, rola até sua etapa. */
  const onFocusCapture = (e: React.FocusEvent) => {
    if (mode !== "cinema" || !section.current) return;
    const panel = (e.target as HTMLElement).closest<HTMLElement>(".stage-panel");
    if (!panel) return;
    goToStage(Number(panel.dataset.stage));
  };

  const goToStage = (i: number) => {
    const el = section.current;
    if (!el) return;
    const st = STAGES[i];
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const target = top + travel * ((st.start + st.end) / 2);
    window.scrollTo({ top: target, behavior: experienceState.reducedMotion ? "auto" : "smooth" });
  };

  if (mode === "static") {
    return (
      <section className="static-experience" aria-labelledby="static-title">
        <div className="static-hero">
          <div className="static-poster">
            <Image src="/images/perfumes/art-of-universe-poster.webp" alt={`Frasco do ${perfume.fullName}`} width={900} height={1100} priority />
          </div>
          <div>
            <p className="eyebrow">
              <span>{String(index + 1).padStart(2, "0")}</span> de {String(total).padStart(2, "0")}
            </p>
            <h1 id="static-title" className="stage-title">
              {perfume.fullName}
            </h1>
            <p className="text-[var(--z-muted)] mt-4 max-w-md">
              {reason === "reduced"
                ? "Você ativou a redução de movimento no sistema, então mostramos a resenha sem animações."
                : "Seu navegador não suporta WebGL, então mostramos a resenha em versão estática."}
            </p>
            {reason === "reduced" && (
              <button type="button" className="btn-ghost mt-6" onClick={() => setMode("cinema")}>
                Ver a experiência 3D mesmo assim
              </button>
            )}
          </div>
        </div>
        <div className="static-panels">
          <StagePanels perfume={perfume} />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={section}
      className="cinema"
      style={{ height: `${SECTION_SCREENS * 100}svh` }}
      aria-label={`Apresentação cinematográfica: ${perfume.fullName}`}
      onFocusCapture={onFocusCapture}
    >
      <div
        className={`cinema-stage ${mobile ? "is-mobile" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {mounted && <ExperienceCanvas perfume={perfume} mobile={mobile} />}
        <div className="cinema-grade" aria-hidden />

        <header className="hero-intro">
          <p className="eyebrow justify-center">
            <span>{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")} · Universo azul
          </p>
          <h1 className="hero-title">{perfume.fullName}</h1>
          <p className="hero-sub">Role para girar o frasco e ler a resenha em quatro movimentos. Arraste para inclinar.</p>
        </header>
        <div className="scroll-cue" aria-hidden>
          <span />
        </div>

        <div className="panels-layer">
          <StagePanels perfume={perfume} />
        </div>

        <nav className="stage-rail" aria-label="Etapas da apresentação">
          <ol>
            {STAGES.map((s, i) => (
              <li key={s.id}>
                <button type="button" className={active === i ? "is-active" : ""} onClick={() => goToStage(i)} aria-current={active === i ? "step" : undefined}>
                  <span className="rail-dot" aria-hidden />
                  <span className="rail-label">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <p className="outro-cue" aria-hidden>
          Próximo universo em breve · Creed Wild Vetiver
        </p>
      </div>
    </section>
  );
}
