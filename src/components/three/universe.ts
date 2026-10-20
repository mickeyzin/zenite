import * as THREE from "three";
import { experienceState } from "@/lib/experience-state";

/** Converte listas de cores (uma por universo) em THREE.Color, uma vez. */
export const toColors = (list: string[]) => list.map((c) => new THREE.Color(c));

/** Mistura a cor do universo atual com a do próximo, conforme o scroll. */
export function mixUniverse(out: THREE.Color, colors: THREE.Color[]) {
  if (colors.length === 1) return out.copy(colors[0]);
  const u = THREE.MathUtils.clamp(experienceState.universe, 0, colors.length - 1);
  const a = Math.floor(u);
  const b = Math.min(colors.length - 1, a + 1);
  return out.copy(colors[a]).lerp(colors[b], u - a);
}
