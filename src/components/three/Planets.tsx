"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { noiseGLSL } from "./shaders/noise";

/**
 * Planetas distantes com bandas atmosféricas procedurais, iluminação de um
 * "sol" fora de quadro e halo atmosférico (fresnel) no lado iluminado.
 */
interface PlanetProps {
  position: [number, number, number];
  radius: number;
  colorA: string;
  colorB: string;
  atmosphere: string;
  sunDir?: [number, number, number];
  bands?: number;
  seed?: number;
  tilt?: number;
}

export function Planet({
  position,
  radius,
  colorA,
  colorB,
  atmosphere,
  sunDir = [1, 0.35, 0.4],
  bands = 7,
  seed = 1,
  tilt = 0.3,
}: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null);
  const sun = useMemo(() => new THREE.Vector3(...sunDir).normalize(), [sunDir]);
  const uniforms = useMemo(
    () => ({
      uA: { value: new THREE.Color(colorA) },
      uB: { value: new THREE.Color(colorB) },
      uAtm: { value: new THREE.Color(atmosphere) },
      uSun: { value: sun },
      uBands: { value: bands },
      uSeed: { value: seed },
    }),
    [colorA, colorB, atmosphere, sun, bands, seed],
  );
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.01;
  });

  return (
    <group position={position} rotation={[0, 0, tilt]}>
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 96, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            varying vec3 vN; varying vec3 vObj; varying vec3 vView;
            void main(){
              vObj = normalize(position);
              vN = normalize(mat3(modelMatrix) * normal);
              vec4 wp = modelMatrix * vec4(position,1.0);
              vView = normalize(cameraPosition - wp.xyz);
              gl_Position = projectionMatrix * viewMatrix * wp;
            }`}
          fragmentShader={/* glsl */ `
            uniform vec3 uA, uB, uAtm, uSun; uniform float uBands, uSeed;
            varying vec3 vN; varying vec3 vObj; varying vec3 vView;
            ${noiseGLSL}
            void main(){
              float lat = vObj.y;
              float turb = fbm(vObj*3.0 + uSeed, 5);
              float b = sin((lat + turb*0.08) * uBands * 3.14159) * 0.5 + 0.5;
              float fine = fbm(vec3(vObj.x*2.0, lat*28.0, vObj.z*2.0) + uSeed, 4)*0.5+0.5;
              vec3 col = mix(uA, uB, b*0.7 + fine*0.3);
              float ndl = dot(normalize(vN), uSun);
              float diff = smoothstep(-0.15, 0.6, ndl);
              float fres = pow(1.0 - max(dot(normalize(vN), vView), 0.0), 3.0);
              vec3 c = col * diff * 0.9 + uAtm * fres * smoothstep(-0.3, 0.5, ndl) * 1.4;
              gl_FragColor = vec4(c, 1.0);
            }`}
        />
      </mesh>
      {/* Halo atmosférico */}
      <mesh scale={1.06}>
        <sphereGeometry args={[radius, 64, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            varying vec3 vN; varying vec3 vView;
            void main(){
              vN = normalize(mat3(modelMatrix) * normal);
              vec4 wp = modelMatrix * vec4(position,1.0);
              vView = normalize(cameraPosition - wp.xyz);
              gl_Position = projectionMatrix * viewMatrix * wp;
            }`}
          fragmentShader={/* glsl */ `
            uniform vec3 uAtm, uSun; varying vec3 vN; varying vec3 vView;
            void main(){
              float f = pow(1.0 - abs(dot(normalize(vN), vView)), 2.5);
              float lit = smoothstep(-0.4, 0.6, dot(-normalize(vN), uSun) * -1.0);
              float a = (1.0 - f) * f * 3.0 * lit;
              gl_FragColor = vec4(uAtm * a, a);
            }`}
        />
      </mesh>
    </group>
  );
}
