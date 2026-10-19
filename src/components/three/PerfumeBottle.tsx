"use client";

import { useGLTF } from "@react-three/drei";
import { forwardRef, useMemo } from "react";
import * as THREE from "three";

/**
 * Carrega o GLB real do perfume. Os modelos (Meshy AI) têm uma única malha e
 * um único material com cor, metal/rugosidade e normal "assados" na textura.
 *
 * Ajuste de material (não destrutivo): trocamos MeshStandardMaterial por
 * MeshPhysicalMaterial reaproveitando EXATAMENTE as mesmas texturas, e
 * acrescentamos uma camada de verniz (clearcoat) fina que dá o brilho de vidro
 * polido. Nenhuma cor, rótulo ou logotipo é alterado. `clearcoat={0}` volta ao
 * visual original do arquivo.
 */
interface Props {
  url: string;
  clearcoat?: number;
  envIntensity?: number;
}

export const PerfumeBottle = forwardRef<THREE.Group, Props>(function PerfumeBottle(
  { url, clearcoat = 0.7, envIntensity = 1.25 },
  ref,
) {
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material as THREE.MeshStandardMaterial;
      const m = new THREE.MeshPhysicalMaterial({
        map: src.map,
        normalMap: src.normalMap,
        normalScale: src.normalScale?.clone() ?? new THREE.Vector2(1, 1),
        metalnessMap: src.metalnessMap,
        roughnessMap: src.roughnessMap,
        metalness: src.metalness,
        roughness: src.roughness,
        color: src.color.clone(),
        side: src.side,
        clearcoat,
        clearcoatRoughness: 0.06,
        envMapIntensity: envIntensity,
        specularIntensity: 1,
        ior: 1.5,
      });
      mesh.material = m;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
    // Normaliza: altura de 2 unidades, centro na origem.
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 2 / size.y;
    root.scale.setScalar(s);
    root.position.copy(center.multiplyScalar(-s));
    return root;
  }, [scene, clearcoat, envIntensity]);

  return (
    <group ref={ref}>
      <primitive object={model} />
    </group>
  );
});

export function preloadBottle(url: string) {
  useGLTF.preload(url);
}
