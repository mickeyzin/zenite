import { createRoot } from "react-dom/client";
import { CinematicExperience } from "@/components/experience/CinematicExperience";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { artOfUniverse } from "@/data/perfumes";

// Na prévia os arquivos ficam ao lado da página: caminhos relativos.
// Os modelos vêm em base64 (.txt) porque a hospedagem da prévia não serve .glb;
// viram um Blob local antes de chegar ao GLTFLoader.
async function glbUrl(path: string) {
  const b64 = (await (await fetch(path)).text()).trim();
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bin], { type: "model/gltf-binary" }));
}

function App({ perfume }: { perfume: typeof artOfUniverse }) {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <CinematicExperience perfume={perfume} index={0} total={3} />
        <section className="after-section">
          <p className="eyebrow">
            <span>✦</span> Prévia
          </p>
          <h2 className="stage-title">Fim da primeira cena</h2>
          <p className="max-w-xl text-[var(--z-muted)] mt-4">
            Esta prévia mostra a Fase 2: o Lattafa Pride Art of Universe em quatro etapas. Role para cima para ver a
            animação voltar. Creed Wild Vetiver e Prada Paradoxe entram na próxima fase.
          </p>
          <p className="mt-8">
            <a className="btn-primary" href="lab.html">
              Abrir o laboratório dos três frascos <span aria-hidden>→</span>
            </a>
          </p>
        </section>
      </main>
    </>
  );
}

const isMobile = window.innerWidth / window.innerHeight < 0.85 || window.innerWidth < 768;
const file = isMobile ? "models/art-of-universe.parts.mobile.glb.txt" : "models/art-of-universe.parts.glb.txt";
const root = createRoot(document.getElementById("root")!);
glbUrl(file).then((url) => {
  const perfume = { ...artOfUniverse, model: { desktop: url, mobile: url, liquid: "models/art-of-universe.liquid.json" } };
  root.render(<App perfume={perfume} />);
});
