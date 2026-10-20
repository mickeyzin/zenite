"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Linha Zênite: um traço de luz que desce pela página ligando estrelas.
 *
 * - Parte da estrela-âncora deixada pela constelação 3D (86% da altura da tela,
 *   centro), ou seja, um pouco ACIMA do topo deste bloco.
 * - Passa por cada elemento com `data-zenite-star` (uma estrela por seção).
 * - A ponta acompanha a linha de leitura (62% da tela): rolar desenha, subir recua.
 * - Ao alcançar uma estrela, ela acende junto com uma pequena constelação.
 * - Fica atrás do conteúdo e não intercepta cliques (pointer-events: none).
 */

const READ_LINE = 0.62;
const ANCHOR_Y = 0.86; // mesma posição da âncora da constelação 3D

interface Star {
  x: number;
  y: number;
  len: number;
  side: 1 | -1;
  cluster: { x: number; y: number }[];
}

interface Layout {
  w: number;
  h: number;
  top: number; // deslocamento do início acima do bloco (px, negativo)
  d: string;
  stars: Star[];
  total: number;
  samples: { len: number; y: number }[];
}

function clusterFor(x: number, y: number, side: 1 | -1, seed: number) {
  // Constelação pequena e determinística ao redor da estrela, para o lado de fora.
  let s = seed * 7919 + 13;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 4 }, (_, i) => ({
    x: Math.max(10, x + side * (28 + r() * 70 + i * 14)),
    y: y + (r() - 0.5) * 120 - 20 + i * 8,
  }));
}

export function ZeniteTrail({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const head = useRef<SVGCircleElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [lit, setLit] = useState(-1);
  const [reduced, setReduced] = useState(false);

  const measure = useCallback(() => {
    const el = host.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const w = box.width;
    const h = el.scrollHeight;
    const vh = window.innerHeight;
    const mobile = w < 768;
    const top = -(1 - ANCHOR_Y) * vh; // a âncora fica 14% da tela acima do bloco
    const pts: { x: number; y: number; side: 1 | -1 }[] = [{ x: w / 2, y: top, side: 1 }];
    el.querySelectorAll<HTMLElement>("[data-zenite-star]").forEach((s) => {
      const r = s.getBoundingClientRect();
      pts.push({ x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, side: s.dataset.zeniteStar === "right" ? 1 : -1 });
    });
    pts.push({ x: mobile ? 28 : w / 2, y: h - 40, side: 1 });

    // Curvas suaves: tangentes verticais em cada estrela.
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dy = (b.y - a.y) * 0.5;
      d += ` C ${a.x.toFixed(1)} ${(a.y + dy).toFixed(1)}, ${b.x.toFixed(1)} ${(b.y - dy).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    // Mede o caminho fora da tela para achar o comprimento até cada estrela.
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("style", "position:absolute;width:0;height:0;visibility:hidden");
    const tmp = document.createElementNS(ns, "path");
    tmp.setAttribute("d", d);
    svg.appendChild(tmp);
    document.body.appendChild(svg);
    const total = tmp.getTotalLength();
    const samples: { len: number; y: number }[] = [];
    const N = Math.max(200, Math.round(total / 12));
    for (let i = 0; i <= N; i++) {
      const len = (total * i) / N;
      samples.push({ len, y: tmp.getPointAtLength(len).y });
    }
    const lenAtY = (y: number) => {
      let best = samples[0];
      for (const sm of samples) if (Math.abs(sm.y - y) < Math.abs(best.y - y)) best = sm;
      return best.len;
    };
    document.body.removeChild(svg);
    const stars: Star[] = pts.slice(1, -1).map((p, i) => ({ ...p, len: lenAtY(p.y), cluster: clusterFor(p.x, p.y, p.side, i + 1) }));
    setLayout({ w, h, top, d, stars, total, samples });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (host.current) ro.observe(host.current);
    document.fonts?.ready.then(() => measure());
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
  }, []);

  useGSAP(
    () => {
      const el = host.current;
      if (!layout || !el || !path.current || !glow.current) return;
      const { total, samples, stars } = layout;
      const paths = [path.current, glow.current];
      gsap.set(paths, { strokeDasharray: total, strokeDashoffset: reduced ? 0 : total });
      if (reduced) {
        setLit(stars.length - 1);
        return;
      }
      const setOffset = paths.map((p) => gsap.quickTo(p, "strokeDashoffset", { duration: 0.35, ease: "power2.out" }));
      const update = () => {
        // Posição da linha de leitura dentro do bloco → comprimento desenhado.
        const y = window.innerHeight * READ_LINE - el.getBoundingClientRect().top;
        let len = 0;
        if (y >= samples[samples.length - 1].y) len = total;
        else if (y > samples[0].y) {
          // samples estão em ordem de comprimento e (quase) de y crescente
          let lo = 0;
          let hi = samples.length - 1;
          while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (samples[mid].y < y) lo = mid;
            else hi = mid;
          }
          const a = samples[lo];
          const b = samples[hi];
          len = a.len + ((b.len - a.len) * (y - a.y)) / Math.max(1e-3, b.y - a.y);
        }
        setOffset.forEach((f) => f(total - len));
        const pt = path.current!.getPointAtLength(Math.max(0, len));
        if (head.current) {
          head.current.setAttribute("cx", String(pt.x));
          head.current.setAttribute("cy", String(pt.y));
          head.current.style.opacity = len > 4 && len < total - 4 ? "1" : "0";
        }
        let k = -1;
        stars.forEach((s, i) => {
          if (len >= s.len - 2) k = i;
        });
        setLit((prev) => (prev === k ? prev : k));
      };
      ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onUpdate: update, onRefresh: update });
      update();
    },
    { scope: host, dependencies: [layout, reduced], revertOnUpdate: true },
  );

  return (
    <div ref={host} className={`zenite-trail ${className}`}>
      {layout && (
        <svg className="zenite-svg" width={layout.w} height={layout.h - layout.top} viewBox={`0 ${layout.top} ${layout.w} ${layout.h - layout.top}`} style={{ top: layout.top }} aria-hidden focusable="false">
          <defs>
            <linearGradient id="zenite-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfefff" />
              <stop offset="45%" stopColor="#31c7f3" />
              <stop offset="100%" stopColor="#a65cff" />
            </linearGradient>
            <radialGradient id="zenite-star-grad">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#bfefff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#31c7f3" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Constelações das seções */}
          {layout.stars.map((s, i) => (
            <g key={i} className={`zenite-cluster ${i <= lit ? "is-lit" : ""}`}>
              <polyline points={[{ x: s.x, y: s.y }, ...s.cluster].map((p) => `${p.x},${p.y}`).join(" ")} />
              {s.cluster.map((c, j) => (
                <circle key={j} cx={c.x} cy={c.y} r={1.6 + (j % 2)} />
              ))}
            </g>
          ))}
          {/* Trilho apagado (onde a linha vai passar) */}
          <path d={layout.d} className="zenite-rail" />
          {/* Brilho largo + traço fino */}
          <path ref={glow} d={layout.d} className="zenite-glow" stroke="url(#zenite-grad)" />
          <path ref={path} d={layout.d} className="zenite-path" stroke="url(#zenite-grad)" />
          {layout.stars.map((s, i) => (
            <g key={i} className={`zenite-star ${i <= lit ? "is-lit" : ""}`} transform={`translate(${s.x} ${s.y})`}>
              <circle r={14} fill="url(#zenite-star-grad)" className="zenite-star-halo" />
              <path d="M0 -7 L1.4 -1.4 L7 0 L1.4 1.4 L0 7 L-1.4 1.4 L-7 0 L-1.4 -1.4 Z" className="zenite-star-core" />
            </g>
          ))}
          <circle ref={head} r={3.2} className="zenite-head" />
        </svg>
      )}
      <div className="zenite-content">{children}</div>
    </div>
  );
}
