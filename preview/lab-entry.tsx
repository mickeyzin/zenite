import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useGLTF } from "@react-three/drei";
import LabCanvas from "@/components/three/LabCanvas";
import { bottles } from "@/data/perfumes";

// Laboratório na prévia: modelos chegam em base64 (.txt) e viram Blob local.
// Os três são baixados em paralelo; a troca entre frascos não recarrega a página.
async function glbUrl(path: string) {
  const b64 = (await (await fetch(path)).text()).trim();
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bin], { type: "model/gltf-binary" }));
}

const fileOf = (slug: string) => {
  const b = bottles.find((x) => x.slug === slug)!;
  return b.model.desktop.split("/").pop()!.replace(".parts.glb", "");
};
const cache = new Map<string, Promise<string>>();
const load = (slug: string) => {
  if (!cache.has(slug)) cache.set(slug, glbUrl(`models/${fileOf(slug)}.parts.glb.txt`));
  return cache.get(slug)!;
};

function readHash() {
  const h = location.hash.replace("#", "");
  return { slug: bottles.some((b) => b.slug === h) ? h : bottles[0].slug, spin: h === "balanco" };
}

function Lab() {
  const [view, setView] = useState(readHash);
  const [ready, setReady] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const on = () => setView((v) => {
      const n = readHash();
      return n.spin ? { ...v, spin: true } : n;
    });
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  // Baixa o atual primeiro e os outros em seguida.
  useEffect(() => {
    const order = [view.slug, ...bottles.map((b) => b.slug).filter((s) => s !== view.slug)];
    order.forEach((slug) =>
      load(slug).then((url) => {
        const b = bottles.find((x) => x.slug === slug)!;
        b.model = { desktop: url, mobile: url, liquid: b.model.liquid ? `models/${fileOf(slug)}.liquid.json` : undefined };
        useGLTF.preload(url); // já decodifica, para a troca ser imediata
        setReady((r) => ({ ...r, [slug]: true }));
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>("[data-slug]").forEach((a) => {
      const on = a.dataset.slug === (view.spin ? "balanco" : view.slug);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }, [view]);

  if (!ready[view.slug]) return <p style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", color: "#a9b0cf", letterSpacing: ".2em", fontSize: 12 }}>CARREGANDO FRASCO…</p>;
  return <LabCanvas preload={false} slug={view.slug} spin={view.spin} angle={view.spin ? 70 : 25} dist={view.slug === "prada-paradoxe" ? 6.5 : 5.6} />;
}

createRoot(document.getElementById("lab")!).render(<Lab />);
