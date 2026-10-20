"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { noiseGLSL } from "./shaders/noise";
import type { UniverseTheme } from "@/data/types";

/**
 * Esfera de fundo com uma galáxia procedural: faixa galáctica inclinada,
 * nuvens de gás com domain warping, faixas de poeira escura e micro-estrelas.
 * Tudo calculado por direção de visão — não é uma textura plana.
 *
 * Desempenho: o shader é caro, então ele é renderizado UMA vez num cubemap
 * (CubeCamera) que vira o fundo da cena. O vidro refrata esse fundo sem custo extra.
 */
export function NebulaSky({ theme, octaves = 6, resolution = 1024 }: { theme: UniverseTheme; octaves?: number; resolution?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const gl = useThree((s) => s.gl);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(theme.deep) },
      uMid: { value: new THREE.Color(theme.mid) },
      uGlow: { value: new THREE.Color(theme.glow) },
      uAccent: { value: new THREE.Color(theme.accent) },
      uViolet: { value: new THREE.Color("#5a2bd6") },
    }),
    // As cores são atualizadas no efeito de "bake" abaixo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const rt = useMemo(
    () => new THREE.WebGLCubeRenderTarget(resolution, { type: THREE.HalfFloatType, generateMipmaps: false }),
    [resolution],
  );

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    // Atualiza as cores do universo antes de "fotografar" o céu (troca de perfume).
    uniforms.uDeep.value.set(theme.deep);
    uniforms.uMid.value.set(theme.mid);
    uniforms.uGlow.value.set(theme.glow);
    uniforms.uAccent.value.set(theme.accent);
    const parent = m.parent;
    const bake = new THREE.Scene();
    bake.add(m);
    m.visible = true;
    new THREE.CubeCamera(0.1, 200, rt).update(gl, bake);
    m.visible = false;
    parent?.add(m);
  }, [gl, rt, octaves, uniforms, theme.deep, theme.mid, theme.glow, theme.accent]);

  useLayoutEffect(() => () => rt.dispose(), [rt]);

  return (
    <>
    <primitive attach="background" object={rt.texture} />
    <mesh ref={mesh} renderOrder={-10} frustumCulled={false} visible={false}>
      <sphereGeometry args={[80, 64, 32]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vDir;
          void main(){
            vDir = normalize(position);
            vec4 p = modelViewMatrix * vec4(position,1.0);
            gl_Position = projectionMatrix * p;
          }`}
        fragmentShader={/* glsl */ `
          uniform float uTime; uniform vec3 uDeep, uMid, uGlow, uAccent, uViolet;
          varying vec3 vDir;
          ${noiseGLSL}
          float hash(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
          void main(){
            vec3 d = normalize(vDir);
            float t = uTime * 0.004;
            // Plano galáctico inclinado
            vec3 n = normalize(vec3(0.25, 1.0, -0.35));
            float h = dot(d, n);
            float band = exp(-h*h*9.0);
            float core = exp(-h*h*40.0);
            // Domain warping para gás com estrutura filamentar
            vec3 q = d*2.2 + vec3(t, 0.0, -t);
            vec3 w = vec3(fbm(q, 4), fbm(q+vec3(5.2,1.3,2.8), 4), fbm(q+vec3(1.7,9.2,4.1), 4));
            float gas = fbm(q*1.3 + w*1.4, ${octaves}) * 0.5 + 0.5;
            float gas2 = fbm(d*5.0 + w*0.8 + 11.0, 5) * 0.5 + 0.5;
            float dust = smoothstep(0.45, 0.8, fbm(d*3.4 + w*1.1 + 3.0, 5)*0.5+0.5);
            // Concentração luminosa numa direção (núcleo distante da galáxia)
            float bulge = pow(max(dot(d, normalize(vec3(-0.55, 0.12, -0.83))), 0.0), 6.0);

            vec3 col = uDeep;
            float dens = band * smoothstep(0.32, 0.95, gas);
            col = mix(col, uMid, dens * 0.75);
            col += uGlow * pow(dens, 2.6) * 0.8;
            col += uViolet * smoothstep(0.6, 1.0, gas2) * band * 0.1;
            col += uAccent * pow(core * gas, 3.0) * 0.6;
            col += mix(uGlow, vec3(1.0, 0.93, 0.85), 0.35) * bulge * (0.5 + gas) * 0.55;
            col *= 1.0 - dust * band * 0.85;
            // Halo tênue fora do plano para evitar preto chapado
            col += uMid * 0.06 * (gas2 - 0.3);

            // Micro-estrelas (o campo distante; as próximas são partículas reais)
            vec3 cell = floor(d * 420.0);
            float r = hash(cell);
            float star = step(0.9965, r) * (0.4 + 0.6*hash(cell+7.0));
            vec3 local = fract(d*420.0) - 0.5;
            star *= smoothstep(0.35, 0.0, length(local));
            col += star * mix(vec3(0.8,0.9,1.0), uAccent, hash(cell+3.0)*0.5) * (0.6 + band);

            gl_FragColor = vec4(max(col, 0.0), 1.0);
          }`}
      />
    </mesh>
    </>
  );
}
