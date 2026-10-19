import { createRoot } from "react-dom/client";
import LabCanvas from "@/components/three/LabCanvas";
import { bottles } from "@/data/perfumes";

// Laboratório na prévia: modelos chegam em base64 (.txt) e viram Blob local.
async function glbUrl(path: string) {
  const b64 = (await (await fetch(path)).text()).trim();
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bin], { type: "model/gltf-binary" }));
}

// Âncoras simples: #creed-wild-vetiver, #prada-paradoxe, #balanco
const hash = location.hash.replace("#", "");
const spin = hash === "balanco";
const entry = bottles.find((b) => b.slug === hash) ?? bottles[0];
window.addEventListener("hashchange", () => location.reload());
const name = entry.model.desktop.split("/").pop()!.replace(".parts.glb", "");

document.querySelectorAll<HTMLAnchorElement>("[data-slug]").forEach((a) => {
  if (a.dataset.slug === (spin ? "balanco" : entry.slug)) a.setAttribute("aria-current", "page");
});

glbUrl(`models/${name}.parts.glb.txt`).then((url) => {
  entry.model = { desktop: url, mobile: url };
  createRoot(document.getElementById("lab")!).render(
    <LabCanvas slug={entry.slug} spin={spin} angle={spin ? 70 : 25} dist={entry.slug === "prada-paradoxe" ? 6.5 : 5.6} />,
  );
});
