"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Perfume } from "@/data/types";
import { experienceState } from "@/lib/experience-state";
import {
  boundaryGlow,
  burstPhase,
  DESKTOP_SHOTS,
  dissolveAt,
  MOBILE_SHOTS,
  perfumeAt,
  sampleShot,
  themeMix,
  transitionPulse,
  type Shot,
} from "@/lib/timeline";
import { BackHalo } from "./BackHalo";
import { Constellation } from "./Constellation";
import { CosmicDust } from "./CosmicDust";
import { getDissolve } from "./dissolve";
import { NebulaLayers, type NebulaCloud } from "./NebulaLayers";
import { PerfumeBottle } from "./PerfumeBottle";
import { Planet } from "./Planets";
import { SkyBlend } from "./SkyBlend";
import { StarField } from "./StarField";
import { fxState, TransitionFX } from "./TransitionFX";
import { mixUniverse, toColors } from "./universe";

export type Quality = "high" | "low";

interface SceneProps {
  perfumes: Perfume[];
  mobile: boolean;
  quality: Quality;
}

const damp = THREE.MathUtils.damp;

/** Estrutura das camadas de nebulosa; as cores vêm de cada universo. */
const CLOUD_LAYOUT: Omit<NebulaCloud, "color" | "color2">[] = [
  { position: [-9, 3, -26], scale: 30, opacity: 0.3, seed: 1.3 },
  { position: [11, -2, -32], scale: 34, opacity: 0.2, seed: 4.1 },
  { position: [2, 6, -40], scale: 40, opacity: 0.18, seed: 7.7 },
  { position: [-4, -5, -18], scale: 16, opacity: 0.14, seed: 2.9 },
  { position: [6, 2.5, -14], scale: 10, opacity: 0.08, seed: 9.4 },
];

function Universe({ perfumes, quality }: Omit<SceneProps, "mobile">) {
  const low = quality === "low";
  const themes = useMemo(() => perfumes.map((p) => p.theme), [perfumes]);
  const clouds = useMemo<NebulaCloud[]>(
    () =>
      CLOUD_LAYOUT.map((c, i) => ({
        ...c,
        color: themes.map((t) => t.nebula[i][0]),
        color2: themes.map((t) => t.nebula[i][1]),
      })),
    [themes],
  );
  const tints = useMemo(() => themes.map((t) => t.starTint), [themes]);
  const dust = useMemo(() => themes.map((t) => t.dust), [themes]);
  const planet = useMemo(() => themes.map((t) => t.planet), [themes]);
  const moon = useMemo(() => themes.map((t) => t.moon), [themes]);
  const stars = themes[0].stars;

  return (
    <>
      <SkyBlend themes={themes} octaves={low ? 5 : 6} resolution={low ? 384 : 768} />
      <NebulaLayers clouds={low ? clouds.slice(0, 3) : clouds} />
      <StarField count={low ? 1500 : 4000} radius={[38, 70]} colors={stars} tints={tints} size={0.9} seed={1} />
      <StarField count={low ? 500 : 1400} radius={[16, 36]} colors={stars} tints={tints} size={0.75} seed={2} />
      <StarField count={low ? 120 : 260} radius={[8, 15]} colors={stars} tints={tints} size={0.45} seed={3} />
      <Planet position={[-26, -15, -48]} radius={13} colorA={planet[0][0]} colorB={planet[0][1]} atmosphere={planet[0][2]} palettes={planet} sunDir={[0.9, 0.5, 0.35]} bands={9} seed={2.2} tilt={0.35} />
      <Planet position={[24, 15, -55]} radius={2.4} colorA={moon[0][0]} colorB={moon[0][1]} atmosphere={moon[0][2]} palettes={moon} sunDir={[-0.6, 0.4, 0.5]} bands={3} seed={6.1} tilt={-0.2} />
      <CosmicDust count={low ? 220 : 520} palettes={dust} />
    </>
  );
}

/** Mapa de ambiente HDR com painéis de luz nas cores do universo. */
function UniverseEnvironment({ perfume, quality }: { perfume: Perfume; quality: Quality }) {
  const th = perfume.theme;
  return (
    <Environment key={perfume.slug} resolution={quality === "low" ? 128 : 256} frames={1} environmentIntensity={1}>
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
  );
}

interface BottleSlot {
  offset: React.RefObject<THREE.Group | null>;
  spin: React.RefObject<THREE.Group | null>;
}

function Rig({ perfumes, mobile, quality }: SceneProps) {
  const n = perfumes.length;
  const shots = mobile ? MOBILE_SHOTS : DESKTOP_SHOTS;
  const key = useRef<THREE.SpotLight>(null);
  const rimA = useRef<THREE.SpotLight>(null);
  const rimB = useRef<THREE.SpotLight>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const fxGroup = useRef<THREE.Group>(null);

  // Um "encaixe" por perfume: grupos de posição/rotação e a dissolução.
  const o0 = useRef<THREE.Group>(null), s0 = useRef<THREE.Group>(null);
  const o1 = useRef<THREE.Group>(null), s1 = useRef<THREE.Group>(null);
  const o2 = useRef<THREE.Group>(null), s2 = useRef<THREE.Group>(null);
  const o3 = useRef<THREE.Group>(null), s3 = useRef<THREE.Group>(null);
  const slotRefs = [
    [o0, s0],
    [o1, s1],
    [o2, s2],
    [o3, s3],
  ] as const;
  const slots: BottleSlot[] = perfumes.slice(0, 4).map((_, i) => ({ offset: slotRefs[i][0], spin: slotRefs[i][1] }));

  // Paletas das luzes por universo.
  const lightPal = useMemo(
    () => ({
      key: toColors(perfumes.map((p) => p.theme.keyLight)),
      rim: toColors(perfumes.map((p) => p.theme.rimLight)),
      fill: toColors(perfumes.map((p) => p.theme.fillLight)),
      accent: toColors(perfumes.map((p) => p.theme.accent)),
      ambient: toColors(perfumes.map((p) => p.theme.ambient)),
    }),
    [perfumes],
  );

  // O ambiente de reflexos troca quando nenhum frasco está visível (na fronteira).
  const [envIndex, setEnvIndex] = useState(0);

  const shot = useMemo(
    () => ({ cam: [0, 0, 0] as Shot["cam"], look: [0, 0, 0] as Shot["look"], rot: 0, offset: [0, 0] as Shot["offset"], fov: 30 }),
    [],
  );
  const look = useMemo(() => new THREE.Vector3(), []);
  const smoothed = useRef({ p: experienceState.progress, px: 0, py: 0, spin: 0, tx: 0, tz: 0, lean: 0, prevP: experienceState.progress });

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const dt = Math.min(delta, 1 / 10);
    const s = smoothed.current;
    s.p = damp(s.p, experienceState.progress, 9, dt);
    const reduced = experienceState.reducedMotion;
    s.px = damp(s.px, mobile || reduced ? 0 : experienceState.pointer.x, 2.5, dt);
    s.py = damp(s.py, mobile || reduced ? 0 : experienceState.pointer.y, 2.5, dt);

    const { index, local } = perfumeAt(s.p, n);
    experienceState.universe = themeMix(s.p, n);
    const envNow = Math.round(experienceState.universe);
    if (envNow !== envIndex) setEnvIndex(envNow);

    sampleShot(shots, local, shot);
    const t = state.clock.elapsedTime;
    const idle = reduced ? 0 : 1;

    camera.position.set(shot.cam[0] + s.px * 0.18, shot.cam[1] + s.py * 0.12, shot.cam[2]);
    look.set(shot.look[0], shot.look[1], shot.look[2]);
    camera.lookAt(look);
    if (Math.abs(camera.fov - shot.fov) > 0.01) {
      camera.fov = shot.fov;
      camera.updateProjectionMatrix();
    }

    // Arraste do visitante (volta com mola) + inclinação pelo scroll.
    const d = experienceState.drag;
    const springRate = d.active ? 14 : 3.2;
    s.spin = damp(s.spin, d.spin, springRate, dt);
    s.tx = damp(s.tx, d.tiltX, springRate, dt);
    s.tz = damp(s.tz, d.tiltZ, springRate, dt);
    if (!d.active) {
      d.spin = damp(d.spin, 0, 2.2, dt);
      d.tiltX = damp(d.tiltX, 0, 3, dt);
      d.tiltZ = damp(d.tiltZ, 0, 3, dt);
    }
    const scrollVel = ((s.p - s.prevP) * n) / Math.max(dt, 1e-3);
    s.prevP = s.p;
    s.lean = damp(s.lean, reduced ? 0 : THREE.MathUtils.clamp(scrollVel * 3.2, -0.28, 0.28), 5, dt);

    // Frascos: só o do trecho atual aparece; a dissolução cuida da passagem.
    slots.forEach((slot, i) => {
      const dis = i === index ? dissolveAt(local, index) : 1;
      getDissolve(perfumes[i].slug, perfumes[i].theme.accent).uDissolve.value = dis;
      const g = slot.offset.current;
      if (!g) return;
      g.visible = dis < 0.999;
      if (!g.visible) return;
      // Ao sair, o frasco também se afasta; ao entrar, chega da profundidade.
      const away = local > 0.5 ? dis * 1.6 : -dis * 1.2;
      g.position.set(shot.offset[0], shot.offset[1] + Math.sin(t * 0.7) * 0.025 * idle, -Math.abs(away));
      g.scale.setScalar(perfumes[i].sceneScale);
      const sp = slot.spin.current;
      if (sp) {
        sp.rotation.set(
          s.tx,
          perfumes[i].frontRotationY + shot.rot + s.spin + Math.sin(t * 0.45) * 0.025 * idle,
          s.tz - s.lean + Math.sin(t * 0.33) * 0.008 * idle,
          "YXZ",
        );
      }
    });

    // Efeitos da passagem: partículas e ponto de luz no lugar do frasco.
    fxState.phase = burstPhase(local, index, n);
    fxState.glow = boundaryGlow(s.p, n);
    mixUniverse(fxState.color, lightPal.accent);
    if (fxGroup.current) fxGroup.current.position.set(shot.offset[0], shot.offset[1], 0);

    // Luzes: acompanham a rotação e misturam as cores dos universos.
    const pulse = transitionPulse(local);
    const orbit = shot.rot * 0.85;
    if (key.current) {
      key.current.position.set(Math.sin(orbit - 0.7) * 6 + shot.offset[0], 4.5, Math.cos(orbit - 0.7) * 6);
      key.current.target.position.set(shot.offset[0], 0, 0);
      key.current.target.updateMatrixWorld();
      mixUniverse(key.current.color, lightPal.key);
    }
    if (rimA.current) {
      rimA.current.intensity = 140 + pulse * 120;
      mixUniverse(rimA.current.color, lightPal.rim);
    }
    if (rimB.current) {
      rimB.current.intensity = 110 + pulse * 90;
      mixUniverse(rimB.current.color, lightPal.fill);
    }
    if (sweep.current) {
      const a = shot.rot * 1.6;
      sweep.current.position.set(shot.offset[0] + Math.sin(a) * 2.2, 0.6, Math.cos(a) * 2.2 + 1.2);
      sweep.current.intensity = pulse * 14;
      mixUniverse(sweep.current.color, lightPal.accent);
    }
    if (ambient.current) mixUniverse(ambient.current.color, lightPal.ambient);
  });

  return (
    <>
      <Universe perfumes={perfumes} quality={quality} />
      <UniverseEnvironment perfume={perfumes[Math.min(envIndex, n - 1)]} quality={quality} />

      <ambientLight ref={ambient} intensity={0.08} />
      <spotLight ref={key} intensity={90} angle={0.5} penumbra={1} distance={0} decay={2} />
      <spotLight ref={rimA} position={[-3.5, 2.5, -3.5]} angle={0.6} penumbra={1} decay={2} />
      <spotLight ref={rimB} position={[3.5, 1, -3]} angle={0.6} penumbra={1} decay={2} />
      <pointLight ref={sweep} distance={6} decay={2} />

      <group ref={fxGroup}>
        <TransitionFX count={mobile ? 450 : 900} />
      </group>
      <Constellation shots={shots} n={n} mobile={mobile} />

      {slots.map((slot, i) => (
        <group key={perfumes[i].slug} ref={slot.offset} visible={i === 0}>
          <BackHalo color={perfumes[i].theme.glow} opacity={0.35} />
          <group ref={slot.spin}>
            {/* O primeiro frasco segura a tela de carregamento; os outros carregam em segundo plano. */}
            {i === 0 ? (
              <PerfumeBottle
                url={mobile ? perfumes[i].model.mobile : perfumes[i].model.desktop}
                liquidPoints={perfumes[i].model.liquid}
                look={perfumes[i].look}
                mobile={mobile}
                dissolveKey={perfumes[i].slug}
              />
            ) : (
              <Suspense fallback={null}>
                <PerfumeBottle
                  url={mobile ? perfumes[i].model.mobile : perfumes[i].model.desktop}
                  liquidPoints={perfumes[i].model.liquid}
                  look={perfumes[i].look}
                  mobile={mobile}
                  dissolveKey={perfumes[i].slug}
                />
              </Suspense>
            )}
          </group>
        </group>
      ))}
    </>
  );
}

export default function SceneCanvas({
  perfumes,
  mobile,
  active = true,
  onReady,
}: {
  perfumes: Perfume[];
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
        <Rig perfumes={perfumes} mobile={mobile} quality={quality} />
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
