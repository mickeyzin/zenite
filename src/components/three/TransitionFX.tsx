"use client";

import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Efeitos da passagem entre perfumes, controlados de fora (Rig) por valores 0–1:
 * - partículas: `phase` > 0 espalham a partir do frasco que sai; `phase` < 0
 *   convergem para formar o frasco que entra;
 * - ponto de luz: nasce na fronteira entre dois universos.
 */
export interface FXState {
  phase: number;
  glow: number;
  color: THREE.Color;
}

/** Estado dos efeitos, escrito pela cena a cada quadro (fora do React). */
export const fxState: FXState = { phase: 0, glow: 0, color: new THREE.Color() };

export function TransitionFX({ count = 900 }: { count?: number }) {
  const state = fxState;
  const mat = useRef<THREE.ShaderMaterial>(null);
  const flare = useRef<THREE.ShaderMaterial>(null);
  const flareMesh = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    let s = 11;
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    const dir = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = r() * 2 - 1;
      const t = r() * Math.PI * 2;
      const q = Math.sqrt(1 - u * u);
      dir.set([q * Math.cos(t), u, q * Math.sin(t)], i * 3);
      rnd[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(dir, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({ uPhase: { value: 0 }, uTime: { value: 0 }, uColor: { value: new THREE.Color() }, uPixelRatio: { value: 1 } }),
    [],
  );
  const flareUniforms = useMemo(() => ({ uGlow: { value: 0 }, uColor: { value: new THREE.Color() } }), []);

  useFrame((s, dt) => {
    const u = mat.current?.uniforms;
    if (u) {
      u.uPhase.value = state.phase;
      u.uTime.value += dt;
      u.uColor.value.copy(state.color);
      u.uPixelRatio.value = s.gl.getPixelRatio();
    }
    const f = flare.current?.uniforms;
    if (f) {
      f.uGlow.value = state.glow;
      f.uColor.value.copy(state.color);
    }
    if (flareMesh.current) {
      flareMesh.current.visible = state.glow > 0.002;
      flareMesh.current.scale.setScalar(0.6 + state.glow * 2.4);
    }
  });

  return (
    <group>
      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={/* glsl */ `
            attribute float aRnd; uniform float uPhase, uTime, uPixelRatio;
            varying float vA; varying float vR;
            void main(){
              float outP = max(uPhase, 0.0);
              float inP = uPhase < 0.0 ? 1.0 + uPhase : 0.0;
              float isOn = step(0.0001, abs(uPhase));
              // Saída: do frasco para fora, girando. Entrada: de fora para o frasco.
              float r = uPhase >= 0.0 ? mix(0.55, 2.2 + aRnd * 1.6, pow(outP, 0.8)) : mix(2.6 + aRnd * 1.4, 0.5, pow(inP, 1.4));
              float t = uPhase >= 0.0 ? outP : 1.0 - inP;
              float ang = t * (2.0 + aRnd * 3.0) * (aRnd > 0.5 ? 1.0 : -1.0) + uTime * 0.2;
              vec3 d = position;
              float c = cos(ang), s = sin(ang);
              d.xz = mat2(c, -s, s, c) * d.xz;
              vec3 p = d * r * vec3(0.8, 1.35, 0.8);
              p.y += (aRnd - 0.5) * 0.4 * t;
              vA = isOn * sin(3.14159 * clamp(uPhase >= 0.0 ? outP : inP, 0.0, 1.0)) * (0.35 + aRnd * 0.65);
              vR = aRnd;
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_PointSize = (3.5 + aRnd * 7.0) * uPixelRatio * (6.0 / -mv.z);
              gl_Position = projectionMatrix * mv;
            }`}
          fragmentShader={/* glsl */ `
            uniform vec3 uColor; varying float vA; varying float vR;
            void main(){
              float d = length(gl_PointCoord - 0.5);
              float a = smoothstep(0.5, 0.0, d); a *= a;
              a *= vA;
              if (a < 0.003) discard;
              vec3 col = mix(uColor, vec3(1.0), 0.25 + vR * 0.3);
              gl_FragColor = vec4(col * a * 2.6, a);
            }`}
        />
      </points>
      <Billboard>
        <mesh ref={flareMesh} renderOrder={5} visible={false}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={flare}
            uniforms={flareUniforms}
            transparent
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
            fragmentShader={/* glsl */ `
              uniform float uGlow; uniform vec3 uColor; varying vec2 vUv;
              void main(){
                vec2 p = vUv - 0.5; float r = length(p);
                float core = exp(-r * r * 220.0);
                float halo = exp(-r * r * 18.0) * 0.45;
                float rays = (exp(-abs(p.x) * 90.0) * exp(-abs(p.y) * 4.0) + exp(-abs(p.y) * 90.0) * exp(-abs(p.x) * 4.0)) * 0.5;
                float a = (core * 2.5 + halo + rays) * uGlow;
                gl_FragColor = vec4(mix(uColor, vec3(1.0), core) * a, a);
              }`}
          />
        </mesh>
      </Billboard>
    </group>
  );
}
