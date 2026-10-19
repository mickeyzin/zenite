/**
 * Estado mutável compartilhado entre o DOM (GSAP/ScrollTrigger) e o loop do
 * React Three Fiber. Fica fora do React para não causar re-render a cada frame.
 */
export const experienceState = {
  /** Progresso suavizado (0–1) da seção cinematográfica, vindo do scrub do GSAP. */
  progress: 0,
  /** Ponteiro normalizado (-1..1) para paralaxe sutil no desktop. */
  pointer: { x: 0, y: 0 },
  /** Ativado quando a página roda sem animações (prefers-reduced-motion). */
  reducedMotion: false,
};
