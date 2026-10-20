import { createRoot } from "react-dom/client";
import { CinematicExperience } from "@/components/experience/CinematicExperience";
import { HomeTrail } from "@/components/trail/HomeTrail";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { featuredPerfumes } from "@/data/perfumes";
import type { Perfume } from "@/data/types";

// Na prévia os arquivos ficam ao lado da página: caminhos relativos.
// Os modelos vêm em base64 (.txt) porque a hospedagem da prévia não serve .glb;
// viram um Blob local antes de chegar ao GLTFLoader.
async function glbUrl(path: string) {
  const b64 = (await (await fetch(path)).text()).trim();
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bin], { type: "model/gltf-binary" }));
}

function App({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <CinematicExperience perfumes={perfumes} />
        <HomeTrail />
        <section className="after-section">
          <p className="eyebrow">
            <span>✦</span> Prévia
          </p>
          <h2 className="stage-title">Laboratório dos frascos</h2>
          <p className="max-w-xl text-[var(--z-muted)] mt-4">Gire e incline cada frasco de perto para ver o vidro e o líquido.</p>
          <p className="mt-8">
            <a className="btn-primary" href="lab.html">
              Abrir o laboratório <span aria-hidden>→</span>
            </a>
          </p>
        </section>
      </main>
    </>
  );
}

const isMobile = window.innerWidth / window.innerHeight < 0.85 || window.innerWidth < 768;
const root = createRoot(document.getElementById("root")!);
// Baixa os três frascos em paralelo (versão mobile no celular).
Promise.all(
  featuredPerfumes.map(async (p) => {
    const file = (isMobile ? p.model.mobile : p.model.desktop).split("/").pop()!;
    const url = await glbUrl(`models/${file}.txt`);
    const liquid = p.model.liquid ? `models/${p.model.liquid.split("/").pop()}` : undefined;
    return { ...p, model: { desktop: url, mobile: url, liquid }, poster: p.poster.replace(/^\//, "") };
  }),
).then((perfumes) => root.render(<App perfumes={perfumes} />));
