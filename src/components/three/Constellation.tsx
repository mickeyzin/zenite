"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { experienceState } from "@/lib/experience-state";
import { clamp01, perfumeAt, sampleShot, type Shot } from "@/lib/timeline";

/**
 * Final da apresentação: estrelas espalhadas voam até formar uma constelação e
 * se ligam por traços de luz. A última estrela fica embaixo, no centro da tela
 * (ZENITE_ANCHOR): é dali que a Linha Zênite (SVG, no DOM) continua pela página.
 *
 * O desenho é definido em coordenadas de TELA (NDC) e projetado com a câmera do
 * último quadro da apresentação, então a estrela-âncora cai no mesmo ponto em
 * qualquer proporção de tela.
 */

/** Posição da estrela-âncora na tela: x 50%, y 86% (a Linha Zênite parte daqui). */
export const ZENITE_ANCHOR = { x: 0.5, y: 0.86 };

// Constelação em NDC (−1..1). Termina na âncora (x 0, y −0,72 ⇔ 86% da altura).
const SHAPE_DESKTOP: [number, number][] = [
  [-0.62, 0.22],
  [-0.38, 0.4],
  [-0.12, 0.24],
  [0.1, 0.44],
  [0.36, 0.26],
  [0.2, -0.18],
  [0, -0.72],
];
const SHAPE_MOBILE: [number, number][] = [
  [-0.7, 0.42],
  [-0.3, 0.56],
  [0.05, 0.4],
  [0.55, 0.5],
  [0.62, 0.12],
  [0.18, -0.2],
  [0, -0.72],
];

const smooth = (t: number) => t * t * (3 - 2 * t);

function scatter(count: number) {
  let seed = 5;
  const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: count }, () => new THREE.Vector3((r() - 0.5) * 30, (r() - 0.5) * 18, -10 - r() * 20));
}

export function Constellation({ shots, n, mobile }: { shots: Shot[]; n: number; mobile: boolean }) {
  const size = useThree((s) => s.size);
  const points = useRef<THREE.Points>(null);
  const line = useRef<THREE.Line>(null);
  const prog = useRef(0);

  const layout = useMemo(() => {
    const shape = mobile ? SHAPE_MOBILE : SHAPE_DESKTOP;
    // Câmera virtual igual à do último quadro (p = 1 do último perfume).
    const s = sampleShot(shots, 1, { cam: [0, 0, 0], look: [0, 0, 0], rot: 0, offset: [0, 0], fov: 30 });
    const cam = new THREE.PerspectiveCamera(s.fov, size.width / Math.max(1, size.height), 0.1, 200);
    cam.position.set(...s.cam);
    cam.lookAt(new THREE.Vector3(...s.look));
    cam.updateMatrixWorld();
    // Projeta cada ponto da tela num plano a 7 unidades da câmera (à frente do frasco).
    const dir = new THREE.Vector3();
    const end = shape.map(([x, y]) => {
      dir.set(x, y, 0.5).unproject(cam).sub(cam.position).normalize();
      return cam.position.clone().addScaledVector(dir, 7);
    });
    // Pontos de partida: estrelas espalhadas no fundo (determinísticos).
    return { end, start: scatter(end.length) };
  }, [shots, size.width, size.height, mobile]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(layout.end.length * 3), 3));
    const sizes = new Float32Array(layout.end.length).map((_, i) => (i === layout.end.length - 1 ? 2.3 : 0.8 + (i % 3) * 0.25));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [layout]);

  const lineObj = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(layout.end.length * 3), 3));
    // Cor acima de 1: o bloom transforma o traço fino num fio de luz.
    const m = new THREE.LineBasicMaterial({ color: new THREE.Color(1.6, 2.2, 2.6), transparent: true, opacity: 0.75, depthTest: false, depthWrite: false, toneMapped: false });
    const l = new THREE.Line(g, m);
    l.frustumCulled = false;
    l.visible = false;
    l.renderOrder = 6;
    return l;
  }, [layout]);
  // Buffers de trabalho do loop (mutáveis, fora do ciclo de render do React).
  const work = useRef<{ pts: THREE.Vector3[]; flat: Float32Array; tmp: THREE.Vector3 } | null>(null);

  useFrame((state, delta) => {
    const { index, local } = perfumeAt(experienceState.progress, n);
    const target = index === n - 1 ? clamp01((local - 0.95) / 0.045) : 0;
    prog.current = THREE.MathUtils.damp(prog.current, target, 8, Math.min(delta, 0.1));
    const c = prog.current;
    const pts = points.current;
    if (!pts) return;
    const m = layout.end.length;
    if (!work.current || work.current.pts.length !== m) {
      work.current = { pts: layout.end.map((v) => v.clone()), flat: new Float32Array(m * 3), tmp: new THREE.Vector3() };
    }
    const { pts: linePts, flat, tmp } = work.current;
    pts.visible = c > 0.001;
    const mat = pts.material as THREE.ShaderMaterial;
    mat.uniforms.uAlpha.value = smooth(clamp01(c * 2.5));
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // Estrelas: cada uma parte com um pequeno atraso e chega com suavidade.
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < m; i++) {
      const k = smooth(clamp01((c * 1.35 - i * 0.05) / 0.85));
      tmp.copy(layout.start[i]).lerp(layout.end[i], k);
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
      linePts[i].copy(tmp);
    }
    pos.needsUpdate = true;

    // Traços: desenhados em sequência, do primeiro até a âncora.
    const draw = clamp01((c - 0.55) / 0.45) * (m - 1);
    const l = line.current;
    if (l) {
      l.visible = draw > 0.001;
      let w = 0;
      for (let i = 0; i < m; i++) {
        const seg = Math.min(i, draw);
        const a = Math.floor(seg);
        const f = seg - a;
        const p = a >= m - 1 ? linePts[m - 1] : tmp.copy(linePts[a]).lerp(linePts[a + 1], f);
        flat[w++] = p.x;
        flat[w++] = p.y;
        flat[w++] = p.z;
      }
      const lp = l.geometry.attributes.position as THREE.BufferAttribute;
      (lp.array as Float32Array).set(flat);
      lp.needsUpdate = true;
    }
  });

  return (
    <group>
      <primitive ref={line} object={lineObj} />
      <points ref={points} geometry={geo} frustumCulled={false} visible={false} renderOrder={6}>
        <shaderMaterial
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uAlpha: { value: 0 }, uTime: { value: 0 } }}
          vertexShader={/* glsl */ `
            attribute float aSize; uniform float uTime; varying float vS;
            void main(){
              vS = aSize;
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              float tw = 0.85 + 0.15 * sin(uTime * 2.0 + position.x * 3.0);
              gl_PointSize = aSize * 34.0 * tw * (7.0 / -mv.z);
              gl_Position = projectionMatrix * mv;
            }`}
          fragmentShader={/* glsl */ `
            uniform float uAlpha; varying float vS;
            void main(){
              vec2 p = gl_PointCoord - 0.5; float r = length(p);
              float core = exp(-r * r * 90.0);
              float halo = exp(-r * r * 14.0) * 0.4;
              float rays = (exp(-abs(p.x) * 70.0) + exp(-abs(p.y) * 70.0)) * smoothstep(0.5, 0.0, r) * 0.5;
              float a = (core * 1.6 + halo + rays) * uAlpha;
              if (a < 0.004) discard;
              gl_FragColor = vec4(mix(vec3(0.75, 0.92, 1.0), vec3(1.0), core) * a, a);
            }`}
        />
      </points>
    </group>
  );
}
