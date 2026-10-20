"use client";

import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { noiseGLSL } from "./shaders/noise";
import { mixUniverse, toColors } from "./universe";

/**
 * Camadas de gás semitransparentes em profundidades diferentes. Com o
 * movimento da câmera elas se deslocam em paralaxe, o que dá a sensação de
 * volume sem o custo de um ray-march volumétrico completo.
 */
export interface NebulaCloud {
  position: [number, number, number];
  scale: number;
  /** Uma cor por universo (o componente mistura conforme o scroll). */
  color: string[];
  color2: string[];
  opacity: number;
  seed: number;
}

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

const fragment = /* glsl */ `
  uniform float uTime, uOpacity, uSeed; uniform vec3 uColor, uColor2;
  varying vec2 vUv;
  ${noiseGLSL}
  void main(){
    vec2 p = vUv - 0.5;
    float r = length(p);
    float t = uTime * 0.012;
    vec3 q = vec3(p*2.6, uSeed + t);
    vec2 warp = vec2(fbm(q, 4), fbm(q + 4.7, 4));
    float n = fbm(vec3(p*3.2 + warp*0.9, uSeed*1.7 - t), 5) * 0.5 + 0.5;
    float fall = smoothstep(0.5, 0.05, r);
    float a = pow(smoothstep(0.35, 1.0, n), 1.6) * fall;
    // Filamentos mais brilhantes nas bordas das nuvens
    float rim = smoothstep(0.55, 0.62, n) * (1.0 - smoothstep(0.62, 0.8, n));
    vec3 col = mix(uColor, uColor2, smoothstep(0.4, 0.9, n));
    col += uColor2 * rim * 0.6;
    gl_FragColor = vec4(col * a * uOpacity, a * uOpacity);
  }
`;

function Cloud({ c }: { c: NebulaCloud }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: c.opacity },
      uSeed: { value: c.seed },
      uColor: { value: new THREE.Color(c.color[0]) },
      uColor2: { value: new THREE.Color(c.color2[0]) },
    }),
    [c],
  );
  const pal = useMemo(() => ({ a: toColors(c.color), b: toColors(c.color2) }), [c]);
  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mixUniverse(uniforms.uColor.value, pal.a);
    mixUniverse(uniforms.uColor2.value, pal.b);
  });
  return (
    <Billboard position={c.position}>
      <mesh scale={c.scale} renderOrder={-5}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Billboard>
  );
}

export function NebulaLayers({ clouds }: { clouds: NebulaCloud[] }) {
  return (
    <group>
      {clouds.map((c, i) => (
        <Cloud key={i} c={c} />
      ))}
    </group>
  );
}
