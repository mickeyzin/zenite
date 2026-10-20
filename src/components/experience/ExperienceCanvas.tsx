"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Perfume } from "@/data/types";
import SceneCanvas from "@/components/three/Scene";

/** Canvas + tela de carregamento. Carregado só no cliente (next/dynamic). */
export default function ExperienceCanvas({ perfumes, mobile }: { perfumes: Perfume[]; mobile: boolean }) {
  const { progress } = useProgress();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  // Pausa o render quando a cena sai da tela (economia de bateria e GPU).
  useEffect(() => {
    const section = host.current?.closest(".cinema");
    if (!section) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={host} className="absolute inset-0" aria-hidden>
        <SceneCanvas perfumes={perfumes} mobile={mobile} active={visible} onReady={() => setReady(true)} />
      </div>
      <div className={`loader ${ready ? "is-done" : ""}`} role="status" aria-live="polite">
        <div className="loader-mark" aria-hidden>
          <span />
        </div>
        <p className="loader-word">ZÊNITE</p>
        <p className="loader-pct">{ready ? "Pronto" : `Carregando universo · ${Math.round(progress)}%`}</p>
      </div>
    </>
  );
}
