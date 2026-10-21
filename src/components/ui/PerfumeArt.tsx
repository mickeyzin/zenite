import type { Perfume } from "@/data/types";
import { accordProfile, topAccords, type AccordKey } from "@/lib/olfactory";

/**
 * Arte da Zênite para perfumes sem foto: não imita o frasco. Cores vêm dos
 * acordes predominantes e a constelação é sorteada a partir do slug (sempre
 * a mesma para o mesmo perfume).
 */
const ACCORD_COLOR: Record<AccordKey, string> = {
  citrico: "#f2c94c",
  frutado: "#ff7a8a",
  floral: "#f29bd4",
  verde: "#6fcf7f",
  aromatico: "#6fd6c8",
  especiado: "#e0763c",
  amadeirado: "#b07a4f",
  ambarado: "#e3a03a",
  doce: "#d98ad9",
  almiscarado: "#b9b4ea",
};

// Gerador pseudoaleatório determinístico (mulberry32).
function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  let a = (h << 13) | (h >>> 19);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function PerfumeArt({ perfume: p, className }: { perfume: Perfume; className?: string }) {
  const accords = topAccords(accordProfile(p).profile, 3);
  const colors = accords.length ? accords.map((a) => ACCORD_COLOR[a.key]) : ["#31c7f3", "#7928ca"];
  const [c1, c2 = c1, c3 = c2] = colors;
  const r = rng(p.slug);
  const id = `art-${p.slug}`;
  // Constelação: 6–8 estrelas na metade de cima, ligadas em sequência.
  const n = 6 + Math.floor(r() * 3);
  const stars = Array.from({ length: n }, () => ({ x: 40 + r() * 280, y: 50 + r() * 190, s: 1.2 + r() * 2.2 }));
  stars.sort((a, b) => a.x - b.x);
  const dust = Array.from({ length: 40 }, () => ({ x: r() * 360, y: r() * 440, s: 0.3 + r() * 0.9, o: 0.2 + r() * 0.6 }));
  // Planeta: tamanho, posição, inclinação do anel e cores mudam por perfume.
  const planet = { x: 90 + r() * 180, y: 285 + r() * 50, rad: 42 + r() * 34, ring: r() > 0.45, tilt: -25 + r() * 50 };

  return (
    <svg viewBox="0 0 360 440" className={className} role="img" aria-label={`Arte da Zênite para ${p.fullName}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`${id}-a`} cx="30%" cy="25%" r="70%">
          <stop offset="0" stopColor={c1} stopOpacity=".55" />
          <stop offset="1" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-b`} cx="75%" cy="70%" r="65%">
          <stop offset="0" stopColor={c2} stopOpacity=".45" />
          <stop offset="1" stopColor={c2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-c`} cx="50%" cy="100%" r="60%">
          <stop offset="0" stopColor={c3} stopOpacity=".35" />
          <stop offset="1" stopColor={c3} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="440" fill="#050817" />
      <rect width="360" height="440" fill={`url(#${id}-a)`} />
      <rect width="360" height="440" fill={`url(#${id}-b)`} />
      <rect width="360" height="440" fill={`url(#${id}-c)`} />
      {dust.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#fff" opacity={d.o} />
      ))}
      <polyline points={stars.map((s) => `${s.x},${s.y}`).join(" ")} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth=".8" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" />
      ))}
      <defs>
        <radialGradient id={`${id}-p`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor={c1} />
          <stop offset=".55" stopColor={c2} />
          <stop offset="1" stopColor="#050817" />
        </radialGradient>
      </defs>
      <circle cx={planet.x} cy={planet.y} r={planet.rad * 1.5} fill={c1} opacity=".12" />
      <circle cx={planet.x} cy={planet.y} r={planet.rad} fill={`url(#${id}-p)`} />
      {planet.ring && (
        <ellipse
          cx={planet.x}
          cy={planet.y}
          rx={planet.rad * 1.75}
          ry={planet.rad * 0.38}
          fill="none"
          stroke={c3}
          strokeOpacity=".7"
          strokeWidth="2"
          transform={`rotate(${planet.tilt} ${planet.x} ${planet.y})`}
        />
      )}
      <text x="180" y="392" textAnchor="middle" fill="#fff" fillOpacity=".55" fontFamily="sans-serif" fontSize="13" letterSpacing="5">
        {p.brand.toUpperCase()}
      </text>
    </svg>
  );
}
