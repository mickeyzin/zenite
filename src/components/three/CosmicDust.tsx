"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mixUniverse, toColors } from "./universe";

/**
 * Partículas luminosas que flutuam ao redor do frasco. As mais próximas da
 * câmera ficam maiores e desfocadas (bokeh), reforçando a profundidade.
 */
export function CosmicDust({ count = 500, palettes = [["#8fd8ff", "#7d5cff"]] }: { count?: number; palettes?: [string, string][] }) {
  const color = palettes[0][0];
  const color2 = palettes[0][1];
  const pal = useMemo(() => ({ a: toColors(palettes.map((p) => p[0])), b: toColors(palettes.map((p) => p[1])) }), [palettes]);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    let s = 7;
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * 9;
      pos[i * 3 + 1] = (r() - 0.5) * 6;
      pos[i * 3 + 2] = (r() - 0.5) * 9 - 1;
      rnd[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(color) },
      uColor2: { value: new THREE.Color(color2) },
    }),
    [color, color2],
  );

  useFrame((state, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mat.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    mixUniverse(uniforms.uColor.value, pal.a);
    mixUniverse(uniforms.uColor2.value, pal.b);
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          attribute float aRnd; uniform float uTime, uPixelRatio;
          varying float vRnd; varying float vBlur; varying float vFade;
          void main(){
            vRnd = aRnd;
            vec3 p = position;
            float t = uTime * (0.04 + aRnd*0.05);
            p.y = mod(p.y + t + 3.0, 6.0) - 3.0;
            p.x += sin(uTime*0.2 + aRnd*40.0) * 0.15;
            p.z += cos(uTime*0.17 + aRnd*31.0) * 0.15;
            vec4 mv = modelViewMatrix * vec4(p,1.0);
            float dist = -mv.z;
            // Distância do plano de foco (~ frasco)
            vBlur = clamp(abs(dist - 4.6) / 3.5, 0.0, 1.0);
            vFade = smoothstep(3.0, 2.2, abs(p.y)) * smoothstep(0.3, 1.2, dist);
            gl_PointSize = (2.0 + aRnd*2.5 + vBlur*12.0) * uPixelRatio * (4.0 / dist);
            gl_Position = projectionMatrix * mv;
          }`}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor, uColor2;
          varying float vRnd; varying float vBlur; varying float vFade;
          void main(){
            float r = length(gl_PointCoord - 0.5);
            float sharp = smoothstep(0.5, 0.0, r); sharp *= sharp;
            float disc = smoothstep(0.5, 0.3, r);
            float a = mix(sharp, disc*0.18, vBlur) * vFade * (0.35 + vRnd*0.65);
            if (a < 0.005) discard;
            vec3 col = mix(uColor, uColor2, step(0.72, vRnd));
            gl_FragColor = vec4(col * a, a);
          }`}
      />
    </points>
  );
}
