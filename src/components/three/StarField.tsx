"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Estrelas como partículas reais em três faixas de profundidade.
 * Tamanho por magnitude, núcleo gaussiano, cintilação e pequenos raios de
 * difração nas mais brilhantes.
 */
interface Props {
  count: number;
  radius: [number, number];
  colors: string[];
  size?: number;
  seed?: number;
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function StarField({ count, radius, colors, size = 1, seed = 1 }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const r = rand(seed * 9973);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const mag = new Float32Array(count);
    const pal = colors.map((c) => new THREE.Color(c));
    for (let i = 0; i < count; i++) {
      // Distribuição esférica com leve concentração no plano galáctico
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const flat = 0.55 + 0.45 * r();
      const s = Math.sqrt(1 - u * u);
      const d = radius[0] + (radius[1] - radius[0]) * Math.pow(r(), 0.8);
      pos[i * 3] = s * Math.cos(th) * d;
      pos[i * 3 + 1] = u * d * flat;
      pos[i * 3 + 2] = s * Math.sin(th) * d;
      const c = pal[Math.floor(r() * pal.length)];
      col.set([c.r, c.g, c.b], i * 3);
      mag[i] = Math.pow(r(), 6); // poucas estrelas muito brilhantes
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aMag", new THREE.BufferAttribute(mag, 1));
    return g;
  }, [count, radius, colors, seed]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: size }, uPixelRatio: { value: 1 } }),
    [size],
  );

  useFrame((state, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mat.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return (
    <points geometry={geo} frustumCulled={false} renderOrder={-4}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        vertexShader={/* glsl */ `
          attribute float aMag; uniform float uTime, uSize, uPixelRatio;
          varying vec3 vColor; varying float vMag; varying float vTw;
          void main(){
            vColor = color; vMag = aMag;
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            float ph = position.x*12.9898 + position.y*78.233;
            vTw = 0.75 + 0.25*sin(uTime*(0.6+fract(ph)*1.8) + ph);
            gl_PointSize = (1.4 + aMag*9.0) * uSize * uPixelRatio * (40.0 / -mv.z);
            gl_PointSize = clamp(gl_PointSize, 1.0, 48.0);
            gl_Position = projectionMatrix * mv;
          }`}
        fragmentShader={/* glsl */ `
          varying vec3 vColor; varying float vMag; varying float vTw;
          void main(){
            vec2 p = gl_PointCoord - 0.5;
            float r = length(p);
            float core = exp(-r*r*60.0);
            float halo = exp(-r*r*10.0) * 0.35;
            float spikes = (exp(-abs(p.x)*60.0) + exp(-abs(p.y)*60.0)) * smoothstep(0.5, 0.0, r) * smoothstep(0.25, 0.8, vMag);
            float a = (core + halo + spikes*0.6) * vTw;
            if (a < 0.01) discard;
            gl_FragColor = vec4(vColor * a * (0.7 + vMag*1.8), a);
          }`}
      />
    </points>
  );
}
