"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { UniverseTheme } from "@/data/types";
import { experienceState } from "@/lib/experience-state";
import { SKY_VERTEX, skyFragment, skyUniforms } from "./NebulaSky";

/**
 * Céu de vários universos. O shader procedural da galáxia é "fotografado" uma
 * vez por universo (cubemaps, no carregamento) e uma esfera de fundo mistura os
 * dois universos vizinhos conforme `experienceState.universe`. A mistura custa
 * duas leituras de textura por pixel — nada de shader pesado durante o scroll.
 */
export function SkyBlend({ themes, resolution = 768, octaves = 6 }: { themes: UniverseTheme[]; resolution?: number; octaves?: number }) {
  const gl = useThree((s) => s.gl);
  const targets = useMemo(
    () => themes.map(() => new THREE.WebGLCubeRenderTarget(resolution, { type: THREE.HalfFloatType, generateMipmaps: false })),
    [themes, resolution],
  );

  useLayoutEffect(() => {
    const bake = new THREE.Scene();
    const mat = new THREE.ShaderMaterial({ vertexShader: SKY_VERTEX, fragmentShader: skyFragment(octaves), side: THREE.BackSide, depthWrite: false, uniforms: skyUniforms(themes[0]) });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(80, 64, 32), mat);
    bake.add(mesh);
    themes.forEach((th, i) => {
      mat.uniforms.uDeep.value.set(th.deep);
      mat.uniforms.uMid.value.set(th.mid);
      mat.uniforms.uGlow.value.set(th.glow);
      mat.uniforms.uAccent.value.set(th.accent);
      new THREE.CubeCamera(0.1, 200, targets[i]).update(gl, bake);
    });
    mesh.geometry.dispose();
    mat.dispose();
  }, [gl, targets, themes, octaves]);

  useLayoutEffect(() => () => targets.forEach((t) => t.dispose()), [targets]);

  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uA: { value: targets[0].texture }, uB: { value: targets[Math.min(1, targets.length - 1)].texture }, uMix: { value: 0 } }),
    [targets],
  );

  useFrame(() => {
    const u = THREE.MathUtils.clamp(experienceState.universe, 0, targets.length - 1);
    const a = Math.floor(u);
    const b = Math.min(targets.length - 1, a + 1);
    const m = material.current;
    if (!m) return;
    m.uniforms.uA.value = targets[a].texture;
    m.uniforms.uB.value = targets[b].texture;
    m.uniforms.uMix.value = u - a;
  });

  return (
    <mesh renderOrder={-10} frustumCulled={false} scale={90}>
      <sphereGeometry args={[1, 48, 24]} />
      <shaderMaterial
        ref={material}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vDir;
          void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={/* glsl */ `
          uniform samplerCube uA, uB; uniform float uMix; varying vec3 vDir;
          void main(){
            vec3 d = normalize(vDir);
            vec3 a = textureCube(uA, d).rgb;
            vec3 b = textureCube(uB, d).rgb;
            // Transição com "onda" de cor que atravessa o céu, não um fade chapado.
            float sweep = smoothstep(-0.25, 0.25, uMix * 2.6 - 1.3 + d.x * 0.45 + d.y * 0.2);
            gl_FragColor = vec4(mix(a, b, sweep), 1.0);
          }`}
      />
    </mesh>
  );
}
