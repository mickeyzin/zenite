"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef } from "react";
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
  look: BottleLook;
  mobile?: boolean;
}

type Std = THREE.MeshStandardMaterial;

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
function liquidMaterial(look: BottleLook["liquid"]) {
  const uniforms = {
    uPlanePoint: { value: new THREE.Vector3() },
    uPlaneNormal: { value: new THREE.Vector3(0, 1, 0) },
    uSurface: { value: new THREE.Color(look.surfaceColor) },
    uTime: { value: 0 },
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
        uniform vec3 uPlanePoint, uPlaneNormal, uSurface; uniform float uTime;`,
      )
      .replace(
        "void main() {",
        `void main() {
          vec3 rel = vLiqWorld - uPlanePoint;
          // Ondulação sutil na superfície
          float ripple = sin(rel.x * 18.0 + uTime * 2.1) * sin(rel.z * 15.0 - uTime * 1.7) * 0.004;
          float liqD = dot(rel, uPlaneNormal) - ripple;
          if (liqD > 0.0) discard;`,
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
          // Faces internas visíveis = superfície do líquido vista de cima/lado.
          if (!gl_FrontFacing) {
            float edge = 0.75 + 0.25 * sin(uTime * 0.8);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, uSurface * edge, 0.75);
          } else {
            // Menisco: faixa clara onde a superfície encontra o vidro.
            gl_FragColor.rgb += uSurface * smoothstep(-0.025, 0.0, liqD) * 1.6;
          }`,
      );
  };
  return { material: m, uniforms };
}

export const PerfumeBottle = forwardRef<THREE.Group, Props>(function PerfumeBottle({ url, look, mobile }, ref) {
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
        const lm = liquidMaterial(look.liquid);
        mesh.material = lm.material;
        mesh.renderOrder = 1;
        mesh.geometry.computeBoundingBox();
        liquid = { mesh, uniforms: lm.uniforms, box: mesh.geometry.boundingBox!.clone() };
      } else if (part.startsWith("glass")) {
        const g = look.glass;
        mesh.material = physicalFrom(src, {
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
          color: new THREE.Color(1, 1, 1).multiplyScalar(g.brightness),
        });
      } else if (part.startsWith("gem")) {
        mesh.material = physicalFrom(src, { metalness: 0.1, roughness: 0.04, roughnessMap: null, clearcoat: 1, clearcoatRoughness: 0.02, iridescence: 0.25, envMapIntensity: 1.6 });
      } else {
        // plate, cap, medallion e GLB de malha única
        mesh.material = physicalFrom(src, { clearcoat: part.startsWith("medallion") ? 1 : 0.6, clearcoatRoughness: 0.06, side: src.side });
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

  // Molinha amortecida: o balanço do líquido responde à velocidade de rotação/translação.
  const sim = useRef({
    prevQ: new THREE.Quaternion(),
    prevP: new THREE.Vector3(),
    tilt: new THREE.Vector2(),
    vel: new THREE.Vector2(),
    init: false,
  });
  const tmp = useMemo(
    () => ({ q: new THREE.Quaternion(), p: new THREE.Vector3(), dq: new THREE.Quaternion(), e: new THREE.Euler(), min: new THREE.Vector3(), max: new THREE.Vector3(), c: new THREE.Vector3() }),
    [],
  );

  useFrame((state, delta) => {
    const L = liquidRef.current;
    if (!L) return;
    const dt = Math.min(delta, 1 / 20);
    const m = L.mesh;
    m.updateWorldMatrix(true, false);
    m.matrixWorld.decompose(tmp.p, tmp.q, tmp.c);
    const S = sim.current;
    if (!S.init) {
      S.prevQ.copy(tmp.q);
      S.prevP.copy(tmp.p);
      S.init = true;
    }
    // Velocidade angular (rad/s) em torno de Y e deslocamento lateral.
    tmp.dq.copy(S.prevQ).invert().premultiply(tmp.q);
    tmp.e.setFromQuaternion(tmp.dq);
    const angVel = tmp.e.y / Math.max(dt, 1e-4);
    const linVel = (tmp.p.x - S.prevP.x) / Math.max(dt, 1e-4);
    S.prevQ.copy(tmp.q);
    S.prevP.copy(tmp.p);
    // Força → inclinação desejada; mola (k) com amortecimento (c).
    const k = 38, c = 3.2;
    const fx = THREE.MathUtils.clamp(-linVel * 0.05 + angVel * 0.035, -0.6, 0.6);
    const fz = THREE.MathUtils.clamp(angVel * 0.05, -0.6, 0.6);
    S.vel.x += (-k * S.tilt.x - c * S.vel.x + fx * k * 0.2) * dt;
    S.vel.y += (-k * S.tilt.y - c * S.vel.y + fz * k * 0.2) * dt;
    S.tilt.x += S.vel.x * dt;
    S.tilt.y += S.vel.y * dt;
    S.tilt.clampLength(0, 0.35);

    // Plano da superfície em coordenadas de mundo.
    tmp.min.copy(L.box.min).applyMatrix4(m.matrixWorld);
    tmp.max.copy(L.box.max).applyMatrix4(m.matrixWorld);
    const lowY = Math.min(tmp.min.y, tmp.max.y);
    const highY = Math.max(tmp.min.y, tmp.max.y);
    tmp.c.addVectors(tmp.min, tmp.max).multiplyScalar(0.5);
    L.uniforms.uPlanePoint.value.set(tmp.c.x, lowY + (highY - lowY) * look.liquid.fill, tmp.c.z);
    L.uniforms.uPlaneNormal.value.set(S.tilt.x, 1, S.tilt.y).normalize();
    L.uniforms.uTime.value = state.clock.elapsedTime;
  });

  void mobile;
  return (
    <group ref={ref}>
      <primitive object={model} />
    </group>
  );
});
