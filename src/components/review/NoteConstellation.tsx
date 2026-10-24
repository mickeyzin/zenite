import type { Perfume } from "@/data/types";
import { Icon, type IconName } from "@/components/ui/Icons";
import { layoutConstellation, type Layout, type Tier } from "@/lib/constellation";
import { normalize } from "@/lib/olfactory";
import { ConstellationReveal } from "./ConstellationReveal";
import { NoteOrb } from "./NoteOrb";

const TIER_INFO: Record<Tier, { label: string; hint: string; icon: IconName }> = {
  top: { label: "Saída", hint: "os primeiros minutos", icon: "up" },
  heart: { label: "Coração", hint: "depois de 15 a 30 minutos", icon: "core" },
  base: { label: "Fundo", hint: "o que fica por horas", icon: "roots" },
};

/** Pirâmide olfativa como constelação: o zênite no alto, o fundo embaixo. */
export function NoteConstellation({ perfume: p }: { perfume: Perfume }) {
  const notes = p.notes.value;
  const desk = layoutConstellation(notes, 6);
  const mob = layoutConstellation(notes, 3, 0.4);
  return (
    <ConstellationReveal className="constellation-wrap">
      <Sky layout={desk} perfume={p} variant="desk" />
      <Sky layout={mob} perfume={p} variant="mob" />
    </ConstellationReveal>
  );
}

function Sky({ layout: L, perfume: p, variant }: { layout: Layout; perfume: Perfume; variant: "desk" | "mob" }) {
  const pt = (i: number) => (i < 0 ? L.zenith : L.stars[i]);
  const total = L.stars.length;
  return (
    <div className={`constellation constellation-${variant}`} style={{ ["--units" as string]: L.units }} aria-hidden>
      {(Object.keys(TIER_INFO) as Tier[]).map((t) => (
        <p key={t} className={`constellation-tier constellation-tier-${t}`} style={{ top: `${variant === "mob" ? L.tierTop[t] : L.tierY[t]}%` }}>
          <Icon name={TIER_INFO[t].icon} size={16} />
          <span>{TIER_INFO[t].label}</span>
          <small>{TIER_INFO[t].hint}</small>
        </p>
      ))}
      {/* Linhas, zênite e estrelas no mesmo quadro (mesma referência de posição) */}
      <div className="constellation-field">
      <svg className="constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {L.edges.map(([a, b], k) => (
          <line
            key={k}
            x1={pt(a).x}
            y1={pt(a).y}
            x2={pt(b).x}
            y2={pt(b).y}
            style={{ ["--d" as string]: `${0.15 + (Math.max(a, 0) / Math.max(total, 1)) * 1.4}s` }}
          />
        ))}
      </svg>
      <span className="constellation-zenith" style={{ left: `${L.zenith.x}%`, top: `${L.zenith.y}%` }} aria-hidden>
        <span className="constellation-zenith-label">Zênite</span>
      </span>
      <ul className="constellation-stars">
        {L.stars.map((s) => (
          <NoteOrb
            key={`${s.tier}-${s.note}`}
            note={s.note}
            override={p.noteWeights}
            image={p.noteImages?.[normalize(s.note)]}
            className={`constellation-star tier-${s.tier}`}
            style={{ left: `${s.x}%`, top: `${s.y}%`, ["--d" as string]: `${0.1 + (s.order / Math.max(total, 1)) * 1.4}s` }}
          />
        ))}
      </ul>
      </div>
    </div>
  );
}
