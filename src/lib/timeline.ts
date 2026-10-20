/**
 * Roteiro da apresentação de um perfume. Todo o sincronismo (câmera, rotação,
 * luz e textos) deriva destes números, que são frações do scroll da seção.
 */
export const STAGES = [
  { id: "frontal", label: "Frente", start: 0.1, end: 0.28 },
  { id: "lateral", label: "Perfil", start: 0.34, end: 0.5 },
  { id: "posterior", label: "Verso", start: 0.56, end: 0.72 },
  { id: "perspectiva", label: "Perspectiva", start: 0.78, end: 0.94 },
] as const;

export type StageId = (typeof STAGES)[number]["id"];

/** Altura do trecho de cada perfume, em telas. A seção tem N trechos. */
export const SCREENS_PER_PERFUME = 7;

/*
 * Janelas da transição entre perfumes (frações do trecho local):
 * o frasco atual se dissolve no fim do seu trecho e o próximo surge no começo do seguinte.
 */
export const DISSOLVE_OUT: [number, number] = [0.952, 0.996];
export const DISSOLVE_IN: [number, number] = [0.004, 0.055];

export interface Shot {
  p: number;
  cam: [number, number, number];
  look: [number, number, number];
  /** Rotação do frasco em Y, somada à rotação frontal do modelo. */
  rot: number;
  /** Deslocamento do frasco para abrir espaço ao texto. */
  offset: [number, number];
  fov: number;
}

const PI = Math.PI;

export const DESKTOP_SHOTS: Shot[] = [
  { p: 0.0, cam: [0, 0.6, 11.5], look: [0, -0.35, 0], rot: -0.55, offset: [0, 0.45], fov: 30 },
  { p: 0.1, cam: [0, 0.2, 6.7], look: [0, 0.02, 0], rot: 0, offset: [0.95, 0], fov: 30 },
  { p: 0.28, cam: [0.05, 0.1, 6.0], look: [0, 0.02, 0], rot: 0.06, offset: [0.95, 0], fov: 30 },
  { p: 0.34, cam: [0.4, 0.3, 6.3], look: [0, 0.05, 0], rot: PI / 2, offset: [-0.95, 0], fov: 30 },
  { p: 0.5, cam: [0.3, 0.08, 5.8], look: [0, 0.0, 0], rot: PI / 2 + 0.06, offset: [-0.95, 0], fov: 30 },
  { p: 0.56, cam: [0, 0.45, 6.4], look: [0, 0.05, 0], rot: PI, offset: [0.95, 0], fov: 30 },
  { p: 0.72, cam: [-0.05, 0.25, 5.9], look: [0, 0.02, 0], rot: PI + 0.06, offset: [0.95, 0], fov: 30 },
  { p: 0.78, cam: [-0.6, -0.12, 5.4], look: [0, 0.02, 0], rot: 1.75 * PI, offset: [-0.9, 0], fov: 29 },
  { p: 0.94, cam: [-0.45, -0.05, 4.8], look: [0, 0.05, 0], rot: 1.79 * PI, offset: [-0.9, 0], fov: 28 },
  // Igual ao início: a câmera chega à mesma posição em que o próximo perfume começa.
  { p: 1.0, cam: [0, 0.6, 11.5], look: [0, -0.35, 0], rot: 2 * PI - 0.55, offset: [0, 0.45], fov: 30 },
];

/** Em telas verticais o frasco sobe e o texto ocupa a metade inferior. */
export const MOBILE_SHOTS: Shot[] = DESKTOP_SHOTS.map((s) => ({
  ...s,
  cam: [s.cam[0] * 0.6, s.cam[1] - 1.25, Math.max(s.cam[2], 5.6) * 1.5 + 0.4],
  look: [0, s.look[1] - 1.25, 0],
  offset: [0, 0],
  fov: 34,
}));

const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10); // smootherstep
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function sampleShot(shots: Shot[], p: number, out: Omit<Shot, "p">) {
  let i = 0;
  while (i < shots.length - 2 && p > shots[i + 1].p) i++;
  const a = shots[i];
  const b = shots[i + 1];
  const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
  for (let k = 0; k < 3; k++) {
    out.cam[k] = lerp(a.cam[k], b.cam[k], t);
    out.look[k] = lerp(a.look[k], b.look[k], t);
  }
  out.offset[0] = lerp(a.offset[0], b.offset[0], t);
  out.offset[1] = lerp(a.offset[1], b.offset[1], t);
  out.rot = lerp(a.rot, b.rot, t);
  out.fov = lerp(a.fov, b.fov, t);
  return out;
}

/** 0→1→0 durante as viradas entre etapas: usado para a varredura de luz. */
export function transitionPulse(p: number) {
  let v = 0;
  for (let i = 0; i < STAGES.length - 1; i++) {
    const a = STAGES[i].end;
    const b = STAGES[i + 1].start;
    const c = (a + b) / 2;
    const w = (b - a) / 2 + 0.02;
    v = Math.max(v, 1 - clamp01(Math.abs(p - c) / w));
  }
  return smooth(v);
}

export function activeStageIndex(p: number) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (p >= (i === 0 ? STAGES[0].start - 0.04 : (STAGES[i - 1].end + STAGES[i].start) / 2)) return i;
  }
  return -1;
}

/** Perfume ativo e progresso local (0–1) dentro do seu trecho. */
export function perfumeAt(p: number, n: number) {
  const g = clamp01(p) * n;
  const index = Math.min(n - 1, Math.floor(g));
  return { index, local: g - index };
}

/** Universo contínuo: 0 = primeiro perfume, 1 = segundo… com mistura suave nas fronteiras. */
export function themeMix(p: number, n: number) {
  const g = clamp01(p) * n;
  let v = 0;
  for (let k = 1; k < n; k++) v += smooth(clamp01((g - (k - 0.05)) / 0.1));
  return v;
}

/** 0 = frasco inteiro, 1 = totalmente dissolvido. */
export function dissolveAt(local: number, index: number) {
  const out = smooth(clamp01((local - DISSOLVE_OUT[0]) / (DISSOLVE_OUT[1] - DISSOLVE_OUT[0])));
  const inn = index === 0 ? 0 : 1 - smooth(clamp01((local - DISSOLVE_IN[0]) / (DISSOLVE_IN[1] - DISSOLVE_IN[0])));
  return Math.max(out, inn);
}

/** Ponto de luz que nasce na fronteira entre dois perfumes (0–1). */
export function boundaryGlow(p: number, n: number) {
  const g = clamp01(p) * n;
  let v = 0;
  for (let k = 1; k < n; k++) v = Math.max(v, Math.exp(-(((g - k) / 0.028) ** 2)));
  return v;
}

/** Fase das partículas: −1..0 = convergindo (entrada), 0..1 = explodindo (saída). */
export function burstPhase(local: number, index: number, n: number) {
  if (local > 0.93 && index < n) return clamp01((local - 0.93) / 0.07);
  if (local < 0.07 && index > 0) return -1 + clamp01(local / 0.07);
  return 0;
}
