"use client";

import { Environment, Lightformer, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { bottles } from "@/data/perfumes";
import { NebulaSky } from "./NebulaSky";
import { PerfumeBottle } from "./PerfumeBottle";

/**
 * Laboratório: arraste para girar, role para aproximar.
 * Parâmetros de URL: ?p=<slug>&angle=<graus>&spin=1 (balança para testar o líquido)
 */
function useSpinner({ angle, spin, tilt }: { angle: number; spin: boolean; tilt: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.elapsedTime;
    g.current.rotation.y = (angle * Math.PI) / 180 + (spin ? Math.sin(t * 1.3) * 0.9 : 0);
    // "Balanço": o frasco também pende de um lado para o outro.
    g.current.rotation.z = (tilt * Math.PI) / 180 + (spin ? Math.sin(t * 1.9) * 0.45 : 0);
  });
  return g as React.RefObject<THREE.Group>;
}

function Bottle({ angle, spin, slug, tilt }: { angle: number; spin: boolean; slug: string; tilt: number }) {
  const p = bottles.find((x) => x.slug === slug) ?? bottles[0];
  const g = useSpinner({ angle, spin, tilt });
  return (
    <>
      <NebulaSky theme={p.theme} resolution={512} octaves={5} />
      <Environment key={p.slug} resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.2} color={p.theme.keyLight} position={[0, 5, 4]} scale={[6, 2.5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={4} color={p.theme.rimLight} position={[-5, 1, -2]} scale={[1.2, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} color={p.theme.fillLight} position={[5, 0.5, -1]} scale={[1.2, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.8} color={p.theme.accent} position={[0, -4, 2]} scale={[8, 1, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.3} color={p.theme.keyLight} position={[0, 0.5, 9]} scale={[9, 4, 1]} target={[0, 0, 0]} />
      </Environment>
      <spotLight position={[-3, 4.5, 5]} intensity={90} angle={0.5} penumbra={1} color={p.theme.keyLight} />
      <spotLight position={[-3.5, 2.5, -3.5]} intensity={140} angle={0.6} penumbra={1} color={p.theme.rimLight} />
      <spotLight position={[3.5, 1, -3]} intensity={110} angle={0.6} penumbra={1} color={p.theme.fillLight} />
      {/* Arrastar gira e inclina o PRÓPRIO frasco (não a câmera), então o líquido reage. */}
      <PresentationControls global cursor snap speed={1.4} polar={[-0.7, 0.7]} azimuth={[-Infinity, Infinity]} damping={0.25}>
        <group ref={g}>
          <Suspense fallback={null}>
            <PerfumeBottle url={p.model.desktop} liquidPoints={p.model.liquid} look={p.look} />
          </Suspense>
        </group>
      </PresentationControls>
    </>
  );
}

interface LabProps {
  slug?: string;
  angle?: number;
  spin?: boolean;
  dist?: number;
  tilt?: number;
  /** false quando quem usa já cuida do pré-carregamento (prévia estática). */
  preload?: boolean;
}

export default function LabCanvas(props: LabProps) {
  // Pré-carrega os outros frascos depois do primeiro: a troca fica imediata.
  const preload = props.preload ?? true;
  useEffect(() => {
    if (!preload) return;
    const id = window.setTimeout(() => {
      bottles.forEach((b) => {
        useGLTF.preload(b.model.desktop);
        if (b.model.liquid) fetch(b.model.liquid).catch(() => {});
      });
    }, 1500);
    return () => window.clearTimeout(id);
  }, [preload]);
  const [params] = useState(() => (typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search)));
  const angle = props.angle ?? Number(params.get("angle") ?? 0);
  const spin = props.spin ?? params.get("spin") === "1";
  const slug = props.slug ?? params.get("p") ?? "lattafa-art-of-universe";
  const dist = props.dist ?? Number(params.get("dist") ?? 5.6);
  const tilt = props.tilt ?? Number(params.get("tilt") ?? 0);
  return (
    <Canvas dpr={[1, 1.75]} camera={{ fov: 30, position: [0, 0.2, dist] }} gl={{ antialias: false }}>
      <Suspense fallback={null}>
        <Bottle angle={angle} spin={spin} slug={slug} tilt={tilt} />
      </Suspense>
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={0.85} intensity={0.6} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    </Canvas>
  );
}
