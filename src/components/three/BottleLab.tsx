"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { bottles } from "@/data/perfumes";

const LabCanvas = dynamic(() => import("./LabCanvas"), { ssr: false });

/** Laboratório com troca de frasco sem recarregar a página. */
export function BottleLab() {
  const [state, setState] = useState(() => {
    const q = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
    return { slug: q.get("p") ?? bottles[0].slug, spin: q.get("spin") === "1" };
  });
  return (
    <>
      <LabCanvas
        key="lab"
        slug={state.slug}
        spin={state.spin}
        dist={state.slug === "prada-paradoxe-intense" ? 6.5 : 5.6}
      />
      <nav aria-label="Frascos" className="fixed top-20 left-4 right-4 z-10 flex flex-wrap gap-2">
        {bottles.map((b) => (
          <button
            key={b.slug}
            type="button"
            className="btn-ghost"
            aria-pressed={state.slug === b.slug && !state.spin}
            onClick={() => setState({ slug: b.slug, spin: false })}
          >
            {b.name}
          </button>
        ))}
        <button type="button" className="btn-ghost" aria-pressed={state.spin} onClick={() => setState((s) => ({ ...s, spin: !s.spin }))}>
          Testar balanço do líquido
        </button>
      </nav>
    </>
  );
}
