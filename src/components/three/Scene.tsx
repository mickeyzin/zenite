"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Perfume } from "@/data/types";
import { experienceState } from "@/lib/experience-state";
import { DESKTOP_SHOTS, MOBILE_SHOTS, sampleShot, transitionPulse, type Shot } from "@/lib/timeline";
import { BackHalo } from "./BackHalo";
import { CosmicDust } from "./CosmicDust";
import { NebulaLayers, type NebulaCloud } from "./NebulaLayers";
import { NebulaSky } from "./NebulaSky";
import { PerfumeBottle } from "./PerfumeBottle";
import { Planet } from "./Planets";
import { StarField } from "./StarField";

export type Quality = "high" | "low";

interface SceneProps {
  perfume: Perfume;
  mobile: boolean;
  quality: Quality;
}

const damp = THREE.MathUtils.damp;

function Universe({ perfume, quality }: SceneProps) {
  const th = perfume.theme;
  const low = quality === "low";
  const clouds = useMemo<NebulaCloud[]>(
    () => [
      { position: [-9, 3, -26], scale: 30, color: "#05207f", color2: th.glow, opacity: 0.3, seed: 1.3 },
      { position: [11, -2, -32], scale: 34, color: "#071a66", color2: "#1f6bff", opacity: 0.2, seed: 4.1 },
      { position: [2, 6, -40], scale: 40, color: "#031650", color2: th.accent, opacity: 0.18, seed: 7.7 },
      { position: [-4, -5, -18], scale: 16, color: "#062a86", color2: th.accent, opacity: 0.14, seed: 2.9 },
      { position: [6, 2.5, -14], scale: 10, color: "#0d2a9a", color2: "#7d5cff", opacity: 0.08, seed: 9.4 },
    ],
    [th],
  );

  return (
    <>
      <NebulaSky theme={th} octaves={low ? 5 : 6} resolution={low ? 512 : 1024} />
      <NebulaLayers clouds={low ? clouds.slice(0, 3) : clouds} />
      <StarField count={low ? 1500 : 4000} radius={[38, 70]} colors={th.stars} size={0.9} seed={1} />
      <StarField count={low ? 500 : 1400} radius={[16, 36]} colors={th.stars} size={0.75} seed={2} />
      <StarField count={low ? 120 : 260} radius={[8, 15]} colors={th.stars} size={0.45} seed={3} />
      <Planet position={[-26, -15, -48]} radius={13} colorA="#06163f" colorB="#1d4fae" atmosphere="#3b8bff" sunDir={[0.9, 0.5, 0.35]} bands={9} seed={2.2} tilt={0.35} />
      <Planet position={[24, 15, -55]} radius={2.4} colorA="#9fb4d9" colorB="#e6eefc" atmosphere="#8fdcff" sunDir={[-0.6, 0.4, 0.5]} bands={3} seed={6.1} tilt={-0.2} />
      <CosmicDust count={low ? 220 : 520} color="#9fe3ff" color2="#a65cff" />
    </>
  );
}

function Rig({ perfume, mobile, quality }: SceneProps) {
  const bottleOffset = useRef<THREE.Group>(null);
  const bottleSpin = useRef<THREE.Group>(null);
  const key = useRef<THREE.SpotLight>(null);
  const rimA = useRef<THREE.SpotLight>(null);
  const rimB = useRef<THREE.SpotLight>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const th = perfume.theme;
  const shots = mobile ? MOBILE_SHOTS : DESKTOP_SHOTS;
  const frontRotationY = perfume.frontRotationY;

  // Diretor: lê o scroll e move câmera, frasco e luzes no mesmo frame.
  const shot = useMemo(
    () => ({ cam: [0, 0, 0] as Shot["cam"], look: [0, 0, 0] as Shot["look"], rot: 0, offset: [0, 0] as Shot["offset"], fov: 30 }),
    [],
  );
  const look = useMemo(() => new THREE.Vector3(), []);
  const smoothed = useRef({ p: experienceState.progress, px: 0, py: 0 });

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const dt = Math.min(delta, 1 / 10);
    const s = smoothed.current;
    // O GSAP já suaviza o scroll; este damping extra só tira microtrancos.
    s.p = damp(s.p, experienceState.progress, 9, dt);
    const reduced = experienceState.reducedMotion;
    s.px = damp(s.px, mobile || reduced ? 0 : experienceState.pointer.x, 2.5, dt);
    s.py = damp(s.py, mobile || reduced ? 0 : experienceState.pointer.y, 2.5, dt);

    sampleShot(shots, s.p, shot);
    const t = state.clock.elapsedTime;
    const idle = reduced ? 0 : 1;

    camera.position.set(shot.cam[0] + s.px * 0.18, shot.cam[1] + s.py * 0.12, shot.cam[2]);
    look.set(shot.look[0], shot.look[1], shot.look[2]);
    camera.lookAt(look);
    if (Math.abs(camera.fov - shot.fov) > 0.01) {
      camera.fov = shot.fov;
      camera.updateProjectionMatrix();
    }

    if (bottleOffset.current) {
      bottleOffset.current.position.set(shot.offset[0], shot.offset[1] + Math.sin(t * 0.7) * 0.025 * idle, 0);
    }
    if (bottleSpin.current) {
      bottleSpin.current.rotation.y = frontRotationY + shot.rot + Math.sin(t * 0.45) * 0.025 * idle;
      bottleSpin.current.rotation.z = Math.sin(t * 0.33) * 0.008 * idle;
    }

    // A luz acompanha a rotação: a chave orbita a meio passo do frasco e a
    // varredura cruza a superfície durante cada virada de etapa.
    const pulse = transitionPulse(s.p);
    const orbit = shot.rot * 0.85;
    if (key.current) {
      key.current.position.set(Math.sin(orbit - 0.7) * 6 + shot.offset[0], 4.5, Math.cos(orbit - 0.7) * 6);
      key.current.target.position.set(shot.offset[0], 0, 0);
      key.current.target.updateMatrixWorld();
    }
    if (rimA.current) rimA.current.intensity = 140 + pulse * 120;
    if (rimB.current) rimB.current.intensity = 110 + pulse * 90;
    if (sweep.current) {
      const a = shot.rot * 1.6;
      sweep.current.position.set(shot.offset[0] + Math.sin(a) * 2.2, 0.6, Math.cos(a) * 2.2 + 1.2);
      sweep.current.intensity = pulse * 14;
    }
  });


  return (
    <>
      <Universe perfume={perfume} mobile={mobile} quality={quality} />

      {/* Mapa de ambiente HDR gerado em tempo real com painéis de luz nas cores da cena. */}
      <Environment resolution={quality === "low" ? 128 : 256} frames={1} environmentIntensity={1}>
        <color attach="background" args={["#01030a"]} />
        <Lightformer form="rect" intensity={3.2} color={th.keyLight} position={[0, 5, 4]} scale={[6, 2.5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={4} color={th.rimLight} position={[-5, 1, -2]} scale={[1.2, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} color={th.fillLight} position={[5, 0.5, -1]} scale={[1.2, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.8} color={th.accent} position={[0, -4, 2]} scale={[8, 1, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2.4} color="#ffffff" position={[2.5, 2, 5]} scale={1.2} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={1.5} color={th.glow} position={[-3, -1, 5]} scale={2} target={[0, 0, 0]} />
        {/* Painel amplo atrás da câmera: dá reflexo às faces voltadas para o espectador. */}
        <Lightformer form="rect" intensity={0.3} color={th.keyLight} position={[0, 0.5, 9]} scale={[9, 4, 1]} target={[0, 0, 0]} />
      </Environment>

      <ambientLight intensity={0.08} color="#3a4f9a" />
      <spotLight ref={key} intensity={90} angle={0.5} penumbra={1} color={th.keyLight} distance={0} decay={2} />
      <spotLight ref={rimA} position={[-3.5, 2.5, -3.5]} angle={0.6} penumbra={1} color={th.rimLight} decay={2} />
      <spotLight ref={rimB} position={[3.5, 1, -3]} angle={0.6} penumbra={1} color={th.fillLight} decay={2} />
      <pointLight ref={sweep} color={th.accent} distance={6} decay={2} />

      <group ref={bottleOffset}>
        <BackHalo color={th.glow} opacity={0.35} />
        <group ref={bottleSpin}>
          <PerfumeBottle url={mobile ? perfume.model.mobile : perfume.model.desktop} look={perfume.look} mobile={mobile} />
        </group>
      </group>
    </>
  );
}

export default function SceneCanvas({
  perfume,
  mobile,
  active = true,
  onReady,
}: {
  perfume: Perfume;
  mobile: boolean;
  active?: boolean;
  onReady?: () => void;
}) {
  const [quality, setQuality] = useState<Quality>(mobile ? "low" : "high");
  const [dpr, setDpr] = useState<number>(mobile ? 1.25 : 1.6);
  const high = quality === "high";

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false, alpha: false }}
      camera={{ fov: 30, near: 0.1, far: 200, position: [0, 0.5, 9.6] }}
      onCreated={({ gl }) => {
        gl.setClearColor("#03040b");
        // Refração do vidro em meia resolução no celular.
        const r = gl as THREE.WebGLRenderer & { transmissionResolutionScale?: number };
        if (mobile && "transmissionResolutionScale" in r) r.transmissionResolutionScale = 0.5;
      }}
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr((d) => Math.max(1, d - 0.25));
          setQuality("low");
        }}
        flipflops={2}
      />
      <Suspense fallback={null}>
        <Rig perfume={perfume} mobile={mobile} quality={quality} />
        <ReadySignal onReady={onReady} />
      </Suspense>
      <EffectComposer multisampling={high ? 4 : 0} enableNormalPass={false}>
        <Bloom mipmapBlur luminanceThreshold={0.82} luminanceSmoothing={0.18} intensity={high ? 0.75 : 0.5} radius={0.75} />
        <Vignette offset={0.22} darkness={0.78} />
        <Noise premultiply opacity={high ? 0.35 : 0.2} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    </Canvas>
  );
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      onReady?.();
    }
  });
  return null;
}
