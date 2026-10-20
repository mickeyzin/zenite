"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { BottleLook } from "@/data/types";

/**
 * Frasco com peças separadas (scripts/models/*). Cada nó do GLB tem um nome:
 * glass, plate, cap, gem, medallion, liquid... Todas as peças, menos o líquido,
 * usam a MESMA textura do modelo original — a aparência dos rótulos e cores é
 * preservada; só o comportamento óptico muda por peça.
 *
 * - glass: vidro com transmissão/refração real (MeshPhysicalMaterial).
 * - liquid: volume interno gerado por voxelização; superfície recortada por um
 *   plano que balança com a rotação do frasco (molinha amortecida).
 * - demais: metal/verniz com os mapas originais.
 * Um GLB sem peças (malha única) continua funcionando como antes.
 */
interface Props {
  url: string;
  /** JSON com pontos do volume do líquido (conservação de volume ao inclinar). */
  liquidPoints?: string;
  look: BottleLook;
  mobile?: boolean;
}

type Std = THREE.MeshStandardMaterial;

const debugLiquid = typeof window !== "undefined" && window.location.search.includes("debug");

function physicalFrom(src: Std, extra: THREE.MeshPhysicalMaterialParameters) {
  return new THREE.MeshPhysicalMaterial({
    map: src.map,
    normalMap: src.normalMap,
    normalScale: src.normalScale?.clone() ?? new THREE.Vector2(1, 1),
    metalnessMap: src.metalnessMap,
    roughnessMap: src.roughnessMap,
    metalness: src.metalness,
    roughness: src.roughness,
    color: src.color.clone(),
    side: THREE.FrontSide,
    envMapIntensity: 1.25,
    ...extra,
  });
}

/** Material do líquido: físico, com recorte por plano e menisco nas faces internas. */
function liquidMaterial(look: NonNullable<BottleLook["liquid"]>) {
  const uniforms = {
    uPlanePoint: { value: new THREE.Vector3() },
    uPlaneNormal: { value: new THREE.Vector3(0, 1, 0) },
    uSurface: { value: new THREE.Color(look.surfaceColor) },
    uTime: { value: 0 },
    uWave: { value: 0.004 },
  };
  const m = new THREE.MeshPhysicalMaterial({
    color: look.color,
    roughness: 0.08,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    sheen: 0.4,
    sheenColor: new THREE.Color(look.surfaceColor),
    side: THREE.DoubleSide,
    envMapIntensity: 1.1,
  });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLiqWorld;")
      .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvLiqWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vLiqWorld;
        uniform vec3 uPlanePoint, uPlaneNormal, uSurface; uniform float uTime, uWave;`,
      )
      .replace(
        "void main() {",
        `void main() {
          vec3 rel = vLiqWorld - uPlanePoint;
          // Ondulação sutil na superfície
          // Ondas: amplitude cresce com a agitação do líquido (uWave).
          float ripple = (sin(rel.x * 14.0 + uTime * 3.1) * 0.6 + sin(rel.z * 11.0 - uTime * 2.3) * 0.4) * uWave
                       + sin((rel.x + rel.z) * 31.0 + uTime * 5.0) * uWave * 0.25;
          float liqD = dot(rel, uPlaneNormal) - ripple;
          if (liqD > 0.0) discard;`,
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
          // Faces internas visíveis = superfície do líquido vista de cima/lado.
          if (!gl_FrontFacing) {
            float edge = 0.75 + 0.25 * sin(uTime * 0.8);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, uSurface * edge * 0.8, 0.45);
          } else {
            // Menisco: faixa clara onde a superfície encontra o vidro.
            gl_FragColor.rgb += uSurface * smoothstep(-0.025, 0.0, liqD) * 1.6;
          }`,
      );
  };
  return { material: m, uniforms };
}

export const PerfumeBottle = forwardRef<THREE.Group, Props>(function PerfumeBottle({ url, liquidPoints, look, mobile }, ref) {
  const { scene } = useGLTF(url);
  const liquidRef = useRef<{ mesh: THREE.Mesh; uniforms: ReturnType<typeof liquidMaterial>["uniforms"]; box: THREE.Box3 } | null>(null);

  const model = useMemo(() => {
    const root = scene.clone(true);
    let liquid: typeof liquidRef.current = null;
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const part = (mesh.name || mesh.parent?.name || "").toLowerCase();
      const src = mesh.material as Std;
      if (part.startsWith("liquid")) {
        if (!look.liquid) {
          mesh.visible = false;
          return;
        }
        const lm = liquidMaterial(look.liquid);
        mesh.material = lm.material;
        mesh.renderOrder = 1;
        mesh.geometry.computeBoundingBox();
        liquid = { mesh, uniforms: lm.uniforms, box: mesh.geometry.boundingBox!.clone() };
      } else if (part.startsWith("body")) {
        const b = look.body ?? { color: "#2b4c97", roughness: 0.4, clearcoat: 0.3 };
        // Corpo opaco: cor sólida (sem a textura, cujo verso o Meshy "inventou").
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: b.color,
          roughness: b.roughness,
          metalness: 0,
          clearcoat: b.clearcoat,
          clearcoatRoughness: 0.25,
          sheen: 0.3,
          sheenColor: new THREE.Color(b.color).multiplyScalar(1.6),
          envMapIntensity: 1.1,
        });
      } else if (part.startsWith("glass") && look.glass) {
        const g = look.glass;
        mesh.material = physicalFrom(src, {
          map: g.useTexture ? src.map : null,
          metalness: 0,
          metalnessMap: null,
          roughnessMap: null,
          roughness: g.roughness,
          transmission: g.transmission,
          thickness: g.thickness,
          ior: 1.5,
          attenuationColor: new THREE.Color(g.attenuationColor),
          attenuationDistance: g.attenuationDistance,
          clearcoat: 1,
          clearcoatRoughness: 0.03,
          specularIntensity: 1,
          color: new THREE.Color(g.tint).multiplyScalar(g.brightness),
        });
      } else {
        // plate, cap, gem/medallion (impressões) e GLB de malha única
        const print = part.startsWith("medallion") || part.startsWith("gem");
        const plate = (part.startsWith("plate") || print) && look.plate;
        mesh.material = physicalFrom(src, {
          clearcoat: print ? 0.8 : 0.6,
          clearcoatRoughness: 0.06,
          side: src.side,
          ...(plate ? { metalness: look.plate!.metalness, roughness: look.plate!.roughness } : {}),
        });
      }
    });
    liquidRef.current = liquid;
    // Normaliza: altura de 2 unidades, centro na origem (mesma regra do modelo antigo).
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 2 / size.y;
    root.scale.setScalar(s);
    root.position.copy(center.multiplyScalar(-s));
    return root;
  }, [scene, look]);

  // Pontos do volume do líquido, no espaço original do GLB.
  const volume = useRef<Float32Array | null>(null);
  useEffect(() => {
    if (!liquidPoints) return;
    let alive = true;
    fetch(liquidPoints)
      .then((r) => r.json())
      .then((j: { points: number[] }) => {
        if (alive) volume.current = new Float32Array(j.points);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [liquidPoints]);

  /*
   * Física do líquido (barata e estável):
   * - a superfície é um plano cuja normal tende ao "para cima" do MUNDO: se o
   *   frasco inclina, o líquido continua nivelado;
   * - a normal é um pêndulo amortecido, empurrado pela aceleração do frasco e
   *   pela sua rotação (o líquido "atrasa" e depois oscila);
   * - a altura do plano é recalculada a cada quadro para que a fração `fill`
   *   dos pontos de volume fique abaixo dele: o volume se conserva.
   */
  const sim = useRef({
    init: false,
    prevQ: new THREE.Quaternion(),
    prevP: new THREE.Vector3(),
    prevV: new THREE.Vector3(),
    prevW: new THREE.Vector3(),
    tilt: new THREE.Vector2(),
    vel: new THREE.Vector2(),
    energy: 0,
    dots: new Float32Array(0),
  });
  const tmp = useMemo(
    () => ({
      q: new THREE.Quaternion(),
      p: new THREE.Vector3(),
      s: new THREE.Vector3(),
      dq: new THREE.Quaternion(),
      w: new THREE.Vector3(),
      v: new THREE.Vector3(),
      a: new THREE.Vector3(),
      n: new THREE.Vector3(),
      x: new THREE.Vector3(),
      pt: new THREE.Vector3(),
      c: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const L = liquidRef.current;
    if (!L || !look.liquid) return;
    const fill = look.liquid.fill;
    const dt = Math.min(Math.max(delta, 1 / 240), 1 / 20);
    const S = sim.current;
    model.updateWorldMatrix(true, false);
    model.matrixWorld.decompose(tmp.p, tmp.q, tmp.s);
    if (!S.init) {
      S.prevQ.copy(tmp.q);
      S.prevP.copy(tmp.p);
      S.init = true;
    }
    // Velocidade angular (vetor no mundo) e aceleração linear.
    tmp.dq.copy(S.prevQ).invert().premultiply(tmp.q);
    if (tmp.dq.w < 0) tmp.dq.set(-tmp.dq.x, -tmp.dq.y, -tmp.dq.z, -tmp.dq.w);
    const ang = 2 * Math.acos(Math.min(1, tmp.dq.w));
    const sinH = Math.sqrt(Math.max(1 - tmp.dq.w * tmp.dq.w, 1e-9));
    tmp.w.set(tmp.dq.x / sinH, tmp.dq.y / sinH, tmp.dq.z / sinH).multiplyScalar(ang / dt);
    tmp.v.subVectors(tmp.p, S.prevP).divideScalar(dt);
    tmp.a.subVectors(tmp.v, S.prevV).divideScalar(dt);
    const alphaY = (tmp.w.y - S.prevW.y) / dt;
    S.prevQ.copy(tmp.q);
    S.prevP.copy(tmp.p);
    S.prevV.copy(tmp.v);
    S.prevW.copy(tmp.w);

    // Eixo X local do frasco projetado no plano horizontal (para o giro em Y).
    tmp.x.set(1, 0, 0).applyQuaternion(tmp.q).setY(0).normalize();
    const clampF = (v: number) => THREE.MathUtils.clamp(v, -40, 40);
    // Excitação: aceleração lateral, rotação em X/Z e aceleração do giro em Y.
    const ex = clampF(-tmp.a.x * 0.09 + tmp.w.z * 0.9 + tmp.x.x * alphaY * 0.035);
    const ez = clampF(-tmp.a.z * 0.09 - tmp.w.x * 0.9 + tmp.x.z * alphaY * 0.035);
    const k = 46; // rigidez (~1,1 Hz)
    const c = 2.1; // amortecimento
    S.vel.x += (-k * S.tilt.x - c * S.vel.x + ex) * dt;
    S.vel.y += (-k * S.tilt.y - c * S.vel.y + ez) * dt;
    S.tilt.x += S.vel.x * dt;
    S.tilt.y += S.vel.y * dt;
    S.tilt.clampLength(0, 0.55);
    S.energy = THREE.MathUtils.damp(S.energy, Math.min(1, S.vel.length() * 0.35 + S.tilt.length() * 1.2), 6, dt);

    tmp.n.set(S.tilt.x, 1, S.tilt.y).normalize();

    // Altura da superfície que conserva o volume.
    const pts = volume.current;
    let offset: number;
    if (pts && pts.length >= 3) {
      const n = pts.length / 3;
      if (S.dots.length !== n) S.dots = new Float32Array(n);
      const e = model.matrixWorld.elements;
      for (let i = 0; i < n; i++) {
        const x = pts[i * 3], y = pts[i * 3 + 1], z = pts[i * 3 + 2];
        const wx = e[0] * x + e[4] * y + e[8] * z + e[12];
        const wy = e[1] * x + e[5] * y + e[9] * z + e[13];
        const wz = e[2] * x + e[6] * y + e[10] * z + e[14];
        S.dots[i] = wx * tmp.n.x + wy * tmp.n.y + wz * tmp.n.z;
      }
      S.dots.sort();
      offset = S.dots[Math.min(n - 1, Math.floor(fill * n))];
    } else {
      // Sem pontos: aproximação pela caixa do líquido.
      L.mesh.updateWorldMatrix(true, false);
      tmp.c.copy(L.box.min).lerp(L.box.max, 0.5).applyMatrix4(L.mesh.matrixWorld);
      const lowY = tmp.pt.copy(L.box.min).applyMatrix4(L.mesh.matrixWorld).y;
      const highY = tmp.pt.copy(L.box.max).applyMatrix4(L.mesh.matrixWorld).y;
      offset = tmp.c.dot(tmp.n) + (Math.min(lowY, highY) + Math.abs(highY - lowY) * fill - tmp.c.y);
    }
    L.uniforms.uPlaneNormal.value.copy(tmp.n);
    L.uniforms.uPlanePoint.value.copy(tmp.n).multiplyScalar(offset);
    L.uniforms.uTime.value = state.clock.elapsedTime;
    L.uniforms.uWave.value = 0.003 + S.energy * 0.03;
    if (debugLiquid) (window as unknown as { __liquid?: object }).__liquid = { tilt: [S.tilt.x, S.tilt.y], energy: S.energy, offset };
  });

  void mobile;
  return (
    <group ref={ref}>
      <primitive object={model} />
    </group>
  );
});
